export class HttpError extends Error {
    public status: number;

    constructor(status: number, message?: string) {
        super(message ?? `HTTP error! Status: ${status}`);
        this.status = status;
        this.name = "HttpError";
    }
}

export function onStatus<T>(status: number[], handler: (err: HttpError) => T): (err: unknown) => T {
    return (err) => {
        if (err instanceof HttpError && status.includes(err.status)) {
            return handler(err);
        }
        throw err; // anything else keeps propagating
    };
}