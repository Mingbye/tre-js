import Render from "../Render.js";

export default function X(size) {
  return (state) => {
    state.render = (sizingGuides) => {
      return new Render(
        size,
        (canvas) => {
          const [width, height] = canvas.getSize();
          const divisions = Math.max(width, height);

          const widthMultiple = width / divisions;
          const heightMultiple = height / divisions;

          for (let i = 0; i < divisions; i++) {
            const x = (i * widthMultiple) | 0;
            const y = (i * heightMultiple) | 0;

            canvas.set([x, y], [255, 255, 0, 0]);
            canvas.set([width - 1 - x, y], [255, 255, 0, 0]);
          }
        },
        []
      );
    };
  };
}
