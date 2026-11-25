export { ISOMath } from "./math.js";
export { ISODiscCIS, DiscModel, DiscMode, SortMode } from "./model.js";
export { SortController } from "./controller.js";
export { ISODuplicateView } from "./view.js";
export { DiscRegistry } from "./registry.js";
import { ISODiscCIS, DiscModel, DiscMode, SortMode } from "./model.js";
import { SortController } from "./controller.js";
import { ISODuplicateView } from "./view.js";
import { ISOMath } from "./math.js";
export function createISODiscSystem(config = {}) {
  const cis = new ISODiscCIS(config.cis);
  const controller = new SortController(config.sortMode ?? SortMode.SEQUENTIAL);
  const model = new DiscModel({ cis, mode: config.discMode ?? DiscMode.DUPLICATE });
  const view = new ISODuplicateView();
  return {
    cis, controller, model, view,
    run(values = [], seed) {
      const result = model.inspect(values);
      if (model.mode === DiscMode.DUPLICATE) result.output = controller.execute(values, seed);
      if (values.length) result.statistics = { mean: ISOMath.mean(values), variance: ISOMath.variance(values), standardDeviation: ISOMath.standardDeviation(values) };
      return view.render({ cis, discMode: model.mode, sortMode: controller.mode, view: model.view, result });
    }
  };
}
