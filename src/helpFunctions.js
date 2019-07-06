export function offset(el) {
  let rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
};

export function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};

export function unwrap(wrapper) {
  let docFrag = document.createDocumentFragment();
  while (wrapper.firstChild) {
    let child = wrapper.removeChild(wrapper.firstChild);
    docFrag.appendChild(child);
  }

  wrapper.parentNode.replaceChild(docFrag, wrapper);
};

export function detectTouch() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};
