// Blur visuals ported from Browse's content-filter.js: heavy blur + scale
// (hides edge bleed) + clip-path, with drag/select disabled so the raw
// pixels can't be pulled out of the page while gated.
const BLUR_PROPS = {
  'filter': 'blur(60px)',
  'transform': 'scale(1.6)',
  'transform-origin': '50% 50%',
  'clip-path': 'inset(0)',
};

// The :not([data-bs-checked]) veil hides every image from the very first
// paint (the stylesheet installs at document_start, before the page parses).
// It lifts only when we stamp the element: after a verdict, or after deciding
// it's below the blur-first size. The stamp is backed by an isolated-world
// WeakSet, and watchIntegrity strips forged stamps, so a hostile page can't
// pre-clear its own images for more than the pre-discovery microtask.
const BLUR_RULES = `
    filter: ${BLUR_PROPS['filter']} !important;
    transform: ${BLUR_PROPS['transform']} !important;
    transform-origin: ${BLUR_PROPS['transform-origin']} !important;
    clip-path: ${BLUR_PROPS['clip-path']} !important;
    transition: filter 0.15s ease, transform 0.15s ease !important;
    -webkit-user-drag: none !important;
    user-select: none !important;
    -webkit-user-select: none !important;
`;

const CSS = `
  img:not([data-bs-checked]), video:not([data-bs-checked]) { ${BLUR_RULES} }
  .bs-pending, .bs-blocked, .bs-unchecked { ${BLUR_RULES} }
  .bs-unchecked { cursor: pointer !important; }
`;

const CHECKED_ATTR = 'data-bs-checked';

// Isolated-world state the page can neither read nor forge.
const gated = new WeakMap(); // element -> 'bs-pending' | 'bs-blocked' | 'bs-unchecked'
const stamped = new WeakSet(); // elements whose data-bs-checked stamp is ours
const savedStyles = new WeakMap(); // element -> { prop: { value, priority } }
const savedTitles = new WeakMap(); // element -> string | null
const savedDraggable = new WeakMap(); // element -> string | null

export function installStyles(doc) {
  if (doc.querySelector?.('style[data-blurshield]')) return;
  // At document_start there is no <head> yet — append to the root element;
  // style elements apply from anywhere in the tree.
  const parent = doc.head || doc.documentElement;
  if (!parent) return;
  const style = doc.createElement('style');
  style.setAttribute('data-blurshield', '');
  style.textContent = CSS;
  parent.appendChild(style);
}

// Lifts the pre-classification veil without gating: the element is either
// classified (reveal/markBlocked/markUnchecked all stamp) or below the
// blur-first size. The WeakSet marks the stamp as legitimately ours.
export function stampChecked(el) {
  stamped.add(el);
  el.setAttribute(CHECKED_ATTR, '');
}

export function blur(el) {
  gate(el, 'bs-pending');
}

export function reveal(el) {
  gated.delete(el);
  el.classList.remove('bs-pending', 'bs-blocked', 'bs-unchecked');
  restoreInlineStyles(el);
  restoreDraggable(el);
  restoreTitle(el);
  // Keep (or set) the stamp: a revealed element must not fall back under the
  // pre-classification veil selector.
  stampChecked(el);
}

// ML verdict says NSFW: permanently blurred. No click-to-reveal — only
// images the model never checked (markUnchecked) get a reveal affordance.
export function markBlocked(el) {
  saveTitle(el);
  gate(el, 'bs-blocked');
  el.title = 'Blur Extension: blocked';
}

// The model never produced a verdict (fetch/bridge error, timeout): fail
// closed, but leave a confirm-gated click-to-reveal escape hatch. The click
// handling lives in installRevealGuard, keyed off the isolated-world gated
// state — no per-element listener a wrapper or overlay could preempt.
export function markUnchecked(el) {
  saveTitle(el);
  gate(el, 'bs-unchecked');
  el.title = 'Blur Extension: not verified — click to reveal';
}

export function isBlurred(el) {
  return el.classList.contains('bs-pending')
    || el.classList.contains('bs-blocked')
    || el.classList.contains('bs-unchecked');
}

export function watchIntegrity(doc) {
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'attributes') reassert(m.target);
      for (const node of m.removedNodes ?? []) {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches?.('style[data-blurshield]')) {
          installStyles(doc);
        }
      }
    }
  });
  observer.observe(doc.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'draggable', CHECKED_ATTR],
  });
  return observer;
}

