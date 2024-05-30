import Canvas from "./Canvas.js";
import Dependency from "./Dependency.js";
import xysCompareEqual from "./util/xysCompareEqual.js";

export default class State {
  constructor(component) {
    this._updateListeners = [];

    this._render = null;

    this._component = component;

    this.onMounted = () => {};

    this.onUnmounted = () => {};

    this.render = (sizingGuides) => {
      return new Render([0, 0], (canvas) => {}, []);
    };
  }

  getComponent() {
    return this._component;
  }

  update() {
    for (const listener of this._updateListeners) {
      listener();
    }
  }

  attachUpdateListener(listener) {
    const i = this._updateListeners.indexOf(listener);
    if (i >= 0) {
      return;
    }
    this._updateListeners.push(listener);
  }

  detachUpdateListener(listener) {
    const i = this._updateListeners.indexOf(listener);
    if (i >= 0) {
      this._updateListeners.splice(i, 1);
    }
  }

  useRender(sizingGuides, requestRunUpdate) {
    const render = this.render(sizingGuides);

    const newRenderDependencies = [...render.getDependencies()];

    if (this._render != null) {
      const oldRenderDependencies = [...this._render.getDependencies()];

      for (const dependency of oldRenderDependencies) {
        const indexInNewDependencies =
          newRenderDependencies.indexOf(dependency);
        if (indexInNewDependencies >= 0) {
          newRenderDependencies.splice(indexInNewDependencies, 1);
        } else {
          dependency.setRequestRunUpdate(null);
          dependency.getState().onUnmounted();
        }
      }
    }

    this._render = render;

    for (const dependency of newRenderDependencies) {
      dependency.setRequestRunUpdate(requestRunUpdate);
      dependency.getState().onMounted();
    }

    return render;
  }

  dependency(component, sizingGuides) {
    let componentState = null;

    if (this._render != null) {
      for (const dependency of this._render.getDependencies()) {
        const state = dependency.getState();
        if (state.getComponent() == component) {
          componentState = state;
          break;
        }
      }
    }

    if (componentState == null) {
      componentState = new State(component);
      component(componentState); //setup
    }

    let componentStateRender = componentState.useRender(
      sizingGuides,
      (callback) => {
        dependency.requestRunUpdate(callback);
      }
    );

    const dependency = new Dependency(
      componentState,
      () => {
        return componentStateRender.getSize();
      },
      (translater, onUpdate) => {
        const canvas = new Canvas(componentStateRender.getSize());

        canvas.attachWriteListener(translater);

        componentStateRender.getDraw()(canvas);

        canvas.detachWriteListener(translater);

        if (onUpdate != undefined) {
          function stateUpdateListener() {
            componentState.detachUpdateListener(stateUpdateListener);

            const newComponentStateRender = componentState.useRender(
              sizingGuides,
              (callback) => {
                dependency.requestRunUpdate(callback);
              }
            );
            if (
              !xysCompareEqual(
                componentStateRender.getSize(),
                newComponentStateRender.getSize()
              )
            ) {
              this.update();
              return;
            }

            componentStateRender = newComponentStateRender;

            dependency.requestRunUpdate(() => {
              canvas.attachWriteListener(translater);

              onUpdate();

              canvas.detachWriteListener(translater);
            });
          }

          componentState.attachUpdateListener(stateUpdateListener);
        }
      },
      (position, event) => {
        return componentStateRender.getEventsHandler()(position, event);
      }
    );

    return dependency;
  }
}
