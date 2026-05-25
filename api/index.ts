import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../src/app.js";
import { initDb } from "../src/config/db.js";

let initialized = false;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!initialized) {
    try {
      await initDb();
      initialized = true;
    } catch (err: any) {
      // Log but do NOT crash the entire Lambda — individual handlers will fail with 500
      // rather than FUNCTION_INVOCATION_FAILED for all routes
      console.error("[api/index] initDb failed:", err?.message || err);
    }
  }
  // Express app is a valid Node.js request listener
  (app as any)(req, res);
}
