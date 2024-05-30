import Render from "../Render.js";

export default function Blink(child) {
  return (state) => {
    let show = true;
    let intervalerReference = null;

    state.onMounted = () => {
      console.log("MOUNTED");
      intervalerReference = setInterval(() => {
        show = !show;
        state.update();
      }, 1000);
    };

    state.onUnmounted = () => {
      console.log("UNMOUNTED");
      clearInterval(intervalerReference);
    };

    state.render = (sizingGuides) => {
      const childDependency = state.dependency(child, sizingGuides);
      return new Render(
        childDependency.getRenderSize(),
        (canvas) => {
          function draw() {
            if (show) {
              childDependency.paint(
                (position, oldColor, color) => {
                  canvas.set(position, color);
                },
                () => {
                  canvas.clear();
                  draw();
                }
              );
            }
          }
          draw();
        },
        [childDependency],
        (position, e) => {
          return childDependency.handleEvent(position, e);
        }
      );
    };
  };
}
