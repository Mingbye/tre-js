export default class X {
  constructor(mountedComponents, onInvalidatedCallback) {
    this._mountedComponents = mountedComponents;
    this._onInvalidatedCallback = onInvalidatedCallback;
  }
  getMountedComponents() {
    return this._mountedComponents;
  }
  getOnInvalidatedCallback() {
    return this._onInvalidatedCallback;
  }
}
