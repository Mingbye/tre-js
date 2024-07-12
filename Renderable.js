export default class Renderable {
  constructor(size, runRender, setActive, runClean) {
    this._size = size;
    this._runRender = runRender;
    this._setActive = setActive;
    this._runClean = runClean;
  }

  getSize() {
    return this._size;
  }

  getRunRender() {
    return this._runRender;
  }

  getSetActive() {
    return this._setActive;
  }

  getRunClean() {
    return this._runClean;
  }
}
