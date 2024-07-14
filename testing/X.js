import Component from "../Component.js";
import Skeleton from "../Skeleton.js";

export default class X extends Component {
  constructor(size) {
    super();
    this._size = size;
  }

  onRender(sizingGuides) {
    return new Skeleton(
      this._size,
      [null],
      [
        (canvas) => {
          const [width, height] = canvas.getSize();
          const divisions = Math.max(width, height);

          const widthMultiple = width / divisions;
          const heightMultiple = height / divisions;

          for (let i = 0; i < divisions; i++) {
            const x = (i * widthMultiple) | 0;
            const y = (i * heightMultiple) | 0;

            canvas.set([x, y], [255, 0, 255, 0]);
            canvas.set([width - 1 - x, y], [255, 255, 0, 0]);
          }
        },
      ],
      []
    );
  }
}
