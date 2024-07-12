import Component from "../Component.js";
import Render from "../Render.js";
import Skeleton from "../Skeleton.js";

export default class Blink extends Component {
  constructor(child) {
    super();
    this._child = child;

    this._rotaion = 0;
    this._intervalerReference = null;
  }

  _rotaionLoop(firstTime) {
    if (!firstTime) {
      this._rotaion = this._rotaion >= 1 ? 0 : this._rotaion + 0.05;
      this.updateState();
    }
    this._intervalerReference = setTimeout(() => {
      this._rotaionLoop(false);
    }, 25);
  }

  onMounted() {
    console.log("ROTATING MOUNTED");
    this._rotaionLoop(true);
  }

  onUnmounted() {
    console.log("ROTATING UNMOUNTED");
    clearInterval(this._intervalerReference);
  }

  onRender(sizingGuides) {
    const childDependency = this.dependency(this._child, sizingGuides);

    const size = childDependency.getSize();

    const [width, height] = size;

    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    const angleInRadians = this._rotaion * 2 * Math.PI;

    const angleSine = Math.sin(angleInRadians);
    const angleCosine = Math.cos(angleInRadians);

    function rotate([x, y]) {
      const xRotated =
        centerX + (x - centerX) * angleCosine - (y - centerY) * angleSine;
      const yRotated =
        centerY + (x - centerX) * angleSine + (y - centerY) * angleCosine;

      if (
        !(
          xRotated >= 0 &&
          xRotated <= width - 1 &&
          yRotated >= 0 &&
          yRotated <= height
        )
      ) {
        return null;
      }

      return [Math.floor(xRotated), Math.floor(yRotated)];
    }

    return new Skeleton(
      size,
      [
        new Render(
          [0, 0],
          childDependency.getSize(),
          childDependency,
          (canvas) => {
            return (position, color) => {
              const positionTranslated = rotate(position);
              if (positionTranslated != null) {
                canvas.set(positionTranslated, color);
              }
            };
          }
        ),
      ],
      [],
      [childDependency]
    );
  }
}
