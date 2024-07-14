export default class Paintable {
  constructor(size, framesPeriod, paint) {
    this._size = size;
    this._framesPeriod = framesPeriod;
    this._paint = paint;
  }
  getSize() {
    return this._size;
  }

  getFramesPeriod() {
    return this._framesPeriod;
  }

  getPaint() {
    return this._paint;
  }
}
