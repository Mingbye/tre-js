import Render from "../Render.js";
import SizingGuides from "../SizingGuides.js";

export default function Align(aligners, child) {
  const [horizontalAligner, verticalAligner] = aligners;

  return (state) => {
    state.render = (sizingGuides) => {
      const sizingGuidesParentSize = sizingGuides.getParentSize();

      const childSizingGuides = new SizingGuides({
        parentSize: sizingGuidesParentSize,
        useFullParentSizeWidth: false,
        useFullParentSizeHeight: false,
      });

      const childDependency = state.dependency(child, childSizingGuides);

      const [sizingGuidesParentSizeWidth, sizingGuidesParentSizeHeight] =
        sizingGuidesParentSize;
      const [childDependencyWidth, childDependencyHeight] =
        childDependency.getRenderSize();

      const width = sizingGuides.getUseFullParentSizeWidth()
        ? sizingGuidesParentSizeWidth
        : childDependencyWidth;
      const height = sizingGuides.getUseFullParentSizeHeight()
        ? sizingGuidesParentSizeHeight
        : childDependencyHeight;

      const offsetX = horizontalAligner(width, childDependencyWidth);
      const offsetY = verticalAligner(height, childDependencyHeight);

      return new Render(
        [width, height],
        (canvas) => {
          function draw() {
            childDependency.paint(
              ([x, y], oldColor, newColor) => {
                const x0 = x + offsetX;
                const y0 = y + offsetY;
                if (x0 >= 0 && y0 >= 0) {
                  canvas.set([x0, y0], newColor);
                }
              },
              () => {
                canvas.clear();
                draw();
              }
            );
          }
          draw();
        },
        [childDependency]
      );
    };
  };
}

Align.startAligner = (parentDimension, childDimension) => {
  return 0;
};

Align.centerAligner = (parentDimension, childDimension) => {
  return Math.floor((parentDimension - childDimension) / 2);
};

Align.endAligner = (parentDimension, childDimension) => {
  return parentDimension - childDimension;
};
