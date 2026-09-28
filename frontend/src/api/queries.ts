async function apiRequest<T>(url: string): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_URL;

    const response = await fetch(`${baseUrl}${url}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as Promise<T>;
}

export async function getDiamonds(): Promise<number[]> {
    return apiRequest<number[]>("/diamonds");
}
