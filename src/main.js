// import './polyfill';
import {
  checkPropertiesSupport,
  createTouchEvents,
  getIdFromUrl,
  isTouch,
  BEMblock
} from './helpers';
import Animator from './components/Animator';
import constants from './constants';
import defaultParameters from './defaultParameters';

checkPropertiesSupport();

export function addTouchEvents() {
  createTouchEvents(document);
};

export class Fullpage {
  constructor(container, options) {
    this.container = container;
    this.sections = [].slice.call(this.container.children);
    this.options = { ...defaultParameters, ...options };
    this.events = this.options.touchevents && isTouch
      ? ['wheel', 'click', 'swu', 'swd']
      : ['wheel', 'click'];
    this.allowPagination = true;
    this.current = 0;
    this.next = null;
  };

  init() {
    this._addElementsAttributes();
    this._crateNavigation();

    this.paginateBinded = this.paginate.bind(this);

    this._paginate();

    if (getIdFromUrl() && getIdFromUrl().length > 1) {
      this._paginateOnLoad();
    };

    if (this.afterLoad) {
      this.afterLoad();
    };
  };

  destroy() {
    this._removeListeners();
    this._removeElementsAttributes();
    this._removeNavigation();
    if (this.animator) this.animator.destroy();
  }

  paginateToNext(condition) {
    this.direction = condition ? 1 : -1;
    this.next = this.current + this.direction;
  };

  paginateOnNavButtonClick(e, btn) {
    e.preventDefault();
    const index = +btn.getAttribute(constants.index);

    if (typeof index !== 'number') return;
    this.next = index;

    this.direction = this.next > this.current ? 1 : -1;
  };

  paginateOnAnchorClick(e, btn) {
    const id = btn.getAttribute(constants.anchor);
    let targetSection;

    this.sections.forEach(section => {
      const currentId = section.getAttribute(constants.anchorId) || null;
      if (currentId === id) targetSection = section;
    });

    this.next = +targetSection.getAttribute(constants.index);
    this.direction = this.next > this.current ? 1 : -1;
  };

  paginateOnPrevNextClick(e, prevBtn, nextBtn) {
    e.preventDefault();
    this.paginateToNext(nextBtn);
  };

  toggleDisableButtonsClasses() {
    const BEMnextBtn = BEMblock(this.options.nextButton, constants.next);
    const BEMprevBtn = BEMblock(this.options.prevButton, constants.prev);
    if (this.next === this.sections.length - 1) {
      BEMnextBtn.addMod(constants.IS_DISABLED);
    } else {
      BEMnextBtn.removeMod(constants.IS_DISABLED);
    };
    if (this.next === 0) {
      BEMprevBtn.addMod(constants.IS_DISABLED);
    } else {
      BEMprevBtn.removeMod(constants.IS_DISABLED);
    };
  };

  paginate(e) {
    if (!this.allowPagination) return;

    if (e.type === 'wheel') {
      this.paginateToNext(e.deltaY > 0);
    };

    if (e.type === 'click') {
      const navBtn = e.target.closest(`.${constants.navButton}`);
      const anchorBtn = e.target.closest(`[${constants.anchor}]`);
      const prevBtn = e.target.closest(`.${constants.prev}`);
      const nextBtn = e.target.closest(`.${constants.next}`);

      if (!navBtn
        && !anchorBtn
        && !prevBtn
        && !nextBtn) return;

      if (navBtn) {
        this.paginateOnNavButtonClick(e, navBtn);
      };
      if (anchorBtn) {
        this.paginateOnAnchorClick(e, anchorBtn);
      };
      if (prevBtn || nextBtn) {
        this.paginateOnPrevNextClick(e, prevBtn, nextBtn);
      };
    };

    if (this.options.touchevents) {
      if (e.type === 'swu') {
        this.paginateToNext(true);
      };

      if (e.type === 'swd') {
        this.paginateToNext(false);
      };
    };

    if (!e.type) {
      let id = e;

      this.sections.forEach((section, i) => {
        if (section.hasAttribute(constants.anchorId, id)) {
          this.next = i;
        };
      });
    };

    if (this.options.loop) {
      if (this.next > this.sections.length - 1) {
        this.next = 0;
      } else if (this.next < 0) {
        this.next = this.sections.length - 1;
      };

      if (this.next === this.current) return;
    } else {
      if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;
    };

    if (!this.options.loop) {
      this.toggleDisableButtonsClasses();
    };

    if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;

    this.allowPagination = false;

    this.navigation.forEach(btn => {
      BEMblock(btn, constants.navButton).removeMod(constants.IS_ACTIVE)
    });
    BEMblock(this.navigation[this.next], constants.navButton).addMod(constants.IS_ACTIVE);

    if (this.options.toggleClassesFirst) {
      BEMblock(this.sections[this.current], constants.section).removeMod(constants.IS_ACTIVE);
      BEMblock(this.sections[this.next], constants.section).addMod(constants.IS_ACTIVE);
    };

    this.startTime = new Date().getTime();

    // animation goes here
    this.animator = new Animator(this);
    this.animator.finish = () => {
      this.current = this.next;

      const duration = this.finishTime - this.startTime;
      if (duration < this.options.delay) {
        const timeout = window.setTimeout(() => {
          this.allowPagination = true;
          window.clearTimeout(timeout);
        }, this.options.delay);
      } else {
        this.allowPagination = true;
      };
    };
    this.animator.animate();
  };

