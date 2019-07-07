export function checkPropertiesSupport() {
  if (!Object.assign) {
    console.warn('This browser does not support `Object.assign`. You should use polyfill.');
  };
  if (!Element.prototype.closest) {
    console.warn('This browser does not support `closest` method. You should use polyfill.');
  };
  if(typeof Promise === "undefined" || Promise.toString().indexOf("[native code]") === -1){
    console.warn('This browser does not support `Promise`. You should use polyfill.');
  };
};

export function createTouchEvents(d) {
  var ce = function(e, n) { var a = document.createEvent('CustomEvent'); a.initCustomEvent(n, true, true, e.target); e.target.dispatchEvent(a); a = null; return false; };
  var nm = true; var sp = { x: 0, y: 0 }; var ep = { x: 0, y: 0 };
  var touch = {
    touchstart: function(e) { sp = { x: e.touches[0].pageX, y: e.touches[0].pageY }; },
    touchmove: function(e) { nm = false; ep = { x: e.touches[0].pageX, y: e.touches[0].pageY }; },
    touchend: function(e) { if (nm) { ce(e, 'fc'); } else { var x = ep.x - sp.x; var xr = Math.abs(x); var y = ep.y - sp.y; var yr = Math.abs(y); if (Math.max(xr, yr) > 20) { ce(e, (xr > yr ? (x < 0 ? 'swl' : 'swr') : (y < 0 ? 'swu' : 'swd'))); } }nm = true; },
    touchcancel: function(e) { nm = false; }
  };
  for (var i in touch) { d.addEventListener(i, touch[i], false); }
};