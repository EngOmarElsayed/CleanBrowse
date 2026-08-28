export const MIN_BLUR_SIZE = 100;
// All videos, not just [poster]: posterless videos need frame sampling too.
const SELECTOR = 'img, video';

export function findCandidates(root) {
  return [...root.querySelectorAll(SELECTOR)];
}

export function candidateUrl(el) {
  const raw = el.tagName === 'VIDEO'
    ? el.getAttribute('poster')
    : el.currentSrc || el.getAttribute('src');
  if (!raw) return null;
  // Absolutize: relative paths must never become global cache keys, or one
  // site's verdict could leak to another site's same-named image.
  try {
    return new URL(raw, el.baseURI).href;
  } catch {
    return null;
  }
}

export function shouldBlurImmediately(el) {
  const { width, height } = el.getBoundingClientRect();
  return width >= MIN_BLUR_SIZE && height >= MIN_BLUR_SIZE;
}

export function observeNewCandidates(root, onCandidate) {
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.target.matches?.(SELECTOR)) {
        onCandidate(m.target);
      }
      for (const node of m.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.matches?.(SELECTOR)) onCandidate(node);
        node.querySelectorAll?.(SELECTOR).forEach(onCandidate);
      }
    }
  });
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset', 'poster'],
  });
  return observer;
}
