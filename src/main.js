// import './polyfill';
import { checkPropertiesSupport, createTouchEvents } from './helpers';
import Animator from './Animator';

checkPropertiesSupport();

export function addTouchEvents() {
  createTouchEvents(document);
};

export class Fullpage {
  constructor(container, options) {
    this.container = container;
    this.sections = [].slice.call(this.container.children);
    this.defaultParams = {
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
    this.options = {...this.defaultParams, ...options};
    this.allowPagination = true;
    this.current = 0;
  };

  init() {
    this._addElementsAttributes();
    this._crateNavigation();

    this.paginateBinded = this.paginate.bind(this);

    this._paginate();

    if (this.getIdFromUrl() && this.getIdFromUrl().length > 1) {
      this._paginateOnLoad();
    };

    if (this.afterLoad) {
      this.afterLoad();
    };
  };

  getIdFromUrl() {
    const url = window.location.href;
    let id;
    if (url.indexOf('#') !== -1) {
      id = url.substring(url.lastIndexOf('#'));
    };
    if (id) {
      return id.slice(1);
    };
  };

  paginateToNext(condition) {
    this.direction = condition ? 1 : -1;
    this.next = this.current + this.direction;
  };

  paginateOnNavButtonClick(e, btn) {
      e.preventDefault();
      const index = +btn.getAttribute(Fullpage.constants.index);

      if (typeof index !== 'number') return;
      this.next = index;

      this.direction = this.next > this.current ? 1 : -1;
  };

  paginateOnAnchorClick(e, btn) {
      const id = btn.getAttribute(Fullpage.constants.anchor);
      let targetSection;

      this.sections.forEach(section => {
        const currentId = section.hasAttribute(Fullpage.constants.anchorId) ? section.getAttribute(Fullpage.constants.anchorId) : null;
        if (currentId === id) targetSection = section;
      });

      this.next = +targetSection.getAttribute(Fullpage.constants.index);;
      this.direction = this.next > this.current ? 1 : -1;
  };

  paginateOnPrevNextClick(e, prevBtn, nextBtn) {
    e.preventDefault();
    this.paginateToNext(nextBtn);
  };

  toggleDisableButtonsClasses() {
    if (this.next === this.sections.length - 1) {
      this.options.nextButton.classList.add(Fullpage.constants.IS_DISABLED);
    } else {
      this.options.nextButton.classList.remove(Fullpage.constants.IS_DISABLED);
    };
    if (this.next === 0) {
      this.options.prevButton.classList.add(Fullpage.constants.IS_DISABLED);
    } else {
      this.options.prevButton.classList.remove(Fullpage.constants.IS_DISABLED);
    };
  };

  paginate(e) {
    if (!this.allowPagination) return;

    if (e.type === 'wheel') {
      this.paginateToNext(e.deltaY > 0);
    };

    if (e.type === 'click') {
      const navBtn = e.target.closest(`.${Fullpage.constants.navButton}`);
      const anchorBtn = e.target.closest(`[${Fullpage.constants.anchor}]`);
      const prevBtn = e.target.closest(`.${Fullpage.constants.prev}`);
      const nextBtn = e.target.closest(`.${Fullpage.constants.next}`);

      if (navBtn) {
        this.paginateOnNavButtonClick(e, navBtn);
      };
      if (anchorBtn) {
        this.paginateOnAnchorClick(e, anchorBtn);
      };
      if (prevBtn || nextBtn) {
        this.paginateOnPrevNextClick(e, prevBtn, nextBtn);
      };

      if (navBtn === null
          && anchorBtn === null
          && prevBtn === null
          && nextBtn === null) return;
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
        if (section.hasAttribute(Fullpage.constants.anchorId, id)) {
          this.next = i;
        };
      });
    };

