export class ISOMath {
  static sequential(values) { return [...values].sort((a, b) => a - b); }
  static output(values) { return [...values]; }
  static randomTest(values, seed = Date.now()) {
    const result = [...values];
    let state = Number(seed) >>> 0;
    const next = () => { state = (1664525 * state + 1013904223) >>> 0; return state / 0x100000000; };
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  static duplicates(values) {
    const seen = new Set(), duplicates = new Set();
    for (const value of values) { if (seen.has(value)) duplicates.add(value); seen.add(value); }
    return [...duplicates];
  }
  static mean(values) {
    if (!values.length) throw new RangeError("Mean requires at least one value");
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  static variance(values) {
    if (!values.length) throw new RangeError("Variance requires at least one value");
    const mean = this.mean(values);
    return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  }
  static standardDeviation(values) { return Math.sqrt(this.variance(values)); }
  static normalize(value) {
    if (!Number.isFinite(value)) throw new TypeError("Value must be finite");
    return Math.min(1, Math.max(0, value));
  }
  static checksum(values) { return values.reduce((sum, value) => sum + value, 0) & 0xff; }
}
