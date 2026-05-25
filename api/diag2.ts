// Static import diagnostic — each import is statically analyzed by esbuild
import type { IncomingMessage, ServerResponse } from "node:http";
import express from "express";
import multer from "multer";

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    express: typeof express,
    multer: typeof multer,
  }));
}
