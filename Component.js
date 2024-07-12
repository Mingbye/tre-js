import Canvas from "./Canvas.js";
import Dependency from "./Dependency.js";
import Skeleton from "./Skeleton.js";
import X from "./X.js";
import Renderable from "./Renderable.js";
import { createCanvasUpdateMap, useCanvasUpdateMap } from "./tre.js";
import topBottomBlendColors from "./util/topBottomBlendColors.js";

export default class Component {
  constructor() {
    this._xMap = new Map();
  }

  mount(mounter) {
    if (!this._xMap.has(mounter)) {
      this._xMap.set(mounter, new X([], () => {}));
      // need not to run mounts on the Renders
      if (this._xMap.size == 1) {
        this.onMounted();
      }
    }
  }

  unmount(mounter) {
    if (this._xMap.has(mounter)) {
      const x = this._xMap.get(mounter);

      this._xMap.delete(mounter);

      for (const component of x.getMountedComponents()) {
        component.unmount(this);
      }

      if (this._xMap.size == 0) {
        this.onUnmounted();
      }
    }
  }

  onMounted() {}

  onUnmounted() {}

  updateState() {
    for (const key of this._xMap.keys()) {
      const x = this._xMap.get(key);
      const renderableOnInvalidatedCallback = x.getOnInvalidatedCallback();
      renderableOnInvalidatedCallback(false);
    }
  }

  onRender(sizingGuides) {
    return new Skeleton([0, 0], [], [], []);
  }

  dependency(component, sizingGuides) {
    let renderable = component.createRenderable(sizingGuides);

    return new Dependency(
      () => {
        return component;
      },
      () => {
        return renderable.getSize();
      },
      () => {
        return renderable.getRunRender();
      },
      () => {
        return renderable.getSetActive();
      },
      () => {
        return renderable.getRunClean();
      },
      () => {
        const oldRenderable = renderable;

        renderable = component.createRenderable(sizingGuides);

        const [renderableSizeWidth, renderableSizeHeight] =
          renderable.getSize();
        const [oldRenderableSizeWidth, oldRenderableSizeHeight] =
          oldRenderable.getSize();

        const sizeUnchanged =
          renderableSizeWidth == oldRenderableSizeWidth &&
          renderableSizeHeight == oldRenderableSizeHeight;

        return sizeUnchanged;
      }
    );
  }

