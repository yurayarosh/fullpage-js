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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints;
function checkPropertiesSupport() {
  if (!Element.prototype.closest) {
    console.warn('This browser does not support `closest` method. You should use polyfill.');
  }

  if (typeof Promise === "undefined" || Promise.toString().indexOf("[native code]") === -1) {
    console.warn('This browser does not support `Promise`. You should use polyfill.');
  }
}
function createTouchEvents(d) {
  if (!isTouch) return;

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
  function Animator(paginator) {
    _classCallCheck(this, Animator);

    this.paginator = paginator, this.sections = paginator.sections;
    this.from = paginator.current;
    this.to = paginator.next;
    this.current = this.sections[this.from];
    this.next = this.sections[this.to];
    this.container = paginator.container;
    this.translate = 0;
    this.transition = paginator.options.transition;
    this.easing = paginator.options.easing;
    this.onExit = paginator.onExit;
    this.onEnter = paginator.onEnter;
    this.onComplete = paginator.onComplete;
    this.fadeIn = paginator.options.fadeIn;
    this.fadeInDuration = paginator.options.fadeInDuration;
    this.customTransition = paginator.options.customTransition;
  }

  _createClass(Animator, [{
    key: "animate",
    value: function animate() {
      this._onExit().then(this._changeSection.bind(this)).then(this._onEnter.bind(this.paginator)).then(this._onComplete.bind(this.paginator)).then(this.finish.bind(this.paginator));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._removeStyles();
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

      var wrapTop = this.container.getBoundingClientRect().top;
      var nextTop = this.next.getBoundingClientRect().top - wrapTop;
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
      var _this5 = this;

      return new Promise(function (resolve) {
        _this5.finishTime = new Date().getTime();

        if (_this5.onComplete) {
          _this5.onComplete(_this5.next, resolve);
        } else {
          resolve();
        }
      });
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
    this.events = this.options.touchevents && isTouch ? ['wheel', 'click', 'swu', 'swd'] : ['wheel', 'click'];
    this.allowPagination = true;
    this.current = 0;
    this.next = null;
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
        var currentId = section.getAttribute(constants.anchorId) || null;
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
        if (!navBtn && !anchorBtn && !prevBtn && !nextBtn) return;

        if (navBtn) {
          this.paginateOnNavButtonClick(e, navBtn);
        }

        if (anchorBtn) {
          this.paginateOnAnchorClick(e, anchorBtn);
        }

        if (prevBtn || nextBtn) {
          this.paginateOnPrevNextClick(e, prevBtn, nextBtn);
        }
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
        } else if (this.next < 0) {
          this.next = this.sections.length - 1;
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

      this.animator = new Animator(this);

      this.animator.finish = function () {
        _this.current = _this.next;
        var duration = _this.finishTime - _this.startTime;

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

      this.events.forEach(function (event) {
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

      this.events.forEach(function (event) {
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

var MyFullpage =
/*#__PURE__*/
function (_Fullpage) {
  _inherits(MyFullpage, _Fullpage);

  function MyFullpage(page, options) {
    var _this;

    _classCallCheck(this, MyFullpage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MyFullpage).call(this, page, options));
    _this.prevButton = options.prevButton;
    _this.nextButton = options.nextButton;
    return _this;
  }

  _createClass(MyFullpage, [{
    key: "afterLoad",
    value: function afterLoad() {
      console.log('hello from AFTERLOAD function');
    }
  }, {
    key: "onExit",
    value: function onExit(section, resolve) {
      console.log('EXIT animation is hapening');
      setTimeout(function () {
        console.log('EXIT animaton has finished in this section', section);
        resolve();
      }, 500);
    }
  }, {
    key: "onEnter",
    value: function onEnter(section, resolve) {
      setTimeout(function () {
        console.log('ENTER animation has finished in this section', section);
        resolve();
      }, 500);
    }
  }, {
    key: "onComplete",
    value: function onComplete(section, resolve) {
      var sections = this.sections;
      var _this$animator = this.animator,
          from = _this$animator.from,
          to = _this$animator.to;
      setTimeout(function () {
        console.log('this is ONCOMPETE function is triggering.');
        console.log('previous section', sections[from]);
        console.log('current section', sections[to]);
        resolve();
      }, 1000);
    }
  }, {
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(MyFullpage.prototype), "init", this).call(this);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(MyFullpage.prototype), "destroy", this).call(this);
    }
  }]);

  return MyFullpage;
}(Fullpage);

var page = document.querySelector('.js-fullpage');
var nav = document.querySelector('.js-fullpage-nav');
var prev = document.querySelector('.js-prev');
var next = document.querySelector('.js-next');
var options = {
  transition: 1000,
  delay: 0,
  easing: 'cubic-bezier(.17,.67,.24,1.02)',
  touchevents: true,
  customTransition: false,
  fadeIn: false,
  fadeInDuration: 1000,
  navigation: nav,
  renderNavButton: function renderNavButton(i) {
    return i < 9 ? "0".concat(i + 1) : i + 1;
  },
  prevButton: prev,
  nextButton: next,
  loop: true,
  toggleClassesFirst: false
};
var fullpage = new MyFullpage(page, options);
fullpage.init();
console.log(fullpage);
