'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function checkPropertiesSupport() {
  if (!Element.prototype.closest) {
    console.warn('This browser does not support `closest` method. You should use polyfill.');
  }

  if (typeof Promise === "undefined" || Promise.toString().indexOf("[native code]") === -1) {
    console.warn('This browser does not support `Promise`. You should use polyfill.');
  }
}
function createTouchEvents(d) {
  var ce = function ce(e, n) {
    var a = document.createEvent('CustomEvent');
    a.initCustomEvent(n, true, true, e.target);
    e.target.dispatchEvent(a);
    a = null;
    return false;
  };

  var nm = true;
  var sp = {
    x: 0,
    y: 0
  };
  var ep = {
    x: 0,
    y: 0
  };
  var touch = {
    touchstart: function touchstart(e) {
      sp = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    },
    touchmove: function touchmove(e) {
      nm = false;
      ep = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    },
    touchend: function touchend(e) {
      if (nm) {
        ce(e, 'fc');
      } else {
        var x = ep.x - sp.x;
        var xr = Math.abs(x);
        var y = ep.y - sp.y;
        var yr = Math.abs(y);

        if (Math.max(xr, yr) > 20) {
          ce(e, xr > yr ? x < 0 ? 'swl' : 'swr' : y < 0 ? 'swu' : 'swd');
        }
      }

      nm = true;
    },
    touchcancel: function touchcancel(e) {
      nm = false;
    }
  };

  for (var i in touch) {
    d.addEventListener(i, touch[i], false);
  }
}
function getIdFromUrl() {
  var url = window.location.href;
  var id;

  if (url.indexOf('#') !== -1) {
    id = url.substring(url.lastIndexOf('#'));
  }

  if (id) {
    return id.slice(1);
  }
}

var constants = {
  IS_ACTIVE: 'is-active',
  IS_ABSOLUTE: 'is-absolute',
  IS_DISABLED: 'is-disabled',
  navList: 'fullpage-nav',
  navItem: 'fullpage-nav__item',
  navButton: 'fullpage-nav__button',
  prev: 'fullpage__prev',
  next: 'fullpage__next',
  anchor: 'data-fullpage-anchor',
  anchorId: 'data-fullpage-id',
  index: 'data-fullpage-index'
};

