export default class Dependency {
  constructor(
    getComponent,
    renderableGetSize,
    renderableGetRunRender,
    renderableGetSetActive,
    renderableGetRunClean,
    updateRenderable
  ) {
    this._getComponent = getComponent;
    this._renderableGetSize = renderableGetSize;
    this._renderableGetRunRender = renderableGetRunRender;
    this._renderableGetSetActive = renderableGetSetActive;
    this._renderableGetRunClean = renderableGetRunClean;
    this._updateRenderable = updateRenderable;
  }

  getGetComponent = () => {
    return this._getComponent;
  };

  getRenderableGetSize = () => {
    return this._renderableGetSize;
  };

  getRenderableGetRunRender = () => {
    return this._renderableGetRunRender;
  };

  getRenderableGetSetActive = () => {
    return this._renderableGetSetActive;
  };

  getRenderableGetRunClean = () => {
    return this._renderableGetRunClean;
  };

  getUpdateRenderable = () => {
    return this._updateRenderable;
  };

  getSize = () => {
    //this is an important user's accessed method
    return this._renderableGetSize();
  };
}
