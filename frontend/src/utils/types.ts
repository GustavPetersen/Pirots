import * as z from "zod";
import { POSITION_SCHEMA, SLOT_SYMBOL_SCHEMA, SPIN_RESULT_SCHEMA } from "./constants";

export type Position = z.infer<typeof POSITION_SCHEMA>;
export type SlotSymbol = z.infer<typeof SLOT_SYMBOL_SCHEMA>;
export type SpinResult = z.infer<typeof SPIN_RESULT_SCHEMA>;
