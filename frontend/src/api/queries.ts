import { Queue } from "../utils/queue";
import type { SlotSymbol } from "../utils/types";

async function apiRequest<T>(url: string): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_URL ?? "/api";

    const response = await fetch(`${baseUrl}${url}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as Promise<T>;
}

export async function getReels(): Promise<Queue<SlotSymbol>[]> {
    const arrays = await apiRequest<number[][]>("/reels");
    const reels: Queue<SlotSymbol>[] = [];

    arrays.forEach(arr => {
        const reel = new Queue<SlotSymbol>;
        arr.forEach(n => reel.pushBack(n as SlotSymbol));
        reels.push(reel);
    })

    return reels;
}
