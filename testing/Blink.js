import Widget from "../Widget.js";
import Invisible from "./Invisible.js";

export default class Blink extends Widget {
  constructor(child) {
    super();
    this._child = child;

    this._show = true;
    this._intervalerReference = null;
  }

  onMounted() {
    console.log("MOUNTED");
    this._intervalerReference = setInterval(() => {
      this._show = !this._show;
      this.updateState();
    }, 200);
  }

  onUnmounted() {
    console.log("UNMOUNTED");
    clearInterval(this._intervalerReference);
  }

  build() {
    return this._show ? this._child : new Invisible(this._child);
  }
}
