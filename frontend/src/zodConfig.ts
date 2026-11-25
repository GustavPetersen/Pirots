import * as z from "zod";

// Our CSP forbids eval. Zod v4 probes for it with Function("") when a schema is
// created, so this must run before any module that defines schemas: import it first.
z.config({ jitless: true });
