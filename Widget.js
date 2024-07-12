import Component from "./Component.js";
import Render from "./Render.js";
import Skeleton from "./Skeleton.js";

export default class Widget extends Component {
  constructor() {
    super();
  }

  build() {
    return null;
  }

  onRender(sizingGuides) {
    const buildComponent = this.build();

    if (buildComponent == null) {
      return super.onRender(sizingGuides);
    }

    const componentDependency = this.dependency(buildComponent, sizingGuides);

    return new Skeleton(
      componentDependency.getSize(),
      [
        new Render([0, 0], measureSize, componentDependency, (canvas) => {
          return (position, color) => {
            canvas.set(position, color);
          };
        }),
      ],
      [],
      [componentDependency]
    );
  }
}