  _addElementsAttributes() {
    // add sections fade class
    if (this.options.fadeIn) {
      this.sections.forEach(section => {
        BEMblock(section, constants.section).addMod(constants.IS_ABSOLUTE);
        section.style.opacity = 0;
      });
      this.sections[0].style.opacity = 1;
    };

    // add first section active class
    BEMblock(this.sections[0], constants.section).addMod(constants.IS_ACTIVE)

    // add section indexes
    this.sections.forEach((section, i) => {
      section.setAttribute(constants.index, i);
    });

    // add prev next buttons class names
    if (this.options.prevButton) {
      this.options.prevButton.classList.add(constants.prev);
    };
    if (this.options.nextButton) {
      this.options.nextButton.classList.add(constants.next);
    };

    // add prevButton disabled class
    if (!this.options.loop) {
      if (this.current === 0) {
        BEMblock(this.options.prevButton, constants.prev).addMod(constants.IS_DISABLED);
      };
    };
  };

  _paginate() {
    this.events.forEach(event => {
      document.addEventListener(event, this.paginateBinded);
    });
  };

  _paginateOnLoad() {
    this.paginate(getIdFromUrl());
  };

  _crateNavigation() {
    if (!this.options.navigation) return;

    const nav = this.options.navigation;
    nav.innerHTML = `<ul class="${constants.navList}"></ul>`;

    for (let i = 0; i < this.sections.length; i++) {
      const list = nav.querySelector('ul');
      const item = document.createElement('li');
      item.className = constants.navItem;
      if (this.options.renderNavButton) {
        if (i === 0) {
          item.innerHTML = `<button class="${constants.navButton} ${constants.navButton}--${constants.IS_ACTIVE}" ${constants.index}="${i}">${this.options.renderNavButton(i)}</button>`;
        } else {
          item.innerHTML = `<button class="${constants.navButton}" ${constants.index}="${i}">${this.options.renderNavButton(i)}</button>`;
        };
      } else {
        if (i === 0) {
          item.innerHTML = `<button class="${constants.navButton} ${constants.navButton}--${constants.IS_ACTIVE}" ${constants.index}="${i}">${i + 1}</button>`;
        } else {
          item.innerHTML = `<button class="${constants.navButton}" ${constants.index}="${i}">${i + 1}</button>`;
        };
      };

      list.appendChild(item);
    };
    this.navigation = [].slice.call(nav.querySelectorAll(`.${constants.navButton}`));
  };

  _removeListeners() {
    this.events.forEach(event => {
      document.removeEventListener(event, this.paginateBinded);
    });
  }

  _removeElementsAttributes() {
    this.sections.forEach(section => {
      BEMblock(section, constants.section).removeMod(constants.IS_ACTIVE);
      BEMblock(section, constants.section).removeMod(constants.IS_ABSOLUTE);
      section.style.opacity = '';
      section.removeAttribute(constants.index);
    })
  }

  _removeNavigation() {
    if (!this.options.navigation) return;
    this.options.navigation.innerHTML = '';
  }
};