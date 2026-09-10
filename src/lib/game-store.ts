import { useSyncExternalStore } from "react";

export type GameState = {
  connected: boolean;
  address: string | null;
  tokens: number;
  unlockedLevels: number;
  selectedLevel: number;
  squad: (string | null)[];
  commander: string | null;
  cardLevels: Record<string, number>;
  mode: "campaign" | "ai" | "human";
};

const initial: GameState = {
  connected: false,
  address: null,
  tokens: 1250,
  unlockedLevels: 4,
  selectedLevel: 1,
  squad: ["pip", "kit", "mossy", null, null, null, null],
  commander: "umbra",
  cardLevels: {},
  mode: "campaign",
};

let state: GameState = initial;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setGameState(patch: Partial<GameState> | ((s: GameState) => Partial<GameState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  emit();
}

export function useGameState(): GameState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

export function cardLevel(s: GameState, id: string, base: number) {
  return base + (s.cardLevels[id] ?? 0);
}
