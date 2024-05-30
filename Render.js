export default class Render {
  constructor(size, draw, dependencies) {
    this._size = size;
    this._draw = draw;
    this._dependencies = dependencies;
  }

  getSize() {
    return this._size;
  }

  getDraw() {
    return this._draw;
  }

  getDependencies() {
    return this._dependencies;
  }
}