var Animator =
/*#__PURE__*/
function () {
  function Animator(_ref) {
    var direction = _ref.direction,
        sections = _ref.sections,
        from = _ref.from,
        to = _ref.to,
        transition = _ref.transition,
        easing = _ref.easing,
        onExit = _ref.onExit,
        onEnter = _ref.onEnter,
        fadeIn = _ref.fadeIn,
        fadeInDuration = _ref.fadeInDuration,
        customTransition = _ref.customTransition,
        toggleClassesFirst = _ref.toggleClassesFirst;

    _classCallCheck(this, Animator);

    this.direction = direction;
    this.sections = sections;
    this.from = from;
    this.to = to;
    this.current = sections[from];
    this.next = sections[to];
    this.container = this.sections[0].parentNode;
    this.translate = 0;
    this.transition = transition;
    this.easing = easing;
    this.onExit = onExit;
    this.onEnter = onEnter;
    this.fadeIn = fadeIn;
    this.fadeInDuration = fadeInDuration;
    this.customTransition = customTransition;
    this.toggleClassesFirst = toggleClassesFirst;
  }

  _createClass(Animator, [{
    key: "animate",
    value: function animate() {
      this._onExit().then(this._changeSection.bind(this)).then(this._onEnter.bind(this)).then(this._onComplete.bind(this));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._removeStyles();
    }
  }, {
    key: "getSectionTop",
    value: function getSectionTop(section) {
      var rect = section.getBoundingClientRect();
      return rect.top;
    }
  }, {
    key: "fadeToggle",
    value: function fadeToggle() {
      var _this = this;

      this.current.style.transition = "opacity ".concat(this.fadeInDuration, "ms");
      this.current.style.opacity = 0;
      setTimeout(function () {
        _this.current.style.display = 'none';
        _this.current.style.transition = '';

        _this.current.classList.remove(constants.IS_ACTIVE);
      }, this.fadeInDuration);
      this.next.classList.add(constants.IS_ACTIVE);
      this.next.style.display = '';
      this.next.style.transition = "opacity ".concat(this.fadeInDuration, "ms");
      setTimeout(function () {
        _this.next.style.opacity = 1;
      }, 66);
    }
  }, {
    key: "scrollToSection",
    value: function scrollToSection() {
      var _this2 = this;

      var wrapTop = this.getSectionTop(this.container);
      var nextTop = this.getSectionTop(this.next) - wrapTop; // const currentTop = this.getSectionTop(this.current) - wrapTop;

      this.translate = nextTop;
      this.container.style.transform = "translate(0px, -".concat(this.translate, "px)");
      this.container.style.transition = "transform ".concat(this.transition, "ms ").concat(this.easing);
      setTimeout(function () {
        _this2.container.style.transition = '';

        _this2.toggleActiveClasses();
      }, this.transition);
    }
  }, {
    key: "toggleActiveClasses",
    value: function toggleActiveClasses() {
      this.current.classList.remove(constants.IS_ACTIVE);
      this.next.classList.add(constants.IS_ACTIVE);
    }
  }, {
    key: "_onExit",
    value: function _onExit() {
      var _this3 = this;

      return new Promise(function (resolve) {
        if (_this3.onExit) {
          _this3.onExit(_this3.current, resolve);
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "_onEnter",
    value: function _onEnter() {
      var _this4 = this;

      return new Promise(function (resolve) {
        if (_this4.onEnter) {
          _this4.onEnter(_this4.next, resolve);
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "_onComplete",
    value: function _onComplete() {
      this.finishTime = new Date().getTime();

      if (this.onComplete) {
        this.onComplete.call(this);
      }
    }
  }, {
    key: "_changeSection",
    value: function _changeSection() {
      if (this.fadeIn) {
        this.fadeToggle();
      } else if (this.customTransition) {
        this.toggleActiveClasses();
      } else {
        this.scrollToSection();
      }
    }
  }, {
    key: "_removeStyles",
    value: function _removeStyles() {
      this.sections.forEach(function (section) {
        section.style.opacity = '';
        section.style.display = '';
        section.style.transition = '';
      });
    }
  }]);

  return Animator;
}();

var defaultParameters = {
  delay: 1000,
  transition: 500,
  easing: 'ease',
  navigation: false,
  renderNavButton: false,
  prevButton: false,
  nextButton: false,
  fadeIn: false,
  fadeInDuration: 500,
  touchevents: false,
  customTransition: false,
  loop: false,
  toggleClassesFirst: false
};

checkPropertiesSupport();
function addTouchEvents() {
  createTouchEvents(document);
}
var Fullpage =
/*#__PURE__*/
function () {
  function Fullpage(container, options) {
    _classCallCheck(this, Fullpage);

    this.container = container;
    this.sections = [].slice.call(this.container.children);
    this.options = _objectSpread2({}, defaultParameters, {}, options);
    this.allowPagination = true;
    this.current = 0;
  }

  _createClass(Fullpage, [{
    key: "init",
    value: function init() {
      this._addElementsAttributes();

      this._crateNavigation();

      this.paginateBinded = this.paginate.bind(this);

      this._paginate();

      if (getIdFromUrl() && getIdFromUrl().length > 1) {
        this._paginateOnLoad();
      }

      if (this.afterLoad) {
        this.afterLoad();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._removeListeners();

      this._removeElementsAttributes();

      this._removeNavigation();

      if (this.animator) this.animator.destroy();
    }
  }, {
    key: "paginateToNext",
    value: function paginateToNext(condition) {
      this.direction = condition ? 1 : -1;
      this.next = this.current + this.direction;
    }
  }, {
    key: "paginateOnNavButtonClick",
    value: function paginateOnNavButtonClick(e, btn) {
      e.preventDefault();
      var index = +btn.getAttribute(constants.index);
      if (typeof index !== 'number') return;
      this.next = index;
      this.direction = this.next > this.current ? 1 : -1;
    }
  }, {
    key: "paginateOnAnchorClick",
    value: function paginateOnAnchorClick(e, btn) {
      var id = btn.getAttribute(constants.anchor);
      var targetSection;
      this.sections.forEach(function (section) {
        var currentId = section.hasAttribute(constants.anchorId) ? section.getAttribute(constants.anchorId) : null;
        if (currentId === id) targetSection = section;
      });
      this.next = +targetSection.getAttribute(constants.index);
      this.direction = this.next > this.current ? 1 : -1;
    }
  }, {
    key: "paginateOnPrevNextClick",
    value: function paginateOnPrevNextClick(e, prevBtn, nextBtn) {
      e.preventDefault();
      this.paginateToNext(nextBtn);
    }
  }, {
    key: "toggleDisableButtonsClasses",
    value: function toggleDisableButtonsClasses() {
      if (this.next === this.sections.length - 1) {
        this.options.nextButton.classList.add(constants.IS_DISABLED);
      } else {
        this.options.nextButton.classList.remove(constants.IS_DISABLED);
      }

      if (this.next === 0) {
        this.options.prevButton.classList.add(constants.IS_DISABLED);
      } else {
        this.options.prevButton.classList.remove(constants.IS_DISABLED);
      }
    }
  }, {
    key: "paginate",
    value: function paginate(e) {
      var _this = this;

      if (!this.allowPagination) return;

      if (e.type === 'wheel') {
        this.paginateToNext(e.deltaY > 0);
      }

      if (e.type === 'click') {
        var navBtn = e.target.closest(".".concat(constants.navButton));
        var anchorBtn = e.target.closest("[".concat(constants.anchor, "]"));
        var prevBtn = e.target.closest(".".concat(constants.prev));
        var nextBtn = e.target.closest(".".concat(constants.next));

        if (navBtn) {
          this.paginateOnNavButtonClick(e, navBtn);
        }

        if (anchorBtn) {
          this.paginateOnAnchorClick(e, anchorBtn);
        }

        if (prevBtn || nextBtn) {
          this.paginateOnPrevNextClick(e, prevBtn, nextBtn);
        }
        if (navBtn === null && anchorBtn === null && prevBtn === null && nextBtn === null) return;
      }

      if (this.options.touchevents) {
        if (e.type === 'swu') {
          this.paginateToNext(true);
        }

        if (e.type === 'swd') {
          this.paginateToNext(false);
        }
      }

      if (!e.type) {
        var id = e;
        this.sections.forEach(function (section, i) {
          if (section.hasAttribute(constants.anchorId, id)) {
            _this.next = i;
          }
        });
      }

      if (this.options.loop) {
        if (this.next > this.sections.length - 1) {
          this.next = 0;
          this.loopTo = 'first';
        } else if (this.next < 0) {
          this.next = this.sections.length - 1;
          this.loopTo = 'last';
        } else {
          this.loopTo = false;
        }
        if (this.next === this.current) return;
      } else {
        if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;
      }

      if (!this.options.loop) {
        this.toggleDisableButtonsClasses();
      }
      if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;
      this.allowPagination = false;
      this.navigation.forEach(function (btn) {
        btn.classList.remove(constants.IS_ACTIVE);
      });
      this.navigation[this.next].classList.add(constants.IS_ACTIVE);

      if (this.options.toggleClassesFirst) {
        this.sections[this.current].classList.remove(constants.IS_ACTIVE);
        this.sections[this.next].classList.add(constants.IS_ACTIVE);
      }
      this.startTime = new Date().getTime(); // animation goes here

      this.animator = new Animator({
        direction: this.direction,
        sections: this.sections,
        from: this.current,
        to: this.next,
        transition: this.options.transition,
        easing: this.options.easing,
        onExit: this.onExit,
        onEnter: this.onEnter,
        fadeIn: this.options.fadeIn,
        fadeInDuration: this.options.fadeInDuration,
        customTransition: this.options.customTransition,
        toggleClassesFirst: this.options.toggleClassesFirst
      });

      this.animator.onComplete = function () {
        if (_this.onComplete) {
          _this.onComplete();
        }
        _this.current = _this.next;
        var duration = _this.animator.finishTime - _this.startTime;

        if (duration < _this.options.delay) {
          setTimeout(function () {
            _this.allowPagination = true;
          }, _this.options.delay);
        } else {
          _this.allowPagination = true;
        }
      };

      this.animator.animate();
    }
  }, {
    key: "_addElementsAttributes",
    value: function _addElementsAttributes() {
      // add sections fade class
      if (this.options.fadeIn) {
        this.sections.forEach(function (section) {
          section.classList.add(constants.IS_ABSOLUTE);
          section.style.opacity = 0;
        });
        this.sections[0].style.opacity = 1;
      }

      this.sections[0].classList.add(constants.IS_ACTIVE); // add section indexes

      this.sections.forEach(function (section, i) {
        section.setAttribute(constants.index, i);
      }); // add prev next buttons class names

      if (this.options.prevButton) {
        this.options.prevButton.classList.add(constants.prev);
      }

      if (this.options.nextButton) {
        this.options.nextButton.classList.add(constants.next);
      }

      if (!this.options.loop) {
        if (this.current === 0) {
          this.options.prevButton.classList.add(constants.IS_DISABLED);
        }
      }
    }
  }, {
    key: "_paginate",
    value: function _paginate() {
      var _this2 = this;

      var events = this.options.touchevents ? ['wheel', 'click', 'swu', 'swd'] : ['wheel', 'click'];
      events.forEach(function (event) {
        document.addEventListener(event, _this2.paginateBinded);
      });
    }
  }, {
    key: "_paginateOnLoad",
    value: function _paginateOnLoad() {
      this.paginate(getIdFromUrl());
    }
  }, {
    key: "_crateNavigation",
    value: function _crateNavigation() {
      if (!this.options.navigation) return;
      var nav = this.options.navigation;
      nav.innerHTML = "<ul class=\"".concat(constants.navList, "\"></ul>");

      for (var i = 0; i < this.sections.length; i++) {
        var list = nav.querySelector('ul');
        var item = document.createElement('li');
        item.className = constants.navItem;

        if (this.options.renderNavButton) {
          if (i === 0) {
            item.innerHTML = "<button class=\"".concat(constants.navButton, " ").concat(constants.IS_ACTIVE, "\" ").concat(constants.index, "=\"").concat(i, "\">").concat(this.options.renderNavButton(i), "</button>");
          } else {
            item.innerHTML = "<button class=\"".concat(constants.navButton, "\" ").concat(constants.index, "=\"").concat(i, "\">").concat(this.options.renderNavButton(i), "</button>");
          }
        } else {
          if (i === 0) {
            item.innerHTML = "<button class=\"".concat(constants.navButton, " ").concat(constants.IS_ACTIVE, "\" ").concat(constants.index, "=\"").concat(i, "\">").concat(i + 1, "</button>");
          } else {
            item.innerHTML = "<button class=\"".concat(constants.navButton, "\" ").concat(constants.index, "=\"").concat(i, "\">").concat(i + 1, "</button>");
          }
        }
        list.appendChild(item);
      }
      this.navigation = [].slice.call(nav.querySelectorAll(".".concat(constants.navButton)));
    }
  }, {
    key: "_removeListeners",
    value: function _removeListeners() {
      var _this3 = this;

      var events = this.options.touchevents ? ['wheel', 'click', 'swu', 'swd'] : ['wheel', 'click'];
      events.forEach(function (event) {
        document.removeEventListener(event, _this3.paginateBinded);
      });
    }
  }, {
    key: "_removeElementsAttributes",
    value: function _removeElementsAttributes() {
      this.sections.forEach(function (section) {
        section.classList.remove(constants.IS_ACTIVE);
        section.classList.remove(constants.IS_ABSOLUTE);
        section.style.opacity = '';
        section.removeAttribute(constants.index);
      });
    }
  }, {
    key: "_removeNavigation",
    value: function _removeNavigation() {
      if (!this.options.navigation) return;
      this.options.navigation.innerHTML = '';
    }
  }]);

  return Fullpage;
}();

addTouchEvents();
var page = document.querySelector('.js-fullpage');
var nav = document.querySelector('.js-fullpage-nav');
var prev = document.querySelector('.js-prev');
var next = document.querySelector('.js-next');
var fullpage = new Fullpage(page, {
  easing: 'ease-out',
  navigation: nav,
  fadeIn: true,
  fadeInDuration: 1000,
  renderNavButton: function renderNavButton(i) {
    return '0' + (i + 1);
  },
  prevButton: prev,
  nextButton: next,
  touchevents: true,
  customTransition: false,
  loop: false,
  toggleClassesFirst: true
});

fullpage.afterLoad = function () {
  console.log('hello from AFTERLOAD function');
};

fullpage.onExit = function (section, resolve) {
  console.log('EXIT animation is hapening');
  setTimeout(function () {
    console.log('EXIT animaton has finished in this section', section);
    resolve();
  }, 500);
};

fullpage.onEnter = function (section, resolve) {
  setTimeout(function () {
    console.log('ENTER animation has finished in this section', section);
    resolve();
  }, 500);
};

fullpage.onComplete = function () {
  console.log('this is ONCOMPETE function is triggering.');
};

fullpage.init();
