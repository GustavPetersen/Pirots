import * as z from "zod";
import { Texture } from "pixi.js";
import type { SlotSymbol } from "./types";
import { Queue } from "./queue";

export const PRISONERS = ["p_green", "p_blue", "p_red", "p_orange"] as const;
export const ALL_SYMBOLS = [...PRISONERS, "empty", "d_green", "d_blue", "d_red", "d_orange"] as const

export const SLOT_SYMBOL_SCHEMA = z.enum(ALL_SYMBOLS);

export const SPIN_RESULT_SCHEMA = z.object({
    symbolReel: z.array(SLOT_SYMBOL_SCHEMA).transform(symbols => {
        const reel = new Queue<SlotSymbol>();
        symbols.forEach(s => reel.pushBack(s));
        return reel;
    }),
    prisonerWalks: z.array(z.array(z.number())).transform(walks => {
        const walkQueue = new Queue<number[]>();
        walks.forEach(walk => walkQueue.pushBack(walk));
        return walkQueue;
    }),
});

export const BOARD_WIDTH = 6;
export const BOARD_HEIGHT = 6;

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
// Useful for ensuring type-safety with string literals
export const getSymbolTexture = (s: SlotSymbol) => Texture.from(s); 
