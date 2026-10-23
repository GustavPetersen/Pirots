export const NO_SYMBOL = Symbol();
export type SlotSymbol = number | typeof NO_SYMBOL;
export type SpinResult = {
    initialGrid: any,
    prisonerMovements: any
};