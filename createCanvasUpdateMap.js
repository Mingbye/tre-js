export default function createCanvasUpdateMap(canvas, callback, clear) {
  const [canvasWidth, canvasHeight] = canvas.getSize();

  const updateMap = new Map();

  if (clear) {
    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        const [a, r, g, b] = canvas.get([i, j]);
        if (a != 0 || r != 0 || g != 0 || b != 0) {
          updateMap.set([i, j], [0, 0, 0, 0]);
          // console.log(i,j);
        }
      }
    }
  }

  callback((position, color) => {
    const [px, py] = position;

    if (!(px < canvasWidth && py < canvasHeight)) {
      return;
    }

    const [a, r, g, b] = color;

    let matchKey = null;
    for (const key of updateMap.keys()) {
      const [kx, ky] = key;
      if (kx == px && ky == py) {
        matchKey = key;
        break;
      }
    }

    const [a0, r0, g0, b0] = canvas.get(position);

    const updatesOriginalColor = !(a0 == a && r0 == r && g0 == g && b0 == b);

    if (matchKey != null) {
      if (updatesOriginalColor) {
        updateMap.set(matchKey, color);
      } else {
        updateMap.delete(matchKey);
      }
    } else {
      if (updatesOriginalColor) {
        updateMap.set(position, color);
      }
    }
  });

  return updateMap;
}
