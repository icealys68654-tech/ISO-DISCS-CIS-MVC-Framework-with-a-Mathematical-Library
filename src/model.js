import { ISOMath } from "./math.js";
export const DiscMode = Object.freeze({ DUPLICATE: "DUPLICATE", INPUT: "INPUT", SYSTEM_CHECK: "SYSTEM_CHECK" });
export const SortMode = Object.freeze({ SEQUENTIAL: "SEQUENTIAL", OUTPUT: "OUTPUT", RANDOM_TEST: "RANDOM_TEST" });
export class ISODiscCIS {
  constructor({ code = 3, id = 2, status = 0.14 } = {}) {
    if (!Number.isInteger(code) || code < 0) throw new RangeError("CIS code must be a non-negative integer");
    if (!Number.isInteger(id) || id < 0) throw new RangeError("CIS ID must be a non-negative integer");
    if (!Number.isFinite(status) || status < 0 || status > 1) throw new RangeError("CIS status must be between 0 and 1");
    this.code = code; this.id = id; this.status = status; Object.freeze(this);
  }
}
export class DiscModel {
  constructor({ cis = new ISODiscCIS(), mode = DiscMode.DUPLICATE } = {}) {
    this.cis = cis instanceof ISODiscCIS ? cis : new ISODiscCIS(cis);
    this.view = { sequentialOutput: true, duplicateInput: true };
    this.setMode(mode);
  }
  setMode(mode) {
    if (!Object.values(DiscMode).includes(mode)) throw new TypeError("Invalid disc mode");
    this.mode = mode;
    if (mode !== DiscMode.DUPLICATE) this.view = { ...this.view, duplicateInput: false };
  }
  configureView({ sequentialOutput = true, duplicateInput = true } = {}) {
    if (this.mode !== DiscMode.DUPLICATE && duplicateInput) throw new Error("duplicateInput requires DUPLICATE mode");
    this.view = { sequentialOutput: Boolean(sequentialOutput), duplicateInput: Boolean(duplicateInput) };
    return this.view;
  }
  inspect(values = []) {
    const input = [...values];
    if (this.mode === DiscMode.INPUT) return { input, count: input.length };
    if (this.mode === DiscMode.SYSTEM_CHECK) return { status: "OK", cisValid: true, checksum: ISOMath.checksum([this.cis.code, this.cis.id]), count: input.length };
    const duplicates = this.view.duplicateInput ? ISOMath.duplicates(input) : [];
    return { input, duplicates, hasDuplicates: duplicates.length > 0 };
  }
}
