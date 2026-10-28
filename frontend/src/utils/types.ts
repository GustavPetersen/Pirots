import * as z from "zod";
import { SLOT_SYMBOL_SCHEMA, SPIN_RESULT_SCHEMA } from "./constants";

export type SlotSymbol = z.infer<typeof SLOT_SYMBOL_SCHEMA>;
export type SpinResult = z.infer<typeof SPIN_RESULT_SCHEMA>;
