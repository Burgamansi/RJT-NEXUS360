// Tests importing src/app — if this fails, the issue is in the full app chain
import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../src/app.js";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", appLoaded: typeof app }));
}
