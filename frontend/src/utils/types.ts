import type { PRISONER_COLORS } from "./constants";

export type Position = {
  x: number;
  y: number;
};

export type PrisonerColor = (typeof PRISONER_COLORS)[number];

export type PrisonerMovement = {
  startingPosition: Position;
  movements: Array<Position>;
};

export type SpinResult = {
  initialGrid: Array<Array<{ name: string }>>;
  prisonerMovements: Record<PrisonerColor, PrisonerMovement>;
};
