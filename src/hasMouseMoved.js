export const lastMousePosition = {};

export default function hasMouseMoved(e) {
  const { x, y } = lastMousePosition;

  if (e.clientX !== x || e.clientY !== y) {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;
    return true;
  }

  return false;
};
