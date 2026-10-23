import type { SpinResult } from "../utils/types";

async function apiRequest<T>(url: string): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_URL ?? "/api";

    const response = await fetch(`${baseUrl}${url}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as Promise<T>;
}

export function getSpin(bet: number, idempotencyKey: number): () => Promise<SpinResult> {
    return async () => {
        const params = {
            bet: String(bet),
            idempotencyKey: String(idempotencyKey),
        };

        const queryString = new URLSearchParams(params).toString();
        const result = await apiRequest<SpinResult>(`/spin?${queryString}`);

        return result;
    }
}