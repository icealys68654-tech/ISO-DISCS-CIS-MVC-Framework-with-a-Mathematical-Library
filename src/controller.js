import { SortMode } from "./model.js";
import { ISOMath } from "./math.js";
export class SortController {
  constructor(mode = SortMode.SEQUENTIAL) { this.setMode(mode); }
  setMode(mode) {
    if (!Object.values(SortMode).includes(mode)) throw new TypeError("Invalid sort mode");
    this.mode = mode;
  }
  execute(values, seed) {
    if (!Array.isArray(values) || values.some(value => !Number.isFinite(value))) throw new TypeError("Sort input must be an array of finite numbers");
    switch (this.mode) {
      case SortMode.SEQUENTIAL: return ISOMath.sequential(values);
      case SortMode.OUTPUT: return ISOMath.output(values);
      case SortMode.RANDOM_TEST: return ISOMath.randomTest(values, seed);
      default: throw new Error("Unsupported sort mode");
    }
  }
}
