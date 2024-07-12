export default class SizingGuides {
  constructor({ parentSize = [0, 0], useFullParentSize = [false, false] }) {
    this._parentSize = parentSize;
    this._useFullParentSize = useFullParentSize;
  }

  getParentSize() {
    return this._parentSize;
  }

  getUseFullParentSize() {
    return this._useFullParentSize;
  }

  equal(...sizingGuidesObjects) {
    const [parentSizeWidth, parentSizeHeight] = this._parentSize;
    const [useFullParentSizeWidth, useFullParentSizeHeight] =
      this._useFullParentSize;

    for (const sizeGuides of sizingGuidesObjects) {
      const [psw, psh] = sizeGuides.getParentSize();
      const [ufpsw, ufpsh] = sizeGuides.getUseFullParentSize();

      const parentSizesEqual =
        psw == parentSizeWidth && psh == parentSizeHeight;
      const useFullParentSizesEqual =
        ufpsw == useFullParentSizeWidth && ufpsh == useFullParentSizeHeight;

      const equal = parentSizesEqual && useFullParentSizesEqual;

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
