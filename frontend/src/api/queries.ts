import type { SpinResult, UserData } from "../utils/types";
import { SPIN_RESULT_SCHEMA, USER_DATA_SCHEMA } from "../utils/constants";
import { HttpError, onStatus } from "../utils/Errors";

const baseUrl = import.meta.env.VITE_API_URL;

async function apiRequest(url: string, method: string, body?: unknown): Promise<Response> {
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
    await apiRequest("/auth/login", "POST", { userName, password, rememberMe });
}

export async function signup(userName: string, password: string): Promise<void> {
    await apiRequest("/auth/signup", "POST", { userName, password });
}

export async function logout(): Promise<void> {
    await apiRequest("/auth/logout", "POST");
}

export async function me(): Promise<UserData | null> {
    return await apiRequest("/auth/me", "GET")
        .then(rsp => rsp.json())
        .then(json => USER_DATA_SCHEMA.parse(json))
        .catch(onStatus([401], () => null));
}

export async function spin(bet: number, idempotencyKey: number): Promise<SpinResult | null> {
    return await apiRequest("/game/spin", "POST", { bet, idempotencyKey })
        .then(rsp => rsp.json())
        .then(json => SPIN_RESULT_SCHEMA.parse(json))
        .catch(onStatus([401], () => {
            alert("Log in before playing");
            return null;
        }))
        .catch(onStatus([409], () => {
            alert("Insufficient funds");
            return null;
        }));
}