// CSS blur is cosmetic — the element still holds the raw source. Block the
// paths that would expose the original bytes while gated: drag-to-Finder,
// right-click Save/Copy Image, and clipboard copy. Capture phase runs before
// any page handler; the WeakMap check means the page can't opt an element out.
export function installExfiltrationGuards(doc) {
  const block = event => {
    if (!gated.has(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };
  for (const type of ['dragstart', 'contextmenu', 'copy', 'cut']) {
    doc.addEventListener(type, block, true);
  }
}

function gate(el, cls) {
  saveInlineStyles(el);
  saveDraggable(el);
  gated.set(el, cls);
  el.classList.remove('bs-pending', 'bs-blocked', 'bs-unchecked');
  el.classList.add(cls);
  applyInlineBlur(el);
  el.setAttribute('draggable', 'false');
  // The class + inline blur own the element now; the veil has done its job.
  stampChecked(el);
}

function reassert(el) {
  if (el.hasAttribute?.(CHECKED_ATTR) && !stamped.has(el)) {
    // Forged stamp: the page set data-bs-checked itself to dodge the veil.
    el.removeAttribute(CHECKED_ATTR);
  } else if (stamped.has(el) && !el.hasAttribute(CHECKED_ATTR)) {
    // Page stripped our stamp; without it a revealed element re-veils.
    el.setAttribute(CHECKED_ATTR, '');
  }
  const cls = gated.get(el);
  if (!cls) return;
  if (!el.classList.contains(cls)) el.classList.add(cls);
  const style = el.style;
  for (const [prop, value] of Object.entries(BLUR_PROPS)) {
    if (style.getPropertyValue(prop) !== value
      || style.getPropertyPriority(prop) !== 'important') {
      applyInlineBlur(el);
      break;
    }
  }
  if (el.getAttribute('draggable') !== 'false') el.setAttribute('draggable', 'false');
}

function applyInlineBlur(el) {
  for (const [prop, value] of Object.entries(BLUR_PROPS)) {
    el.style.setProperty(prop, value, 'important');
  }
}

function saveInlineStyles(el) {
  if (gated.has(el) || savedStyles.has(el)) return;
  const saved = {};
  for (const prop of Object.keys(BLUR_PROPS)) {
    saved[prop] = {
      value: el.style.getPropertyValue(prop),
      priority: el.style.getPropertyPriority(prop),
    };
  }
  savedStyles.set(el, saved);
}

function restoreInlineStyles(el) {
  const saved = savedStyles.get(el);
  savedStyles.delete(el);
  for (const prop of Object.keys(BLUR_PROPS)) {
    const entry = saved?.[prop];
    if (entry?.value) el.style.setProperty(prop, entry.value, entry.priority);
    else el.style.removeProperty(prop);
  }
}

function saveDraggable(el) {
  if (gated.has(el) || savedDraggable.has(el)) return;
  savedDraggable.set(el, el.hasAttribute('draggable') ? el.getAttribute('draggable') : null);
}

function restoreDraggable(el) {
  if (!savedDraggable.has(el)) return;
  const saved = savedDraggable.get(el);
  savedDraggable.delete(el);
  if (saved !== null) el.setAttribute('draggable', saved);
  else el.removeAttribute('draggable');
}

function saveTitle(el) {
  if (savedTitles.has(el)) return;
  savedTitles.set(el, el.hasAttribute('title') ? el.getAttribute('title') : null);
}

function restoreTitle(el) {
  if (!savedTitles.has(el)) return;
  const saved = savedTitles.get(el);
  savedTitles.delete(el);
  if (saved !== null) el.setAttribute('title', saved);
  else el.removeAttribute('title');
}

// A per-element click listener can be beaten to the event by an ancestor's
// capture handler, or never fire at all when the site stretches a button or
// overlay across the image (the overlay becomes the target, so the gated
// element isn't even in the path). One document-level capture listener —
// installed at document_start, ahead of any page handler — sees the click
// first and finds the gated element itself.
const revealGuarded = new WeakSet(); // documents with the reveal guard installed

export function installRevealGuard(doc) {
  if (revealGuarded.has(doc)) return;
  revealGuarded.add(doc);
  doc.addEventListener('click', event => {
    if (!event.isTrusted) return;
    const el = uncheckedTarget(event, doc);
    if (!el) return;
    // Swallow the click before asking: a click on an unverified blur must
    // never reach the page, whatever the user decides.
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!confirm('Blur Extension: this image could not be verified. Reveal it?')) return;
    reveal(el);
  }, true);
}

function uncheckedTarget(event, doc) {
  for (const node of event.composedPath()) {
    if (gated.get(node) === 'bs-unchecked') return node;
  }
  // A benign overlay (e.g. a button stretched across an avatar) makes itself
  // the click target, keeping the gated element out of the event path — fall
  // back to hit-testing the click point.
  for (const node of doc.elementsFromPoint?.(event.clientX, event.clientY) ?? []) {
    if (gated.get(node) === 'bs-unchecked') return node;
  }
  return null;
}
