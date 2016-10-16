export function onImgLoad($img, cb) {
  const img = $img[0];
  return (img.complete) ? cb() : $img.load(cb);
};
