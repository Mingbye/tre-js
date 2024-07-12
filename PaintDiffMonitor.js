export default class PaintDiffMonitor {
  constructor() {
    this._map = new Map();
  }

  createUpdateMap(callback) {
    const updateMap = new Map();

    callback((position, color) => {
      const [pX, pY] = position;
      const [a, r, g, b] = color;

      let keyInNewMap = null;
      for (const key of updateMap.keys()) {
        const [kX, kY] = key;
        if (kX == pX && kY == pY) {
          keyInNewMap = key;
          break;
        }
      }

      if (keyInNewMap != null) {
        if (this._map.has(keyInNewMap)) {
          const [a0, r0, g0, b0] = this._map.get(keyInNewMap);

          if ((a0 == a, r0 == r, g0 == g, b0 == b)) {
            updateMap.delete(keyInNewMap);
          } else {
            updateMap.set(keyInNewMap, color);
          }
        } else {
          if (a != 0 || r != 0 || g != 0 || b != 0) {
            updateMap.set(position, color);
          } else {
            updateMap.delete(keyInNewMap);
          }
        }
      } else {
        let keyInOldMap = null;

        for (const key of this._map.keys()) {
          const [kX, kY] = key;
          if (kX == pX && kY == pY) {
            keyInOldMap = key;
            break;
          }
        }

        if (keyInOldMap != null) {
          const [a0, r0, g0, b0] = this._map.get(keyInOldMap);
          if (a0 != a || r0 != r || g0 != g || b0 != b) {
            updateMap.set(keyInOldMap, color);
          }
        } else {
          if (a != 0 || r != 0 || g != 0 || b != 0) {
            updateMap.set(position, color);
          }
        }
      }
    });

    return updateMap;
  }

  applyUpdate(updateMap, paint) {
    for (const key of updateMap.keys()) {
      const color = updateMap.get(key);

      if (color[0] == 0 && color[1] == 0 && color[2] == 0 && color[3] == 0) {
        this._map.delete(key);
      } else {
        this._map.set(key, color);
      }

      paint(key, color);
    }
  }

  clear(paint) {
    for (const key of this._map.keys()) {
      this._map.delete(key);
      paint(key, [0, 0, 0, 0]);
    }
  }
}