    if (this.options.loop) {
      if (this.next > this.sections.length - 1) {
        this.next = 0;
        this.loopTo = 'first';
      } else if (this.next < 0) {
        this.next = this.sections.length - 1;
        this.loopTo = 'last';
      } else {
        this.loopTo = false;
      };

      if (this.next === this.current) return;
    } else {
      if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;
    };

    if(!this.options.loop) {
      this.toggleDisableButtonsClasses();
    };    

    if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;

    this.allowPagination = false;

    this.navigation.forEach(btn => {
      btn.classList.remove(Fullpage.constants.IS_ACTIVE);
    });
    this.navigation[this.next].classList.add(Fullpage.constants.IS_ACTIVE);

    if (this.options.toggleClassesFirst) {
      this.sections[this.current].classList.remove(Fullpage.constants.IS_ACTIVE);
      this.sections[this.next].classList.add(Fullpage.constants.IS_ACTIVE);
    };

    this.startTime = new Date().getTime();

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
      fadeInDuration: this.options.fadeInDuration,
      customTransition: this.options.customTransition,
      toggleClassesFirst: this.options.toggleClassesFirst
    });
    this.animator.onComplete = () => {
      if (this.onComplete) {
        this.onComplete();
      };

      this.current = this.next;

      const duration = this.animator.finishTime - this.startTime;
      if (duration < this.options.delay) {
        setTimeout(() => {
          this.allowPagination = true;
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
        section.classList.add(Fullpage.constants.IS_ABSOLUTE);
        section.style.opacity = 0;
      });
      this.sections[0].style.opacity = 1;
    };
    
    // add first section active class
    this.sections[0].classList.add(Fullpage.constants.IS_ACTIVE);

    // add section indexes
    this.sections.forEach((section, i) => {
      section.setAttribute(Fullpage.constants.index, i);
    });

    // add prev next buttons class names
    if (this.options.prevButton) {
      this.options.prevButton.classList.add(Fullpage.constants.prev);
    };
    if (this.options.nextButton) {
      this.options.nextButton.classList.add(Fullpage.constants.next);
    };

    // add prevButton disabled class
    if (!this.options.loop) {
      if (this.current === 0) {
        this.options.prevButton.classList.add(Fullpage.constants.IS_DISABLED);
      };
    };    
  };

  _paginate() {
    const events = this.options.touchevents ? ['wheel', 'click', 'swu', 'swd'] : ['wheel', 'click'];

    events.forEach(event => {
      document.addEventListener(event, this.paginateBinded);
    });
  };

  _paginateOnLoad() {
    this.paginate(this.getIdFromUrl());
  };

  _crateNavigation() {
    if(!this.options.navigation) return;

    const nav = this.options.navigation;
    nav.innerHTML = `<ul class="${Fullpage.constants.navList}"></ul>`;

    for (let i = 0; i < this.sections.length; i++) {
      const list = nav.querySelector('ul');
      const item = document.createElement('li');
      item.className = Fullpage.constants.navItem;
      if (this.options.renderNavButton) {
        
        if (i === 0) {
          item.innerHTML = `<button class="${Fullpage.constants.navButton} ${Fullpage.constants.IS_ACTIVE}" ${Fullpage.constants.index}="${i}">${this.options.renderNavButton(i)}</button>`;
        } else {
          item.innerHTML = `<button class="${Fullpage.constants.navButton}" ${Fullpage.constants.index}="${i}">${this.options.renderNavButton(i)}</button>`;
        };
      } else {
        if (i === 0) {
          item.innerHTML = `<button class="${Fullpage.constants.navButton} ${Fullpage.constants.IS_ACTIVE}" ${Fullpage.constants.index}="${i}">${i + 1}</button>`;
        } else {
          item.innerHTML = `<button class="${Fullpage.constants.navButton}" ${Fullpage.constants.index}="${i}">${i + 1}</button>`;
        };
      };      

      list.appendChild(item);
    };
    this.navigation = [].slice.call(nav.querySelectorAll(`.${Fullpage.constants.navButton}`));    
  };  
};

Fullpage.constants = {
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