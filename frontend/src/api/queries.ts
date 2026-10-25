import * as z from "zod";
import type { SpinResult } from "../utils/types";
import { SPIN_RESULT_SCHEMA } from "../utils/constants";

async function apiRequest<T>(url: string, schema: z.ZodType<T>): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_URL ?? "/api";

    const response = await fetch(`${baseUrl}${url}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return schema.parse(await response.json());
}

export function getSpin(bet: number, idempotencyKey: number): () => Promise<SpinResult> {
    return async () => {
        const params = {
            bet: String(bet),
            idempotencyKey: String(idempotencyKey),
        };

        const queryString = new URLSearchParams(params).toString();
        return await apiRequest<SpinResult>(`/spin?${queryString}`, SPIN_RESULT_SCHEMA);
    }
}