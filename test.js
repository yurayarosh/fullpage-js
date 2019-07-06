'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
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
};

var Animator = function () {
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
        fadeInDuration = _ref.fadeInDuration;
    classCallCheck(this, Animator);

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
  }

  createClass(Animator, [{
    key: 'animate',
    value: function animate() {
      this._onExit().then(this._changeSection.bind(this)).then(this._onEnter.bind(this));
    }
  }, {
    key: 'getSectionTop',
    value: function getSectionTop(section) {
      var rect = section.getBoundingClientRect();
      return rect.top;
    }
  }, {
    key: 'fadeToggle',
    value: function fadeToggle() {
      var _this = this;

      this.current.style.transition = 'opacity ' + this.fadeInDuration + 'ms';
      this.current.style.opacity = 0;

      setTimeout(function () {
        _this.current.style.display = 'none';
        _this.current.style.transition = '';
        _this.current.classList.remove(Animator.classNames.IS_ACTIVE);
      }, this.fadeInDuration);

      this.next.classList.add(Animator.classNames.IS_ACTIVE);
      this.next.style.display = '';
      this.next.style.transition = 'opacity ' + this.fadeInDuration + 'ms';
      setTimeout(function () {
        _this.next.style.opacity = 1;
      }, 66);
    }
  }, {
    key: '_onExit',
    value: function _onExit() {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (_this2.onExit) {
          _this2.onExit(_this2.current, resolve);
        }      });
    }
  }, {
    key: '_onEnter',
    value: function _onEnter() {
      if (this.onEnter) {
        this.onEnter(this.next);
      }    }
  }, {
    key: '_changeSection',
    value: function _changeSection() {
      var _this3 = this;

      if (this.fadeIn) {
        // this.setActiveClasses();
        this.fadeToggle();
      } else {
        var wrapTop = this.getSectionTop(this.container);
        var nextTop = this.getSectionTop(this.next) - wrapTop;
        var currentTop = this.getSectionTop(this.current) - wrapTop;

        this.translate = nextTop;

        this.container.style.transform = 'translate(0px, -' + this.translate + 'px)';
        this.container.style.transition = 'transform ' + this.transition + 'ms ' + this.easing;

        setTimeout(function () {
          _this3.container.style.transition = '';
          _this3.current.classList.remove(Animator.classNames.IS_ACTIVE);
          _this3.next.classList.add(Animator.classNames.IS_ACTIVE);
        }, this.transition);
      }    }
  }]);
  return Animator;
}();

Animator.classNames = {
  IS_ACTIVE: 'is-active'
};

(function (d) {
  var ce = function ce(e, n) {
    var a = document.createEvent('CustomEvent');a.initCustomEvent(n, true, true, e.target);e.target.dispatchEvent(a);a = null;return false;
  };
  var nm = true;var sp = { x: 0, y: 0 };var ep = { x: 0, y: 0 };
  var touch = {
    touchstart: function touchstart(e) {
      sp = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    },
    touchmove: function touchmove(e) {
      nm = false;ep = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    },
    touchend: function touchend(e) {
      if (nm) {
        ce(e, 'fc');
      } else {
        var x = ep.x - sp.x;var xr = Math.abs(x);var y = ep.y - sp.y;var yr = Math.abs(y);if (Math.max(xr, yr) > 20) {
          ce(e, xr > yr ? x < 0 ? 'swl' : 'swr' : y < 0 ? 'swu' : 'swd');
        }
      }nm = true;
    },
    touchcancel: function touchcancel(e) {
      nm = false;
    }
  };
  for (var i in touch) {
    d.addEventListener(i, touch[i], false);
  }
})(document);

// import * as help from './helpFunctions';

