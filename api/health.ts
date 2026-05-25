import type { IncomingMessage, ServerResponse } from "node:http";

// Minimal health check with no external imports — isolates module loading issues
export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasDbUrl: !!process.env.TURSO_DATABASE_URL,
      hasDbToken: !!process.env.TURSO_AUTH_TOKEN,
    }
  }));
}
