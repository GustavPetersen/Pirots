export const NO_SYMBOL = Symbol();
export type SlotSymbol = number | typeof NO_SYMBOL;

// -1 -> this < other
// 0 -> this == other
// 1 -> this > other
export interface Comparable<T> {
    compareTo(other: T): -1 | 0 | 1;
}
