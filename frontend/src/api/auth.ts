import type { SpinResult, UserData } from "../utils/types";
import { SPIN_RESULT_SCHEMA, USER_DATA_SCHEMA } from "../utils/constants";
import { HttpError } from "../utils/Errors";

const baseUrl = import.meta.env.VITE_API_URL ?? "/";

async function authRequest(url: string, method: string, body?: unknown): Promise<Response> {
    const response = await fetch(`${baseUrl}${url}`, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) throw new HttpError(response.status);
    return response;
}

export async function login(userName: string, password: string, rememberMe: boolean): Promise<void> {
    await authRequest("/auth/login", "POST", { userName, password, rememberMe });
}

export async function signup(userName: string, password: string): Promise<void> {
    await authRequest("/auth/signup", "POST", { userName, password });
}

export async function logout(): Promise<void> {
    await authRequest("/auth/logout", "POST");
}

export async function getMe(): Promise<UserData> {
    const response = await authRequest("/auth/me", "GET");
    return USER_DATA_SCHEMA.parse(await response.json());
}

export async function getSpin(bet: number, idempotencyKey: number): Promise<SpinResult> {
    const response = await authRequest("/game/spin", "GET", { bet, idempotencyKey });
    return SPIN_RESULT_SCHEMA.parse(await response.json());
}
