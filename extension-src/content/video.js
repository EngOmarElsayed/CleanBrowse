import { blur, reveal, markBlocked, markUnchecked } from './blur.js';
import { tryVideoFrameThumbnail, TAINTED } from './acquire.js';

// Live-frame sampling, pattern ported from Browse's video-scanner.js:
// sample every 1.5s while playing, plus one-shot samples on loadeddata and
// seeked. Verdict policy is BlurShield's, not Browse's: blur-first until the
// first frame verdict, nsfw = permanent block, error = fail closed with
// click-to-reveal. Cross-origin video without CORS headers can never be read
// (tainted canvas) — it stays visible by design (v1 decision); DRM players
// that draw black frames classify neutral and reveal the same way.
export const SAMPLE_INTERVAL_MS = 1500;

const watched = new WeakSet();
// Videos whose visual state is controlled by frame sampling. Once live
// frames have spoken, a late poster verdict must not override them.
const frameOwned = new WeakSet();

export function ownsFrames(video) {
  return frameOwned.has(video);
}

export function watchVideo(video, sendMessage, opts = {}) {
  if (watched.has(video)) return;
  watched.add(video);
  const intervalMs = opts.intervalMs ?? SAMPLE_INTERVAL_MS;
  const capture = opts.capture ?? tryVideoFrameThumbnail;

  let status = 'pending'; // pending | safe | blocked | unchecked | unclassifiable
  let inFlight = false;
  let timer = null;

  // Blur-first: hide playback until the first frame verdict arrives. Only
  // while pending — a safe video resuming after pause must not re-blur.
  function gate() {
    if (status !== 'pending') return;
    frameOwned.add(video);
    blur(video);
  }

  async function sample() {
    if (status === 'blocked' || status === 'unclassifiable' || inFlight) return;
    const frame = capture(video);
    if (frame === TAINTED) {
      status = 'unclassifiable';
      stopSampling();
      // Stays visible by design; hand visual control back so a poster
      // verdict (the only signal we will ever have) can still apply.
      if (frameOwned.has(video)) reveal(video);
      frameOwned.delete(video);
      return;
    }
    if (!frame) return; // no decodable frame yet — next tick retries

    inFlight = true;
    let response;
    try {
      response = await sendMessage({ type: 'classifyFrame', thumbnailBase64: frame });
    } catch {
      response = { verdict: 'error' };
    }
    inFlight = false;
    if (status === 'blocked' || status === 'unclassifiable') return;

    if (response?.verdict === 'nsfw') {
      status = 'blocked';
      frameOwned.add(video);
      markBlocked(video);
      stopSampling();
    } else if (response?.verdict === 'safe') {
      status = 'safe';
      if (frameOwned.has(video)) reveal(video);
      // Keep sampling: content can turn nsfw mid-playback.
    } else {
      // Bridge/native failure: fail closed, click-to-reveal. Sampling stops
      // (retrying a dead bridge every 1.5s is spam) but restarts on the next
      // play, so a recovered bridge re-verifies automatically.
      status = 'unchecked';
      frameOwned.add(video);
      markUnchecked(video);
      stopSampling();
    }
  }

  function startSampling() {
    if (timer) return;
    sample();
    timer = setInterval(() => {
      if (video.paused || video.ended) {
        stopSampling();
        return;
      }
      sample();
    }, intervalMs);
  }

  function stopSampling() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  video.addEventListener('play', () => {
    if (status === 'unchecked') status = 'pending'; // re-verify on resume
    gate();
    startSampling();
  });
  video.addEventListener('playing', () => { gate(); startSampling(); });
  video.addEventListener('seeked', () => { sample(); });
  video.addEventListener('pause', stopSampling);
  video.addEventListener('ended', stopSampling);
  video.addEventListener('loadeddata', () => { gate(); sample(); });
  // New source = new content: any prior verdict (even blocked) is stale.
  video.addEventListener('emptied', () => {
    stopSampling();
    if (status !== 'pending') {
      status = 'pending';
      if (frameOwned.has(video)) blur(video);
    }
  });

  if (video.readyState >= 2) {
    gate();
    if (video.paused) sample();
    else startSampling();
  }
}
