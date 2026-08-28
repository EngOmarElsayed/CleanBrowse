export const THUMBNAIL_SIZE = 224;

// Returns base64 JPEG (no data: prefix) or null if the image isn't ready
// or the canvas is tainted (cross-origin without CORS).
export function tryCanvasThumbnail(img, size = THUMBNAIL_SIZE) {
  if (!img.complete || !img.naturalWidth) return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);
    // An all-black sample means the frame hasn't painted (or is a decode
    // placeholder) — send nothing and let the fetch fallback get real pixels.
    if (isAllBlack(ctx, size)) return null;
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  } catch {
    return null;
  }
}

// Cross-origin video without CORS taints the canvas: readable never, on any
// frame. Distinguished from "no frame yet" (null) so the caller can stop
// sampling instead of retrying forever.
export const TAINTED = Symbol('tainted');

// Returns base64 JPEG of the current frame, null if no decodable frame yet,
// or TAINTED. No all-black skip here: unlike images, a black frame IS the
// content (there is no fetch fallback for a video frame), and a DRM video
// that draws black must classify neutral so it gets revealed, not stuck.
export function tryVideoFrameThumbnail(video, size = THUMBNAIL_SIZE) {
  if (video.readyState < 2 || !video.videoWidth) return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, size, size);
    try {
      return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    } catch {
      return TAINTED;
    }
  } catch {
    return null;
  }
}

function isAllBlack(ctx, size) {
  const spots = [
    [Math.floor(size / 4), Math.floor(size / 4)],
    [Math.floor(size / 2), Math.floor(size / 2)],
    [Math.floor((3 * size) / 4), Math.floor((3 * size) / 4)],
  ];
  for (const [x, y] of spots) {
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    if (r > 0 || g > 0 || b > 0) return false;
  }
  return true;
}
