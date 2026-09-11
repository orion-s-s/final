import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DeskScene, SketchButton } from "@/components/game/DeskScene";
import { EnemyArt } from "@/components/game/EnemyArt";
import { CAMPAIGN_LEVELS, TRAINING_ROSTER, waveRoster, waveScale } from "@/lib/game-data";
import { resetProgression, setGameState, useGameState } from "@/lib/game-store";
import {
  COLS,
  ROWS,
  type BattleUnit,
  beginTurn,
  buildEnemies,
  buildFriends,
  buildQueue,
  canStand,
  dropChance,
  endOfRound,
  enemyTurn,
  friendAttack,
  gapBetween,
  moveRangeFor,
  outcomeOf,
  unitAt,
  useSpecial,
} from "@/lib/combat";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/battle")({
  head: () => ({
    meta: [
      { title: "Battlefield — Weird Wars" },
      {
        name: "description",
        content:
          "Turn-based grid tactics inside the sketchbook: move by SPD, strike with ATK, and unleash each drawing's special trait.",
      },
      { property: "og:title", content: "Battlefield — Weird Wars" },
      {
        property: "og:description",
        content: "Speed-ordered turns, real abilities and Blot behaviours on a hand-drawn grid.",
      },
    ],
  }),
  component: BattleScreen,
});

