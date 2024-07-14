export default function useCanvasUpdateMap(updateMap, paint) {
  for (const key of updateMap.keys()) {
    paint(key, updateMap.get(key));
  }
}
