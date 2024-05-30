import xysCompareEqual from "./util/xysCompareEqual.js";

export default class SizingGuides {
  constructor({
    parentSize = [0, 0],
    useFullParentSizeWidth = false,
    useFullParentSizeHeight = false,
  }) {
    this._parentSize = parentSize;
    this._useFullParentSizeWidth = useFullParentSizeWidth;
    this._useFullParentSizeHeight = useFullParentSizeHeight;
  }

  getParentSize() {
    return this._parentSize;
  }

  getUseFullParentSizeWidth() {
    return this._useFullParentSizeWidth;
  }

  getUseFullParentSizeHeight() {
    return this._useFullParentSizeHeight;
  }

  equal(...sizingGuidesObjects) {
    for (const sizeGuides of sizingGuidesObjects) {
      const equal =
        xysCompareEqual(this.getParentSize(), sizeGuides.getParentSize()) &&
        this.getUseFullParentSizeWidth() ==
          sizeGuides.getUseFullParentSizeWidth() &&
        this.getUseFullParentSizeHeight() ==
          sizeGuides.getUseFullParentSizeHeight();
      if (!equal) {
        return false;
      }
    }
    return true;
  }
}

SizingGuides.compareEqual = (sizingGuides1, sizingGuides2) => {
  return sizingGuides1.equal(sizingGuides2);
};