function BattleScreen() {
  const state = useGameState();
  const navigate = useNavigate();

  const chapter = CAMPAIGN_LEVELS.find((c) => c.id === state.selectedLevel) ?? CAMPAIGN_LEVELS[0]!;

  const setup = useMemo(() => {
    const friends = buildFriends(state);
    const roster =
      state.mode === "campaign"
        ? chapter.encounter
        : state.mode === "endless"
          ? waveRoster(state.endlessWave)
          : TRAINING_ROSTER;
    const scale = state.mode === "endless" ? waveScale(state.endlessWave) : 1;
    return [...friends, ...buildEnemies(roster, scale)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.squad, state.commander, state.cardLevels, state.shadowLevel, state.multiverse, state.mode, state.selectedLevel, state.endlessWave]);

  const [units, setUnits] = useState<BattleUnit[]>(setup);
  const [queue, setQueue] = useState<string[]>(() => buildQueue(setup));
  const [round, setRound] = useState(1);
  const [moved, setMoved] = useState(false);
  const [log, setLog] = useState<string[]>([
    state.mode === "campaign"
      ? `${chapter.chapter}: the page trembles. Battle begins!`
      : state.mode === "endless"
        ? `Wave ${state.endlessWave} spills across the page.`
        : "Training page — nothing here is permanent.",
  ]);
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);

  const alive = units.filter((u) => u.hp > 0);
  const activeKey = queue[0] ?? null;
  const active = alive.find((u) => u.key === activeKey) ?? null;
  const isFriendTurn = active?.side === "friend";

  const pushLog = (lines: string[]) => setLog((l) => [...lines.reverse(), ...l].slice(0, 8));

  const finish = (next: BattleUnit[]) => {
    const o = outcomeOf(next);
    if (o) setOutcome(o);
    return o;
  };

  /** Advance the queue, auto-playing every enemy turn until a friend is up. */
  const advance = (fromUnits: BattleUnit[], fromQueue: string[]) => {
    let u = fromUnits;
    let q = fromQueue.slice(1);
    const lines: string[] = [];

    for (;;) {
      if (outcomeOf(u)) break;
      if (!q.length) {
        u = endOfRound(u);
        q = buildQueue(u);
        setRound((r) => r + 1);
        lines.push("— the page turns, a new round begins —");
      }
      // drop dead units from the queue
      while (q.length && !u.some((x) => x.key === q[0] && x.hp > 0)) q = q.slice(1);
      if (!q.length) continue;
      const cur = u.find((x) => x.key === q[0])!;
      u = beginTurn(u, cur.key);
      if (cur.side === "friend") break;
      const r = enemyTurn(u, cur.key);
      u = r.units;
      lines.push(...r.log);
      if (outcomeOf(u)) break;
      q = q.slice(1);
    }

    setUnits(u);
    setQueue(q);
    setMoved(false);
    if (lines.length) pushLog(lines);
    finish(u);
  };

  const onTile = (x: number, y: number) => {
    if (outcome || !active || !isFriendTurn) return;
    const occupant = unitAt(units, x, y);

    if (occupant && occupant.side === "blot") {
      if (gapBetween(active, occupant) > active.range) {
        pushLog([`${active.name} is too far from ${occupant.name}.`]);
        return;
      }
      const r = friendAttack(units, active.key, occupant.key);
      pushLog(r.log);
      advance(r.units, queue);
      return;
    }

    if (occupant) return;
    if (moved) {
      pushLog([`${active.name} has already moved this turn.`]);
      return;
    }
    const dist = Math.abs(x - active.x) + Math.abs(y - active.y);
    if (dist > moveRangeFor(active.spd)) {
      pushLog([`Too far — ${active.name} walks ${moveRangeFor(active.spd)} tiles.`]);
      return;
    }
    if (!canStand(units, active, x, y)) return;
    setUnits(units.map((u) => (u.key === active.key ? { ...u, x, y } : u)));
    setMoved(true);
  };

  const doSpecial = () => {
    if (!active || !isFriendTurn || outcome) return;
    const r = useSpecial(units, active.key);
    pushLog(r.log);
    advance(r.units, queue);
  };

  const skip = () => {
    if (!active || !isFriendTurn || outcome) return;
    pushLog([`${active.name} holds the line.`]);
    advance(units, queue);
  };

  const restart = () => {
    setUnits(setup);
    setQueue(buildQueue(setup));
    setRound(1);
    setMoved(false);
    setOutcome(null);
    setLog(["A fresh page. Try again!"]);
  };

  const claim = () => {
    const luck = dropChance(units);
    const reward = state.mode === "campaign" ? chapter.rewardWeird : state.mode === "endless" ? 40 : 0;
    const downed = units.filter((u) => u.side === "friend" && u.hp <= 0).map((u) => u.cardId);
    setGameState((s) => ({
      weird: s.weird + reward,
      xp: s.xp + (s.mode === "training" ? 0 : 25),
      downed: s.mode === "training" ? s.downed : [...new Set([...s.downed, ...downed])],
      runActive: false,
      endlessWave: s.mode === "endless" ? s.endlessWave + 1 : s.endlessWave,
      endlessBest: s.mode === "endless" ? Math.max(s.endlessBest, s.endlessWave + 1) : s.endlessBest,
      unlockedLevels:
        s.mode === "campaign"
          ? Math.min(CAMPAIGN_LEVELS.length, Math.max(s.unlockedLevels, s.selectedLevel + 1))
          : s.unlockedLevels,
    }));
    if (state.mode === "endless") {
      restart();
      return;
    }
    navigate({ to: state.mode === "campaign" ? "/campaign" : "/" });
    void luck;
  };

  const acceptDefeat = () => {
    if (state.mode !== "training") resetProgression();
    navigate({ to: state.mode === "campaign" ? "/campaign" : "/" });
  };

  return (
    <DeskScene
      title="Battlefield"
      back={{ to: "/squad", label: "Squad" }}
      hud={
        <>
          <span className="sketch-border-alt bg-paper-shade px-3 py-1 font-hand text-sm">
            {state.mode === "campaign"
              ? chapter.chapter
              : state.mode === "endless"
                ? `Wave ${state.endlessWave}`
                : "Training"}{" "}
            · Round {round}
          </span>
          <span className="sketch-border-alt bg-sky px-3 py-1 font-display text-sm font-bold text-ink">
            {active ? `${active.name}'s turn` : "…"}
          </span>
        </>
      }
    >
      <div className="relative">
        {/* speed / turn order bar */}
        <div className="sketch-border mb-4 flex items-center gap-2 overflow-x-auto bg-paper-shade/50 p-2">
          <span className="shrink-0 font-display text-sm font-bold text-ink">Speed order →</span>
          {queue
            .map((k) => alive.find((u) => u.key === k))
            .filter((u): u is BattleUnit => Boolean(u))
            .map((u, i) => (
              <span
                key={u.key}
                className={cn(
                  "sketch-border-alt flex shrink-0 items-center gap-1 px-2 py-1 font-hand text-xs",
                  u.side === "friend" ? "bg-mint" : "bg-blot text-paper",
                  i === 0 && "ring-2 ring-weird",
                )}
              >
                {u.side === "friend" && u.art ? (
                  <img src={u.art} alt="" width={768} height={768} loading="lazy" className="h-6 w-6 object-contain" />
                ) : (
                  <EnemyArt id={u.cardId} className="h-6 w-6" />
                )}
                {u.name.split(" ")[0]} · ⚡{u.spd}
              </span>
            ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          {/* grid */}
          <div className="sketch-border relative bg-paper-shade/30 p-2">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
              {Array.from({ length: COLS * ROWS }).map((_, idx) => {
                const x = idx % COLS;
                const y = Math.floor(idx / COLS);
                const reachable =
                  active && isFriendTurn && !moved && !unitAt(units, x, y)
                    ? Math.abs(x - active.x) + Math.abs(y - active.y) <= moveRangeFor(active.spd)
                    : false;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onTile(x, y)}
                    className={cn(
                      "aspect-square border-2 border-dashed border-ink/25 transition-colors",
                      (x + y) % 2 === 0 ? "bg-paper" : "bg-paper-shade/50",
                      reachable && "bg-mint/40 hover:bg-mint/60",
                    )}
                    aria-label={`Tile ${x},${y}`}
                  />
                );
              })}
            </div>

            {/* unit overlay grid */}
            <div
              className="pointer-events-none absolute inset-2 grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`,
                gridTemplateRows: `repeat(${ROWS}, minmax(0,1fr))`,
              }}
            >
              {alive.map((u) => (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => onTile(u.x, u.y)}
                  style={{ gridColumn: `${u.x + 1} / span ${u.w}`, gridRow: `${u.y + 1} / span ${u.h}` }}
                  className={cn(
                    "pointer-events-auto relative flex items-center justify-center",
                    u.key === activeKey && "sketch-border-alt bg-weird/15",
                  )}
                  aria-label={`${u.name} ${u.hp}/${u.maxHp} hit points`}
                >
                  {u.side === "friend" && u.art ? (
                    <img
                      src={u.art}
                      alt={u.name}
                      loading="lazy"
                      width={768}
                      height={768}
                      className="animate-float h-full w-full object-contain p-0.5"
                    />
                  ) : (
                    <EnemyArt id={u.cardId} title={u.name} className="animate-wobble h-full w-full p-0.5" />
                  )}
                  <span className="absolute inset-x-1 bottom-0.5 h-1.5 border border-ink bg-paper">
                    <span
                      className={cn("block h-full", u.side === "friend" ? "bg-mint" : "bg-coral")}
                      style={{ width: `${(u.hp / u.maxHp) * 100}%` }}
                    />
                  </span>
                  <span className="absolute left-0.5 top-0.5 font-display text-[10px] font-bold text-ink">
                    {u.hp}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="sketch-border bg-paper-shade/40 p-3">
              <h3 className="font-display text-base font-extrabold text-ink">
                {active ? active.name : "Waiting…"}
              </h3>
              {active && (
                <p className="font-hand text-sm text-ink">
                  ⚔ {active.atk} · ❤ {active.hp}/{active.maxHp} · ⚡ {active.spd} · ✨ {active.mag} · 🎯 {active.crt}% ·
                  🛡 {active.def}
                </p>
              )}
              <p className="mt-1 font-hand text-xs text-muted-foreground">
                {isFriendTurn
                  ? `Walk up to ${active ? moveRangeFor(active.spd) : 0} tiles, then attack an adjacent Blot or use the special.`
                  : "The Blots are moving…"}
              </p>
              {isFriendTurn && active?.specialName && (
                <div className="mt-2">
                  <SketchButton tone="weird" size="sm" onClick={doSpecial}>
                    {active.specialName}
                  </SketchButton>
                  <p className="mt-1 font-hand text-xs text-ink">{active.specialText}</p>
                </div>
              )}
              <div className="mt-2">
                <SketchButton tone="coral" size="sm" onClick={skip} disabled={!isFriendTurn}>
                  End turn ↺
                </SketchButton>
              </div>
            </div>

            <div className="sketch-border bg-paper p-3">
              <h3 className="font-display text-base font-extrabold text-ink">Battle log</h3>
              <ul className="mt-1 space-y-1 font-hand text-xs text-muted-foreground">
                {log.map((l, i) => (
                  <li key={i} className={i === 0 ? "text-ink" : undefined}>
                    · {l}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {outcome && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/55 p-4">
            <div className="animate-pop paper-grain sketch-border ink-shadow max-w-md p-6 text-center">
              <h2
                className={cn(
                  "font-display text-5xl font-extrabold",
                  outcome === "win" ? "text-mint" : "text-coral",
                )}
              >
                {outcome === "win" ? "Victory!" : "Defeat…"}
              </h2>
              <p className="mt-2 font-hand text-lg text-ink">
                {outcome === "win"
                  ? state.mode === "campaign"
                    ? `The Blot dries up and the page turns bright again. +${chapter.rewardWeird} Weird.`
                    : state.mode === "endless"
                      ? "Wave cleared. The next one is already seeping through. +40 Weird."
                      : "Training done — no rewards, no risk."
                  : state.mode === "training"
                    ? "Only a practice page. Nothing is lost."
                    : "The ink spread too far. Every level resets and the chapter starts again."}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {outcome === "win" ? (
                  <SketchButton tone="mint" onClick={claim}>
                    {state.mode === "endless" ? "Next wave" : "Claim reward"}
                  </SketchButton>
                ) : (
                  <>
                    <SketchButton tone="coral" onClick={restart}>
                      Try again
                    </SketchButton>
                    <SketchButton tone="paper" onClick={acceptDefeat}>
                      Back
                    </SketchButton>
                  </>
                )}
                <SketchButton tone="paper" onClick={() => navigate({ to: "/squad" })}>
                  Edit squad
                </SketchButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </DeskScene>
  );
}
