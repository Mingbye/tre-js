export default function xysCompareEqual(xy1, xy2) {
  const [xy1X, xy1Y] = xy1;
  const [xy2X, xy2Y] = xy2;
  return xy1X === xy2X && xy1Y === xy2Y;
}
