export class ISODuplicateView {
  render({ cis, discMode, sortMode, view, result }) {
    return { cis: { code: cis.code, id: cis.id, status: cis.status }, discMode, sortMode, view: { ...view }, result };
  }
}
