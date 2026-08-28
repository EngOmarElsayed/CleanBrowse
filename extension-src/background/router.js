export function createRouter({ cache, fetchThumbnail, classifyNative, getThreshold, timeoutMs = 5000 }) {
  const inFlight = new Map(); // url -> Promise<verdict>

  async function classify(url, thumbnailBase64) {
    const threshold = await getThreshold();
    const cached = cache.get(url);
    if (cached !== undefined) return verdictFor(cached, threshold);
    try {
      const thumbnail = thumbnailBase64 ?? await withTimeout(fetchThumbnail(url), timeoutMs);
      const scores = await withTimeout(classifyNative(thumbnail), timeoutMs);
      cache.set(url, scores);
      return verdictFor(scores, threshold);
    } catch (error) {
      return { verdict: 'error', message: String(error) };
    }
  }

  function handleClassify({ url, thumbnailBase64 }) {
    // First caller wins: a joiner's thumbnail is ignored, so it can inherit
    // an error verdict from a flight that took the failing fetch path.
    // Fail-closed (blur + click-to-reveal) makes that acceptable for v1.
    const existing = inFlight.get(url);
    if (existing) return existing;
    const pending = classify(url, thumbnailBase64).finally(() => inFlight.delete(url));
    inFlight.set(url, pending);
    return pending;
  }

  // Video frames: no cache and no single-flight — every frame is unique
  // content, so a stored score would pin the first frame's verdict onto the
  // whole video.
  async function handleClassifyFrame({ thumbnailBase64 }) {
    if (!thumbnailBase64) return { verdict: 'error', message: 'no frame' };
    try {
      const threshold = await getThreshold();
      const scores = await withTimeout(classifyNative(thumbnailBase64), timeoutMs);
      return verdictFor(scores, threshold);
    } catch (error) {
      return { verdict: 'error', message: String(error) };
    }
  }

  return { handleClassify, handleClassifyFrame };
}

// Explicit content (porn + hentai) blurs at a fixed 0.5 floor the slider
// cannot raise; suggestive content (sexy) blurs at the user's threshold.
const EXPLICIT_FLOOR = 0.5;

function verdictFor(scores, threshold) {
  const explicit = scores.porn + scores.hentai;
  const nsfw = explicit >= EXPLICIT_FLOOR || scores.sexy >= threshold;
  return { verdict: nsfw ? 'nsfw' : 'safe', score: Math.max(explicit, scores.sexy) };
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      value => { clearTimeout(timer); resolve(value); },
      error => { clearTimeout(timer); reject(error); },
    );
  });
}
