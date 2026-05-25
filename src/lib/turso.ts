import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

/**
 * Turso Database Client
 * Optimized for edge environments and serverless runtimes.
 */
export const turso = createClient({
  url: url!,
  authToken: authToken,
});