var Fullpage = function () {
  function Fullpage(container, options) {
    var _options;

    classCallCheck(this, Fullpage);

    this.container = container;
    this.defaultParams = {
      delay: 1400,
      transition: 500,
      easing: 'ease',
      navigation: false,
      renderNavButton: false,
      prevButton: false,
      nextButton: false,
      fadeIn: false,
      fadeInDuration: 500
    };
    options = Object.assign({}, this.defaultParams, options);
    this.options = (_options = {
      delay: options.delay,
      transition: options.transition,
      easing: options.easing,
      navigation: options.navigation,
      renderNavButton: options.renderNavButton,
      prevButton: options.prevButton
    }, defineProperty(_options, 'prevButton', options.prevButton), defineProperty(_options, 'nextButton', options.nextButton), defineProperty(_options, 'fadeIn', options.fadeIn), defineProperty(_options, 'fadeInDuration', options.fadeInDuration), _options);

    this.allowPagination = true;
    this.current = 0;
  }

  createClass(Fullpage, [{
    key: 'init',
    value: function init() {
      this._addElementsAttributes();
      this._crateNavigation();

      this.paginateBinded = this.paginate.bind(this);

      this._paginate();
    }
  }, {
    key: 'paginateToNext',
    value: function paginateToNext(condition) {
      this.direction = condition ? 1 : -1;
      this.next = this.current + this.direction;
    }
  }, {
    key: 'paginateOnNavButtonClick',
    value: function paginateOnNavButtonClick(e, btn) {
      e.preventDefault();
      var index = +btn.getAttribute(Fullpage.constants.index);

      if (typeof index !== 'number') return;
      this.next = index;

      this.direction = this.next > this.current ? 1 : -1;
    }
  }, {
    key: 'paginateOnAnchorClick',
    value: function paginateOnAnchorClick(e, btn) {
      var id = btn.getAttribute(Fullpage.constants.anchor);
      var targetSection = document.querySelector(id);

      this.next = +targetSection.getAttribute(Fullpage.constants.index);      this.direction = this.next > this.current ? 1 : -1;
    }
  }, {
    key: 'paginateOnPrevNextClick',
    value: function paginateOnPrevNextClick(e, prevBtn, nextBtn) {
      e.preventDefault();
      this.paginateToNext(nextBtn);
    }
  }, {
    key: 'paginate',
    value: function paginate(e) {
      var _this = this;

      if (!this.allowPagination) return;

      if (e.type === 'wheel') {
        this.paginateToNext(e.deltaY > 0);
      }
      if (e.type === 'click') {
        var navBtn = e.target.closest('.' + Fullpage.constants.navButton);
        var anchorBtn = e.target.closest('[' + Fullpage.constants.anchor + ']');
        var prevBtn = e.target.closest('.' + Fullpage.constants.prev);
        var nextBtn = e.target.closest('.' + Fullpage.constants.next);

        if (navBtn) {
          this.paginateOnNavButtonClick(e, navBtn);
        }        if (anchorBtn) {
          this.paginateOnAnchorClick(e, anchorBtn);
        }        if (prevBtn || nextBtn) {
          this.paginateOnPrevNextClick(e, prevBtn, nextBtn);
        }
        if (navBtn === null && anchorBtn === null && prevBtn === null && nextBtn === null) return;
      }
      if (e.type === 'swu') {
        this.paginateToNext(true);
      }
      if (e.type === 'swd') {
        this.paginateToNext(false);
      }
      if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;

      this.allowPagination = false;

      this.navigation.forEach(function (btn) {
        btn.classList.remove(Fullpage.constants.IS_ACTIVE);
      });
      this.navigation[this.next].classList.add(Fullpage.constants.IS_ACTIVE);

      // animation goes here
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
        fadeInDuration: this.options.fadeInDuration
      });
      this.animator.animate();

      this.current = this.next;

      setTimeout(function () {
        _this.allowPagination = true;
      }, this.options.delay);
    }
  }, {
    key: '_addElementsAttributes',
    value: function _addElementsAttributes() {
      // add sections fade class
      if (this.options.fadeIn) {
        this.sections.forEach(function (section) {
          section.classList.add(Fullpage.constants.IS_ABSOLUTE);
          section.style.opacity = 0;
        });
        this.sections[0].style.opacity = 1;
      }
      // add first section active class
      this.sections[0].classList.add(Fullpage.constants.IS_ACTIVE);

      // add section indexes
      this.sections.forEach(function (section, i) {
        section.setAttribute(Fullpage.constants.index, i);
      });

      // add prev next buttons class names
      if (this.options.prevButton) {
        this.options.prevButton.classList.add(Fullpage.constants.prev);
      }      if (this.options.nextButton) {
        this.options.nextButton.classList.add(Fullpage.constants.next);
      }    }
  }, {
    key: '_paginate',
    value: function _paginate() {
      var _this2 = this;

      var events = ['wheel', 'click', 'swu', 'swd'];

      events.forEach(function (event) {
        document.addEventListener(event, _this2.paginateBinded);
      });
    }
  }, {
    key: '_crateNavigation',
    value: function _crateNavigation() {
      if (!this.options.navigation) return;

      var nav = this.options.navigation;
      nav.innerHTML = '<ul class="' + Fullpage.constants.navList + '"></ul>';

      for (var i = 0; i < this.sections.length; i++) {
        var list = nav.querySelector('ul');
        var item = document.createElement('li');
        item.className = Fullpage.constants.navItem;
        if (this.options.renderNavButton) {

          if (i === 0) {
            item.innerHTML = '<button class="' + Fullpage.constants.navButton + ' ' + Fullpage.constants.IS_ACTIVE + '" ' + Fullpage.constants.index + '="' + i + '">' + this.options.renderNavButton(i) + '</button>';
          } else {
            item.innerHTML = '<button class="' + Fullpage.constants.navButton + '" ' + Fullpage.constants.index + '="' + i + '">' + this.options.renderNavButton(i) + '</button>';
          }        } else {
          if (i === 0) {
            item.innerHTML = '<button class="' + Fullpage.constants.navButton + ' ' + Fullpage.constants.IS_ACTIVE + '" ' + Fullpage.constants.index + '="' + i + '">' + (i + 1) + '</button>';
          } else {
            item.innerHTML = '<button class="' + Fullpage.constants.navButton + '" ' + Fullpage.constants.index + '="' + i + '">' + (i + 1) + '</button>';
          }        }
        list.appendChild(item);
      }      this.navigation = [].slice.call(nav.querySelectorAll('.' + Fullpage.constants.navButton));
    }
  }, {
    key: 'wrap',
    get: function get() {
      return this.container.parentNode;
    }
  }, {
    key: 'sections',
    get: function get() {
      return [].slice.call(this.container.children);
    }
  }]);
  return Fullpage;
}();

Fullpage.constants = {
  IS_ACTIVE: 'is-active',
  IS_ABSOLUTE: 'is-absolute',
  navList: 'fullpage-nav',
  navItem: 'fullpage-nav__item',
  navButton: 'fullpage-nav__button',
  prev: 'fullpage__prev',
  next: 'fullpage__next',
  anchor: 'data-anchor',
  index: 'data-fullpage-index'
};

// commands

var page = document.querySelector('.js-fullpage');
var nav = document.querySelector('.js-fullpage-nav');
var prev = document.querySelector('.js-prev');
var next = document.querySelector('.js-next');

var fullpage = new Fullpage(page, {
  easing: 'ease-out',
  navigation: nav,
  fadeIn: false,
  fadeInDuration: 1000,
  renderNavButton: function renderNavButton(i) {
    return '0' + (i + 1);
  },
  prevButton: prev,
  nextButton: next
});
fullpage.onExit = function (section, resolve) {
  console.log('this is some EXIT animation hapening');
  setTimeout(function () {
    console.log('EXIT animaton finished with this section', section);
    resolve();
  }, 0);
};
fullpage.onEnter = function (section) {
  console.log('hello from ENTER animation. this is current section', section);
};
fullpage.init();
