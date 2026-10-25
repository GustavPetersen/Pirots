import type { PrisonerColor } from "./types";

export const PRISONER_COLORS = ["Green", "Blue", "Red", "Orange"] as const;
export const GRID_WIDTH = 6;
export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
export const prisonerTextureIds: Record<PrisonerColor, string> = {
    Green: "p_green",
    Blue: "p_blue",
    Red: "p_red",
    Orange: "p_orange",
};

export const symbolTextureIds: Record<string, string> = {
    empty: "transparent",
    green: "d_green",
    blue: "d_blue",
    red: "d_red",
    orange: "d_orange",
};