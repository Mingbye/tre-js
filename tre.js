import Canvas from "./Canvas.js";
import SizingGuides from "./SizingGuides.js";
import createCanvasUpdateMap from "./createCanvasUpdateMap.js";
import useCanvasUpdateMap from "./useCanvasUpdateMap.js";

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

    const canvas = new Canvas(renderable.getSize());

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
            const updateMap = createCanvasUpdateMap(canvas, () => {}, true);
            useCanvasUpdateMap(updateMap, paint);
            useNewRenderable();
          } else {
            const updateMap = createCanvasUpdateMap(
              canvas,
              (paint) => {
                renderable.getRunClean()(paint);
              },
              false
            );
            useCanvasUpdateMap(updateMap, paint);
          }

          cleanable = null;
        });
      },
      (callback) => {
        callback(paint);
      }
    );

    renderable.getRunRender()((position, color) => {
      canvas.set(position, color);
      paint(position, color);
    });
  }

  useNewRenderable();

  return new RootRendering(
    (paintable) => {
      _paintable = paintable;
      useNewRenderable();
    },
    () => {
      //implementable
    }
  );
}

export class RootRendering {
  constructor(usePaintableCallback, destroyCallback) {
    this._usePaintableCallback = usePaintableCallback;
    this._destroyCallback = destroyCallback;
  }

  usePaintable(paintable) {
    this._usePaintableCallback(paintable);
  }

  destroy() {
    this._destroyCallback();
  }
}
