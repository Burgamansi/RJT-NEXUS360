import type { IncomingMessage, ServerResponse } from "node:http";

// Test: does @libsql/client load on Vercel?
export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const { createClient } = await import("@libsql/client");
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    await client.execute("SELECT 1");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", db: "connected" }));
  } catch(e: any) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: e.message, code: e.code }));
  }
}