  createRenderable(sizingGuides) {
    const skeleton = this.onRender(sizingGuides);

    const skeletonSize = skeleton.getSize();

    const cleanables = new Map();

    const renders = skeleton.getRenders();
    const painters = skeleton.getPainters();

    const canvases = [];

    function putNewCanvases() {
      canvases.splice(0, canvases.length);
      for (const render of renders) {
        let canvas = null;
        if (render != null) {
          canvas = new Canvas(render.getSize());
        } else {
          canvas = new Canvas(skeletonSize);
        }
        canvases.push(canvas);
      }
    }

    putNewCanvases();

    function getCanvasesResultantColor(position) {
      const [positionX, positionY] = position;

      let filter = (color) => {
        return color;
      };

      for (let x = renders.length; x > 0; x--) {
        const i = x - 1;

        const render = renders[i];

        const canvas = canvases[i];

        if (render == null) {
          const canvasColor = canvas.get(position);

          if (canvasColor[0] == 255) {
            return filter(canvasColor);
          }

          const topFilter = filter;

          filter = (color) => {
            const newColor = topBottomBlendColors(canvasColor, color);
            return topFilter(newColor);
          };
        } else {
          const [renderOffsetX, renderOffsetY] = render.getOffset();
          const [renderSizeX, renderSizeY] = render.getSize();

          if (
            positionX >= renderOffsetX &&
            positionX < renderOffsetX + renderSizeX &&
            positionY >= renderOffsetY &&
            positionY < renderOffsetY + renderSizeY
          ) {
            const canvasColor = canvas.get([
              positionX - renderOffsetX,
              positionY - renderOffsetY,
            ]);

            if (canvasColor[0] == 255) {
              return filter(canvasColor);
            }

            const topFilter = filter;

            filter = (color) => {
              const newColor = topBottomBlendColors(canvasColor, color);
              return topFilter(newColor);
            };
          }
        }
      }

      return filter([0, 0, 0, 0]);
    }

    return new Renderable(
      skeletonSize,
      (paint) => {
        putNewCanvases();

        let painterMatchCursor = 0;
        for (let i = 0; i < renders.length; i++) {
          const render = renders[i];

          const canvas = canvases[i];

          if (render == null) {
            if (painterMatchCursor < painters.length) {
              const painter = painters[painterMatchCursor];

              function canvasWriteListener(position) {
                paint(position, getCanvasesResultantColor(position));
              }

              canvas.attachWriteListener(canvasWriteListener);

              painter(canvas);

              canvas.detachWriteListener(canvasWriteListener);
            }

            painterMatchCursor += 1;
            continue;
          }

          const [renderOffsetX, renderOffsetY] = render.getOffset();

          const dependency = render.getDependency();

          const paintableTranslater = render.getTranslaterProvider()(canvas);

          function canvasWriteListener(position) {
            const [x, y] = position;
            paint(
              [x + renderOffsetX, y + renderOffsetY],
              getCanvasesResultantColor([x + renderOffsetX, y + renderOffsetY])
            );
          }

          canvas.attachWriteListener(canvasWriteListener);

          const dependencyRenderableRunRender =
            dependency.getRenderableGetRunRender()();

          dependencyRenderableRunRender((position, color) => {
            paintableTranslater(position, color);
          });

          canvas.detachWriteListener(canvasWriteListener);
        }
      },
      (mounter, onInvalidatedCallback) => {
        if (!this._xMap.has(mounter)) {
          return;
        }

        const unmountableComponents = [
          ...this._xMap.get(mounter).getMountedComponents(),
        ];

        const newMountedComponents = [];

        for (const render of renders) {
          if (render == null) {
            continue;
          }
          const dependency = render.getDependency();
          const component = dependency.getGetComponent()();

          if (newMountedComponents.indexOf(component) >= 0) {
            continue;
          }

          newMountedComponents.push(component);

          let indexInUnmountableComponents =
            unmountableComponents.indexOf(component);

          if (indexInUnmountableComponents >= 0) {
            unmountableComponents.splice(indexInUnmountableComponents, 1);
          } else {
            component.mount(this);
          }
        }

        for (const component of unmountableComponents) {
          component.unmount(this);
        }

        this._xMap.set(
          mounter,
          new X(newMountedComponents, onInvalidatedCallback)
        );

        for (let i = 0; i < renders.length; i++) {
          const render = renders[i];

          if (render == null) {
            continue;
          }

          const dependency = render.getDependency();

          dependency.getRenderableGetSetActive()()(
            this,
            (requestingJustAClean) => {
              if (requestingJustAClean) {
                if (cleanables.has(render)) {
                  return;
                }
                cleanables.set(render, true);
                onInvalidatedCallback(true);
                return;
              }

              dependency.getUpdateRenderable()();

              if (skeleton.getSizingDependencies().indexOf(dependency) >= 0) {
                onInvalidatedCallback(false);
                return;
              }

              cleanables.set(render, false);
              onInvalidatedCallback(true);
            }
          );
        }
      },
      (paint) => {
        for (let i = 0; i < renders.length; i++) {
          const render = renders[i];

          if (render == null) {
            continue;
          }

          if (cleanables.has(render)) {
            const [renderOffsetX, renderOffsetY] = render.getOffset();

            const requestingJustAClean = cleanables.get(render);

            if (requestingJustAClean) {
              const canvas = canvases[i];

              const translater = render.getTranslaterProvider()(canvas);

              function canvasWriteListener(position) {
                const [x, y] = position;
                paint(
                  [x + renderOffsetX, y + renderOffsetY],
                  getCanvasesResultantColor([
                    x + renderOffsetX,
                    y + renderOffsetY,
                  ])
                );
              }

              canvas.attachWriteListener(canvasWriteListener);

              render.getDependency().getRenderableGetRunClean()()(
                (position, color) => {
                  translater(position, color);
                }
              );

              canvas.detachWriteListener(canvasWriteListener);
            } else {
              //first lets clear the old canvas
              const oldCanvas = canvases[i];
              const oldCanvasClearUpdateMap = createCanvasUpdateMap(
                oldCanvas,
                (paint) => {},
                true
              );

              useCanvasUpdateMap(oldCanvasClearUpdateMap, (position, color) => {
                oldCanvas.set(position, color);
                const [px, py] = position;
                paint(
                  [px + renderOffsetX, py + renderOffsetY],
                  getCanvasesResultantColor([
                    px + renderOffsetX,
                    py + renderOffsetY,
                  ])
                );
              });

              //now lets work with a new canvas
              const canvas = new Canvas(render.getSize());

              canvases.splice(i, 1, canvas);

              const translater = render.getTranslaterProvider()(canvas);

              function canvasWriteListener(position) {
                const [px, py] = position;
                paint(
                  [px + renderOffsetX, py + renderOffsetY],
                  getCanvasesResultantColor([
                    px + renderOffsetX,
                    py + renderOffsetY,
                  ])
                );
              }

              canvas.attachWriteListener(canvasWriteListener);

              render.getDependency().getRenderableGetRunRender()()(
                (position, color) => {
                  translater(position, color);
                }
              );

              canvas.detachWriteListener(canvasWriteListener);
            }

            cleanables.delete(render);
          }
        }
      }
    );
  }
}
