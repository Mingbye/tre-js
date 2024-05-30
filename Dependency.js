export default class Dependency {
  constructor(state, getRenderSize, paint, handleEvent) {
    this._state = state;
    this._getRenderSize = getRenderSize;
    this._paint = paint;
    this._handleEvent = handleEvent;

    this._requestRunUpdate = null;
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

  handleEvent(position, event) {
    return this._handleEvent(position, event);
  }

  setRequestRunUpdate(requestRunUpdate) {
    this._requestRunUpdate = requestRunUpdate;
  }

  requestRunUpdate(callback) {
    if (this._requestRunUpdate != null) {
      this._requestRunUpdate(callback);
    }
  }
}
