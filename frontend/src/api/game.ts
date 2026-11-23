import * as z from "zod";
import type { SpinResult } from "../utils/types";
import { SPIN_RESULT_SCHEMA } from "../utils/constants";
import { HttpError } from "../utils/Errors";

const baseUrl = import.meta.env.VITE_API_URL ?? "/";

async function apiRequest<T>(url: string, responseSchema: z.ZodType<T>): Promise<T> {

    const response = await fetch(`${baseUrl}${url}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) throw new HttpError(response.status);
    return responseSchema.parse(await response.json());
}

export function getSpin(bet: number, idempotencyKey: number): () => Promise<SpinResult> {
    return async () => {
        const params = {
            bet: String(bet),
            idempotencyKey: String(idempotencyKey),
        };

        const queryString = new URLSearchParams(params).toString();
        return await apiRequest<SpinResult>(`/game/spin?${queryString}`, SPIN_RESULT_SCHEMA);
    }
}