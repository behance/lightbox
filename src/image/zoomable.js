export const ZOOMABLE_CLASS = 'zoomable';
export const ZOOMABLE_X_CLASS = 'zoomable-x';
export const ZOOMABLE_Y_CLASS = 'zoomable-y';

export function getZoomableClasses(img, $container) {
  const cntDim = { w: $container.width(), h: $container.height() };
  const imgDim = { w: img.naturalWidth, h: img.naturalHeight };
  const classes = [];

  if (cntDim.w >= imgDim.w && cntDim.h >= imgDim.h) { return; }

  classes.push(ZOOMABLE_CLASS);
  if (cntDim.w < imgDim.w) { classes.push(ZOOMABLE_X_CLASS); }
  if (cntDim.h < imgDim.h) { classes.push(ZOOMABLE_Y_CLASS); }

  return classes.join(' ');
};
