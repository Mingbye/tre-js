export default class Skeleton {
  constructor(size, renders, painters, sizingDependencies) {
    this._size = size;
    this._renders = renders;
    this._painters = painters;
    this._sizingDependencies = sizingDependencies;
  }

  getSize() {
    return this._size;
  }

  getRenders() {
    return this._renders;
  }

  getPainters() {
    return this._painters;
  }

  getSizingDependencies() {
    return this._sizingDependencies;
  }
}
