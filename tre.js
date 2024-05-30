import Canvas from "./Canvas.js";
import State from "./State.js";
import SizingGuides from "./SizingGuides.js";

export function render(component, paintableSize, paintCallback) {
  const componentState = new State(component);
  component(componentState);

  let canvas = null;

  function canvasWriteListener(position, oldColor, newColor) {
    paintCallback(position, newColor);
  }

  function renderDraw() {
    if (canvas != null) {
      canvas.clear();
      canvas.detachWriteListener(canvasWriteListener);
    }

    const sizingGuides = new SizingGuides({
      parentSize: paintableSize,
      useFullParentSizeWidth: true,
      useFullParentSizeHeight: true,
    });

    const render = componentState.useRender(sizingGuides);

    canvas = new Canvas(render.getSize());

    canvas.attachWriteListener(canvasWriteListener);

    render.getDraw()(canvas);
  }

  renderDraw();

  function stateUpdateListener() {
    renderDraw();
  }

  componentState.attachUpdateListener(stateUpdateListener);

  componentState.onMounted();

  // return ()=>{}
}
