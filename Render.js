export default class Render {
  constructor(size, draw, dependencies, eventsHandler = undefined) {
    this._size = size;
    this._draw = draw;
    this._dependencies = dependencies;
    this._eventsHandler = eventsHandler;
  }

  getSize() {
    return this._size;
  }

  getDraw() {
    return this._draw;
  }

  getDependencies() {
    return this._dependencies;
  }

  getEventsHandler() {
    if (this._eventsHandler == undefined) {
      return (position, event) => {
        return true;
      };
    }
    return this._eventsHandler;
  }
}
