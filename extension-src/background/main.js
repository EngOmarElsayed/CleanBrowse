import { VerdictCache } from './cache.js';
import { createRouter } from './router.js';

// Fixed sensitivity for the suggestive (sexy) class — not user-configurable
// (the settings popup was removed by design; explicit content has its own
// fixed 0.5 floor in the router).
const SEXY_THRESHOLD = 0.5;
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

async function fetchThumbnail(url, size = 224) {
  const response = await fetch(url, { credentials: 'omit' });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const blob = await response.blob();
  if (blob.size > MAX_IMAGE_BYTES) throw new Error(`image too large: ${blob.size} bytes`);
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(size, size);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, size, size);
  bitmap.close();
  const jpeg = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
  return blobToBase64(jpeg);
}

async function blobToBase64(blob) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  return dataUrl.split(',')[1];
}

const CLASS_LABELS = ['drawings', 'hentai', 'neutral', 'porn', 'sexy'];

async function classifyNative(jpegBase64) {
  const response = await browser.runtime.sendNativeMessage('application.id', { jpegBase64 });
  if (response?.error) throw new Error(response.error);
  const scores = response?.scores;
  if (!scores || CLASS_LABELS.some(label => typeof scores[label] !== 'number')) {
    throw new Error('bad native response');
  }
  return scores;
}

const getThreshold = async () => SEXY_THRESHOLD;

const router = createRouter({
  cache: new VerdictCache(),
  fetchThumbnail,
  classifyNative,
  getThreshold,
});

browser.runtime.onMessage.addListener(message => {
  if (message?.type === 'classify') return router.handleClassify(message);
  if (message?.type === 'classifyFrame') return router.handleClassifyFrame(message);
});
