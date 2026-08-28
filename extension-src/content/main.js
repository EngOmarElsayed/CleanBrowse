import { findCandidates, candidateUrl, shouldBlurImmediately, observeNewCandidates } from './discovery.js';
import {
  installStyles, blur, reveal, markBlocked, markUnchecked, stampChecked,
  isBlurred, watchIntegrity, installExfiltrationGuards,
} from './blur.js';
import { tryCanvasThumbnail } from './acquire.js';
import { watchVideo, ownsFrames } from './video.js';

// Isolated-world dedup: element -> last classified URL. Lives in the content
// script world so the page can neither read nor forge it (no DOM state).
let classifiedUrls = new WeakMap();

export function resetSeen() {
  classifiedUrls = new WeakMap();
}

export async function processElement(el, sendMessage) {
  const url = candidateUrl(el);
  if (!url) return;
  if (classifiedUrls.get(el) === url) return;
  classifiedUrls.set(el, url);

  // Every candidate starts under the document_start stylesheet veil, so
  // nothing paints before this decision. Big elements get the inline
  // blur-first treatment; small ones are released from the veil while their
  // classification proceeds. At document_start the element may have no
  // layout yet (0×0) — defer the decision to its load/error event, where the
  // veil keeps it hidden in the meantime. A verdict landing first wins.
  let decided = false;
  const decide = () => {
    if (decided) return;
    if (classifiedUrls.get(el) !== url) return; // a newer flight owns the element
    decided = true;
    if (shouldBlurImmediately(el)) blur(el);
    else stampChecked(el);
  };
  if (el.tagName === 'IMG' && !el.complete && !hasLayout(el)) {
    el.addEventListener('load', decide, { once: true });
    el.addEventListener('error', decide, { once: true });
  } else {
    decide();
  }

  let response;
  try {
    const thumbnailBase64 = el.tagName === 'IMG' ? tryCanvasThumbnail(el) : null;
    response = await sendMessage({ type: 'classify', url, thumbnailBase64 });
  } catch {
    response = { verdict: 'error' };
  }

  decided = true; // the verdict owns the element's state from here on

  // A video whose live frames have been sampled is governed by them; a late
  // poster verdict must not override what the actual playback showed.
  if (el.tagName === 'VIDEO' && ownsFrames(el)) return;

  // Stale verdict: the element's URL changed while we were classifying.
  // The newer in-flight classification owns the element now. If the URL
  // vanished entirely, no newer flight exists — the model never verified
  // what's displayed, so keep the blur click-revealable.
  const nowUrl = candidateUrl(el);
  if (nowUrl !== url) {
    if (!nowUrl && isBlurred(el)) markUnchecked(el);
    return;
  }

  // Only markUnchecked grants click-to-reveal: an ML-confirmed nsfw verdict
  // is a permanent block, while an unverified image (fetch/bridge error,
  // timeout) fails closed with a confirm-gated reveal escape hatch. A small
  // unverified element is released, matching the blur-first size policy.
  if (response?.verdict === 'safe') reveal(el);
  else if (response?.verdict === 'nsfw') markBlocked(el);
  else if (isBlurred(el) || shouldBlurImmediately(el)) markUnchecked(el);
  else stampChecked(el);
}

function hasLayout(el) {
  const { width, height } = el.getBoundingClientRect();
  return width > 0 || height > 0;
}

export function start() {
  installStyles(document);
  watchIntegrity(document);
  installExfiltrationGuards(document);
  const send = message => browser.runtime.sendMessage(message);
  const handle = el => {
    processElement(el, send);
    if (el.tagName === 'VIDEO') watchVideo(el, send);
  };
  findCandidates(document).forEach(handle);
  observeNewCandidates(document.documentElement, handle);
  // Late srcset selection: a new currentSrc fires `load` without any
  // attribute mutation; the URL dedup makes unchanged sources a no-op.
  document.addEventListener('load', event => {
    if (event.target?.tagName === 'IMG') handle(event.target);
  }, true);
}

if (typeof browser !== 'undefined') start();
