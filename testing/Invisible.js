import Component from "../Component.js";
import Render from "../Render.js";
import Skeleton from "../Skeleton.js";

export default class Invisible extends Component {
  constructor(child) {
    super();
    this._child = child;
  }

  onRender(sizingGuides) {
    const childDependency = this.dependency(this._child, sizingGuides);

    return new Skeleton(
      childDependency.getSize(),
      [
        new Render(
          [0, 0],
          childDependency.getSize(),
          childDependency,
          (canvas) => {
            // canvas.set(position, color); //do not paint
          }
        ),
      ],
      [],
      [childDependency]
    );
  }
}
