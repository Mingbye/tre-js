export default class Canvas {
  constructor(size) {
    this._size = size;

    const [width, height] = this._size;

    const buildArray = new Array(width * height);
    buildArray.fill([0, 0, 0, 0]);

    this._build = buildArray;

    this._writeListeners = [];
  }

  getSize() {
    return this._size;
  }

  set(position, color) {
    const [width, height] = this._size;

    const [x, y] = position;

    if (x < width && y < height) {
      const index = width * y + x;

      this._build[index] = color;

      for (const listener of this._writeListeners) {
        listener(position);
      }
    }
  }

  get(position) {
    const [width, height] = this._size;

    const [x, y] = position;

    if (x < width && y < height) {
      const index = width * y + x;
      return this._build[index];
    }

    return undefined;
  }

  _indexWriteListener(listener) {
    for (let i = 0; i < this._writeListeners.length; i++) {
      if (this._writeListeners[i] == listener) {
        return i;
      }
    }
    return null;
  }

  attachWriteListener(listener) {
    const indexInWriteListeners = this._indexWriteListener(listener);
    if (indexInWriteListeners === null) {
      this._writeListeners.push(listener);
    }
  }

  detachWriteListener(listener) {
    const indexInWriteListeners = this._indexWriteListener(listener);
    if (indexInWriteListeners !== null) {
      this._writeListeners.splice(indexInWriteListeners, 1);
    }
  }

}
