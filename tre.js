import Canvas from "./Canvas.js";
import State from "./State.js";
import SizingGuides from "./SizingGuides.js";

export function rootRender(component) {
  let _paintable = null;

  const componentState = new State(component);
  component(componentState);

  function runNewRender(cleanPaintable) {
    if (_paintable == null) {
      return;
    }

    const [paintableSizeWidth, paintableSizeHeight] = _paintable.getSize();
    const paint = _paintable.getPaint();

    if (cleanPaintable) {
      for (let i = 0; i < paintableSizeWidth; i++) {
        for (let j = 0; j < paintableSizeHeight; j++) {
          paint([i, j], [0, 0, 0, 0]);
        }
      }
    }

    const sizingGuides = new SizingGuides({
      parentSize: [paintableSizeWidth, paintableSizeHeight],
      useFullParentSizeWidth: true,
      useFullParentSizeHeight: true,
    });

    function canvasWriteListener(position, oldColor, newColor) {
      paint(position, newColor);
    }

    const render = componentState.useRender(sizingGuides, (callback) => {
      canvas.attachWriteListener(canvasWriteListener);

      callback();

      canvas.detachWriteListener(canvasWriteListener);
    });

    const canvas = new Canvas(render.getSize());

    canvas.attachWriteListener(canvasWriteListener);

    render.getDraw()(canvas);

    canvas.detachWriteListener(canvasWriteListener);
  }

  runNewRender(false);

  function stateUpdateListener() {
    runNewRender(true);
  }

  componentState.attachUpdateListener(stateUpdateListener);

  componentState.onMounted();

  return {
    usePaintable: (paintable) => {
      _paintable = paintable;
      runNewRender(false);
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
