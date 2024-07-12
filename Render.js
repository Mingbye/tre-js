export default class Render {
  constructor(offset, size, dependency, translaterProvider) {
    this._offset = offset;
    this._size = size;
    this._dependency = dependency;
    this._translaterProvider = translaterProvider;
  }

  getOffset() {
    return this._offset;
  }

  getSize() {
    return this._size;
  }

  getDependency() {
    return this._dependency;
  }

  getTranslaterProvider() {
    return this._translaterProvider;
  }
}
