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

  clear() {
    const [width, height] = this._size;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        this.set([i, j], [0, 0, 0, 0]);
      }
    }
  }

  attachWriteListener(listener) {
    const indexInWriteListeners = this._writeListeners.indexOf(listener);
    if (indexInWriteListeners >= 0) {
      return;
    }
    this._writeListeners.push(listener);
  }

  detachWriteListener(listener) {
    const indexInWriteListeners = this._writeListeners.indexOf(listener);
    if (indexInWriteListeners >= 0) {
      this._writeListeners.splice(indexInWriteListeners, 1);
    }
  }
}
