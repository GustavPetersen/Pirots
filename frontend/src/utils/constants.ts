import * as z from "zod";
import { Texture } from "pixi.js";
import type { SlotSymbol } from "./types";

export const PRISONERS = ["p_green", "p_blue", "p_red", "p_orange"] as const;
export const ALL_SYMBOLS = [...PRISONERS, "empty", "d_green", "d_blue", "d_red", "d_orange"] as const

export const SLOT_SYMBOL_SCHEMA = z.enum(ALL_SYMBOLS);

export const POSITION_SCHEMA = z.object({
    x: z.number(),
    y: z.number(),
});

export const SPIN_RESULT_SCHEMA = z.object({
    initialBoard: z.array(z.array(SLOT_SYMBOL_SCHEMA)),
    prisonerMovements: z.array(z.array(POSITION_SCHEMA)),
});

export const BOARD_WIDTH = 6;

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
// Useful for ensuring type-safety with string literals
export const getSymbolTexture = (s: SlotSymbol) => Texture.from(s); 
