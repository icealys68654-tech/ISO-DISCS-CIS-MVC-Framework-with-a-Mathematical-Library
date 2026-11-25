import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createISODiscSystem, DiscRegistry, SortMode, DiscMode } from "./src/index.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const registry = new DiscRegistry();
const port = Number(process.env.PORT || 4173);
const send = (res, status, body, type = "application/json") => {
  res.writeHead(status, {
    "content-type": type,
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "cache-control": type.startsWith("text/html") ? "no-cache" : "no-store"
  });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
};
async function body(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new RangeError("Request body exceeds 1 MB");
  }
  return raw ? JSON.parse(raw) : {};
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && url.pathname === "/health") {
      return send(res, 200, { status: "ok", service: "iso-discs-cis-mvc" });
    }
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/iso-discs")) {
      const html = await fs.readFile(path.join(root, "public/iso-discs.html"), "utf8");
      return send(res, 200, html, "text/html; charset=utf-8");
    }
    if (url.pathname === "/api/iso-discs" && req.method === "GET") return send(res, 200, await registry.list());
    if (url.pathname === "/api/iso-discs" && req.method === "POST") return send(res, 201, await registry.upsert(await body(req)));
    if (url.pathname === "/api/iso-discs/run" && req.method === "POST") {
      const input = await body(req);
      if (!Array.isArray(input.values) || input.values.some(v => !Number.isFinite(v))) return send(res, 400, { error: "values must be an array of finite numbers" });
      if (input.sortMode && !Object.values(SortMode).includes(input.sortMode)) return send(res, 400, { error: "Invalid sort mode" });
      if (input.discMode && !Object.values(DiscMode).includes(input.discMode)) return send(res, 400, { error: "Invalid disc mode" });
      return send(res, 200, createISODiscSystem({ cis: input.cis, sortMode: input.sortMode, discMode: input.discMode }).run(input.values, input.seed));
    }
    const match = url.pathname.match(/^\/api\/iso-discs\/([^/]+)$/);
    if (match && req.method === "DELETE") return send(res, 200, { removed: await registry.remove(decodeURIComponent(match[1])) });
    return send(res, 404, { error: "Not found" });
  } catch (error) {
    const status = error instanceof RangeError ? 413 : 400;
    return send(res, status, { error: error.message || "Bad request" });
  }
});

server.listen(port, "0.0.0.0", () => process.stdout.write(`ISO DISCS CIS listening on port ${port}\n`));
