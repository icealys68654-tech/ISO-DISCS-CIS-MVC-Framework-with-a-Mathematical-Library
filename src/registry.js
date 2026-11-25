import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ISODiscCIS } from "./model.js";
export class DiscRegistry {
  constructor(filePath = new URL("../data/discs.json", import.meta.url)) {
    this.filePath = filePath instanceof URL ? fileURLToPath(filePath) : path.resolve(filePath);
  }
  async list() {
    try {
      const records = JSON.parse(await fs.readFile(this.filePath, "utf8"));
      if (!Array.isArray(records)) throw new Error("Registry must contain a JSON array");
      return records.map(record => this.#validate(record));
    } catch (error) { if (error.code === "ENOENT") return []; throw error; }
  }
  async get(id) { return (await this.list()).find(record => record.id === String(id)) ?? null; }
  async upsert(record) {
    const valid = this.#validate(record), records = await this.list();
    const index = records.findIndex(item => item.id === valid.id);
    if (index < 0) records.push(valid); else records[index] = valid;
    await this.#write(records); return valid;
  }
  async remove(id) {
    const records = await this.list(), filtered = records.filter(record => record.id !== String(id));
    if (filtered.length === records.length) return false;
    await this.#write(filtered); return true;
  }
  #validate(record) {
    if (!record || typeof record !== "object" || !String(record.id ?? "").trim()) throw new TypeError("Each disc record requires a non-empty id");
    const cis = new ISODiscCIS(record.cis ?? {});
    return { id: String(record.id), label: String(record.label ?? record.id), cis: { code: cis.code, id: cis.id, status: cis.status }, updatedAt: record.updatedAt ?? new Date().toISOString() };
  }
  async #write(records) {
    const directory = path.dirname(this.filePath);
    await fs.mkdir(directory, { recursive: true });
    const temp = `${this.filePath}.${process.pid}.tmp`;
    await fs.writeFile(temp, `${JSON.stringify(records, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
    await fs.rename(temp, this.filePath);
  }
}
