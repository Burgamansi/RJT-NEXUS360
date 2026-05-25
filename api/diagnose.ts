import type { IncomingMessage, ServerResponse } from "node:http";

// Diagnostic: tests each import in isolation to find the failing module
export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const results: Record<string, string> = {};

  const modules = [
    "@libsql/client",
    "exceljs",
    "officecrypto-tool",
    "multer",
    "bcryptjs",
    "uuid",
    "express",
    "papaparse",
    "pdfkit",
    "pptxgenjs",
  ];

  for (const mod of modules) {
    try {
      await import(mod);
      results[mod] = "ok";
    } catch(e: any) {
      results[mod] = `FAIL: ${e.code || e.message?.slice(0, 100)}`;
    }
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(results, null, 2));
}
