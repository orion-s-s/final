import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DeskScene, SketchButton, TokenPill } from "@/components/game/DeskScene";
import { EmptySlot, GameCard } from "@/components/game/GameCard";
import {
  CAMPAIGN_LEVELS,
  COLLECTION,
  LEVEL_MAX,
  MULTIVERSE_CARDS,
  MULTIVERSE_MAX,
  SHADOW_COMMANDERS,
  friendCard,
  levelCost,
  multiverseDef,
  reviveCost,
} from "@/lib/game-data";
import { levelOf, setGameState, useGameState } from "@/lib/game-store";

export const Route = createFileRoute("/squad")({
  head: () => ({
    meta: [
      { title: "Squad Setup — Weird Wars" },
      {
        name: "description",
        content:
          "Pick seven friend cards, one shadow commander and up to ten Multiverse armour cards, then spend Weird to level up.",
      },
      { property: "og:title", content: "Squad Setup — Weird Wars" },
      {
        property: "og:description",
        content: "Deck builder for your friends, your shadow commander and Multiverse armour.",
      },
    ],
  }),
  component: SquadScreen,
});

function SquadScreen() {
  const state = useGameState();
  const navigate = useNavigate();
  const [pickingSlot, setPickingSlot] = useState<number | null>(null);
  const [pickingCommander, setPickingCommander] = useState(false);

  const locked = state.runActive && state.mode === "campaign";
  const filled = state.squad.filter(Boolean).length;
  const levelName = CAMPAIGN_LEVELS.find((l) => l.id === state.selectedLevel)?.name ?? "Skirmish";
  const commander = SHADOW_COMMANDERS.find((c) => c.id === state.commander) ?? null;

  const assign = (cardId: string) => {
    if (pickingCommander) {
      setGameState({ commander: cardId });
      setPickingCommander(false);
      return;
    }
    if (pickingSlot === null || locked) return;
    const squad = [...state.squad];
    const existing = squad.indexOf(cardId);
    if (existing !== -1) squad[existing] = null;
    squad[pickingSlot] = cardId;
    setGameState({ squad });
    setPickingSlot(null);
  };

  const levelUp = (id: string) => {
    const lvl = levelOf(state, id);
    if (locked || lvl >= LEVEL_MAX || lvl >= state.shadowLevel) return;
    const cost = levelCost(lvl + 1);
    if (state.weird < cost) return;
    setGameState((s) => ({
      weird: s.weird - cost,
      cardLevels: { ...s.cardLevels, [id]: lvl + 1 },
    }));
  };

  const levelShadow = () => {
    if (locked || state.shadowLevel >= LEVEL_MAX) return;
    const cost = levelCost(state.shadowLevel + 1);
    if (state.weird < cost) return;
    setGameState((s) => ({ weird: s.weird - cost, shadowLevel: s.shadowLevel + 1 }));
  };

  const revive = (id: string) => {
    const cost = reviveCost(levelOf(state, id));
    if (state.weird < cost) return;
    setGameState((s) => ({ weird: s.weird - cost, downed: s.downed.filter((d) => d !== id) }));
  };

  const toggleMultiverse = (id: string) => {
    if (locked) return;
    setGameState((s) => {
      if (s.multiverse.includes(id)) return { multiverse: s.multiverse.filter((m) => m !== id) };
      if (s.multiverse.length >= MULTIVERSE_MAX) return {};
      return { multiverse: [...s.multiverse, id] };
    });
  };

  return (
    <DeskScene
      title="Squad Setup"
      back={{ to: state.mode === "campaign" ? "/campaign" : "/", label: "Back" }}
      hud={
        <>
          <span className="sketch-border-alt bg-sky px-3 py-1 font-hand text-sm text-ink">{levelName}</span>
          <TokenPill tokens={state.weird} />
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-extrabold text-ink">
              Friends <span className="font-hand text-base text-muted-foreground">({filled}/7 slots)</span>
            </h2>
            {locked ? (
              <span className="font-hand text-sm text-coral">Chapter in progress — squad is locked.</span>
            ) : (
              (pickingSlot !== null || pickingCommander) && (
                <span className="animate-pop font-hand text-sm text-weird">
                  Pick a card from the collection below ↓
                </span>
              )
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {state.squad.map((id, i) => {
              const card = id ? friendCard(id) : null;
              if (!card) {
                return <EmptySlot key={i} label={`Friend slot ${i + 1}`} onClick={() => setPickingSlot(i)} />;
              }
              const lvl = levelOf(state, card.id);
              const down = state.downed.includes(card.id);
              const up = levelCost(lvl + 1);
              return (
                <div key={i} className="relative">
                  <GameCard card={card} level={lvl} className={down ? "opacity-50" : undefined} />
                  {!locked && (
                    <button
                      type="button"
                      onClick={() => {
                        const squad = [...state.squad];
                        squad[i] = null;
                        setGameState({ squad });
                      }}
                      className="sketch-border-alt absolute -right-2 -top-2 h-7 w-7 bg-coral font-display text-sm font-bold text-ink"
                      aria-label={`Remove ${card.name}`}
                    >
                      ✕
                    </button>
                  )}
                  <div className="mt-1 flex justify-center">
                    {down ? (
                      <SketchButton
                        tone="coral"
                        size="sm"
                        disabled={state.weird < reviveCost(lvl)}
                        onClick={() => revive(card.id)}
                      >
                        Revive · {reviveCost(lvl)} Weird
                      </SketchButton>
                    ) : (
                      <SketchButton
                        tone="sunshine"
                        size="sm"
                        disabled={locked || lvl >= LEVEL_MAX || lvl >= state.shadowLevel || state.weird < up}
                        onClick={() => levelUp(card.id)}
                      >
                        {lvl >= LEVEL_MAX ? "Max level" : `Level up · ${up} Weird`}
                      </SketchButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="mb-2 mt-6 font-display text-xl font-extrabold text-ink">Shadow Commander</h2>
          <div className="flex flex-wrap items-start gap-3">
            {commander ? (
              <GameCard card={commander} size="lg" level={state.shadowLevel} />
            ) : (
              <EmptySlot label="Shadow slot" onClick={() => setPickingCommander(true)} />
            )}
            <div className="space-y-2">
              <SketchButton tone="paper" size="sm" onClick={() => setPickingCommander(true)}>
                Swap commander
              </SketchButton>
              <SketchButton
                tone="sunshine"
                size="sm"
                disabled={locked || state.shadowLevel >= LEVEL_MAX || state.weird < levelCost(state.shadowLevel + 1)}
                onClick={levelShadow}
              >
                {state.shadowLevel >= LEVEL_MAX
                  ? "Max level"
                  : `Level shadow · ${levelCost(state.shadowLevel + 1)} Weird`}
              </SketchButton>
              <p className="max-w-[180px] font-hand text-xs text-muted-foreground">
                Friends can never out-level the shadow. The shadow never steps onto the page.
              </p>
            </div>
          </div>

          <h2 className="mb-2 mt-6 font-display text-xl font-extrabold text-ink">
            Multiverse armour{" "}
            <span className="font-hand text-base text-muted-foreground">
              ({state.multiverse.length}/{MULTIVERSE_MAX} · +{multiverseDef(state.multiverse)} DEF)
            </span>
          </h2>
          <div className="sketch-border flex gap-3 overflow-x-auto bg-paper-shade/40 p-3">
            {MULTIVERSE_CARDS.map((card) => (
              <GameCard
                key={card.id}
                card={card}
                size="sm"
                selected={state.multiverse.includes(card.id)}
                onClick={() => toggleMultiverse(card.id)}
              />
            ))}
          </div>

          <h2 className="mb-2 mt-6 font-display text-xl font-extrabold text-ink">Collection</h2>
          <div className="sketch-border flex gap-3 overflow-x-auto bg-paper-shade/40 p-3">
            {pickingCommander
              ? SHADOW_COMMANDERS.map((card) => (
                  <GameCard
                    key={card.id}
                    card={card}
                    size="sm"
                    level={state.shadowLevel}
                    selected={state.commander === card.id}
                    onClick={() => assign(card.id)}
                  />
                ))
              : COLLECTION.map((card) => (
                  <GameCard
                    key={card.id}
                    card={card}
                    size="sm"
                    level={levelOf(state, card.id)}
                    selected={state.squad.includes(card.id)}
                    onClick={() => assign(card.id)}
                  />
                ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="sketch-border paper-grain ink-shadow p-4">
            <h3 className="font-display text-lg font-extrabold text-ink">House rules</h3>
            <ul className="mt-1 space-y-1 font-hand text-sm text-ink">
              <li>· Levelling and free swaps happen between chapters only.</li>
              <li>· Inside a chapter a fallen friend costs 25 × level Weird to bring back.</li>
              <li>· Defeat resets every level, and the Weird you spent is gone.</li>
              <li>· Each Multiverse card gives every friend +2 DEF for one fight.</li>
            </ul>
          </div>

          <div className="sketch-border bg-mint/40 p-4">
            <h3 className="font-display text-lg font-extrabold text-ink">Ready?</h3>
            <p className="font-hand text-sm text-ink">
              {filled < 3 ? "Bring at least 3 friends to the page." : "Your drawings are awake and twitching."}
            </p>
            <div className="mt-3">
              <SketchButton size="lg" disabled={filled < 3} onClick={() => navigate({ to: "/battle" })}>
                Start Battle ⚔
              </SketchButton>
            </div>
          </div>
        </aside>
      </div>
    </DeskScene>
  );
}
