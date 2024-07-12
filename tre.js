import Canvas from "./Canvas.js";
import PaintDiffMonitor from "./PaintDiffMonitor.js";
import SizingGuides from "./SizingGuides.js";

export function rootRender(component) {
  const mounter = {};

  let _paintable = null;

  component.mount(mounter);

  let renderable = null;

  function useNewRenderable() {
    if (_paintable == null) {
      return;
    }

    let cleanable = null;

    const [paintableSizeWidth, paintableSizeHeight] = _paintable.getSize();
    const paint = _paintable.getPaint();

    const sizingGuides = new SizingGuides({
      parentSize: [paintableSizeWidth, paintableSizeHeight],
      useFullParentSize: [true, true],
    });

    renderable = component.createRenderable(sizingGuides);

    const paintDiffMonitor = new PaintDiffMonitor();

    const size = renderable.getSize();

    renderable.getSetActive()(
      mounter,
      (requestingJustAClean) => {
        if (cleanable === true) {
          return;
        }

        if (requestingJustAClean) {
          cleanable = false;
        } else {
          cleanable = true;
        }

        requestAnimationFrame(() => {
          if (cleanable === null) {
            return;
          }

          if (cleanable === true) {
            paintDiffMonitor.clear(paint);
            useNewRenderable();
          } else {
            const updateMap = paintDiffMonitor.createUpdateMap((paint) => {
              renderable.getRunClean()((position, color) => {
                paint(position, color);
              });
            });

            paintDiffMonitor.applyUpdate(updateMap, paint);
          }

          cleanable = null;
        });
      },
      (callback) => {
        callback(paint);
      }
    );

    const updateMap = paintDiffMonitor.createUpdateMap((paint) => {
      renderable.getRunRender()(paint);
    });

    // console.log(updateMap);

    paintDiffMonitor.applyUpdate(updateMap, paint);
  }

  useNewRenderable();

  return {
    usePaintable: (paintable) => {
      _paintable = paintable;
      useNewRenderable();
    },
  };
}

export class Paintable {
  constructor(size, paint) {
    this._size = size;
    this._paint = paint;
  }
  getSize() {
    return this._size;
  }
  getPaint() {
    return this._paint;
  }
}

export function createCanvasUpdateMap(canvas, callback, clear) {
  const [canvasWidth, canvasHeight] = canvas.getSize();

  const updateMap = new Map();

  if (clear) {
    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        const [a, r, g, b] = canvas.get([i, j]);
        if (a != 0 || r != 0 || g != 0 || b != 0) {
          updateMap.set([i, j], [0, 0, 0, 0]);
          // console.log(i,j);
        }
      }
    }
  }

  callback((position, color) => {
    const [px, py] = position;

    if (!(px < canvasWidth && py < canvasHeight)) {
      return;
    }

    const [a, r, g, b] = color;

    let matchKey = null;
    for (const key of updateMap.keys()) {
      const [kx, ky] = key;
      if (kx == px && ky == py) {
        matchKey = key;
        break;
      }
    }

    const [a0, r0, g0, b0] = canvas.get(position);

    const updatesOriginalColor = !(a0 == a && r0 == r && g0 == g && b0 == b);

    if (matchKey != null) {
      if (updatesOriginalColor) {
        updateMap.set(matchKey, color);
      } else {
        updateMap.delete(matchKey);
      }
    } else {
      if (updatesOriginalColor) {
        updateMap.set(position, color);
      }
    }
  });

  return updateMap;
}

export function useCanvasUpdateMap(updateMap, paint) {
  for (const key of updateMap.keys()) {
    paint(key, updateMap.get(key));
  }
}
