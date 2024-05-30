export default class Dependency {
  constructor(state, getRenderSize, paint) {
    this._state = state;
    this._getRenderSize = getRenderSize;
    this._paint = paint;
  }

  getState() {
    return this._state;
  }

  getRenderSize() {
    return this._getRenderSize();
  }

  paint(translater, onUpdate) {
    this._paint(translater, onUpdate);
  }
}
