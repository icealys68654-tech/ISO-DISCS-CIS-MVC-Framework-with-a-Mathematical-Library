import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { ISOMath, ISODiscCIS, DiscModel, DiscMode, SortMode, SortController, DiscRegistry, createISODiscSystem } from "../src/index.js";
test("CIS defaults and status validation", () => {
  const cis = new ISODiscCIS();
  assert.deepEqual({ code: cis.code, id: cis.id, status: cis.status }, { code: 3, id: 2, status: 0.14 });
  assert.throws(() => new ISODiscCIS({ status: 1.1 }), RangeError);
  assert.throws(() => new ISODiscCIS({ status: NaN }), RangeError);
});
test("math sorting, duplicates, and statistics", () => {
  assert.deepEqual(ISOMath.sequential([8, 3, 5, 3]), [3, 3, 5, 8]);
  assert.deepEqual(ISOMath.duplicates([8, 3, 5, 3, 8]), [3, 8]);
  assert.equal(ISOMath.mean([1, 2, 3]), 2);
  assert.equal(ISOMath.variance([1, 2, 3]), 2 / 3);
  assert.equal(ISOMath.checksum([3, 2]), 5);
  assert.throws(() => ISOMath.mean([]), RangeError);
});
test("random test mode is deterministic for a fixed seed and preserves entries", () => {
  const controller = new SortController(SortMode.RANDOM_TEST);
  const first = controller.execute([1, 2, 3, 4, 5], 42);
  assert.deepEqual(first, controller.execute([1, 2, 3, 4, 5], 42));
  assert.deepEqual([...first].sort(), [1, 2, 3, 4, 5]);
});
test("disc model enforces duplicate view mode", () => {
  const model = new DiscModel();
  assert.deepEqual(model.inspect([1, 1]).duplicates, [1]);
  model.setMode(DiscMode.INPUT);
  assert.throws(() => model.configureView({ duplicateInput: true }), /requires DUPLICATE/);
  assert.deepEqual(model.inspect([1, 1]), { input: [1, 1], count: 2 });
});
test("application composes MVC and math results", () => {
  const app = createISODiscSystem(), result = app.run([8, 3, 5, 3], 7);
  assert.deepEqual(result.result.output, [3, 3, 5, 8]);
  assert.deepEqual(result.result.duplicates, [3]);
  assert.equal(result.cis.status, 0.14);
  assert.equal(result.result.statistics.mean, 4.75);
});
test("registry persists, updates, and removes records", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "iso-disc-test-")), file = path.join(directory, "discs.json");
  try {
    const registry = new DiscRegistry(file);
    await registry.upsert({ id: "disc-1", label: "Primary", cis: { code: 3, id: 2, status: 0.14 } });
    assert.equal((await registry.get("disc-1")).label, "Primary");
    await registry.upsert({ id: "disc-1", label: "Updated", cis: { code: 3, id: 2, status: 0.2 } });
    assert.equal((await registry.list()).length, 1);
    assert.equal((await registry.get("disc-1")).label, "Updated");
    assert.equal(await registry.remove("disc-1"), true);
    assert.deepEqual(await registry.list(), []);
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
});
