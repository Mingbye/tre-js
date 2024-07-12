export default function topBottomBlendColors(topColor, bottomColor) {
  const [topA, topR, topG, topB] = topColor;
  const [bottomA, bottomR, bottomG, bottomB] = bottomColor;

  if (topA == 0) {
    return bottomColor;
  }

  if (bottomA == 0) {
    return topColor;
  }

  const topAFraction = topA / 255;
  const bottomAFraction = bottomA / 255;

  const resultAFactor = topAFraction + bottomAFraction * (1 - topAFraction);

  const resultR =
    (topAFraction * topR + bottomAFraction * bottomR * (1 - topAFraction)) /
    resultAFactor;
  const resultG =
    (topAFraction * topG + bottomAFraction * bottomG * (1 - topAFraction)) /
    resultAFactor;
  const resultB =
    (topAFraction * topB + bottomAFraction * bottomB * (1 - topAFraction)) /
    resultAFactor;

  const a = Math.floor(resultAFactor * 255);
  const r = Math.floor(resultR);
  const g = Math.floor(resultG);
  const b = Math.floor(resultB);

  console.log(topColor, bottomColor, a, r, g, b);

  return [a, r, g, b];
}
