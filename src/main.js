// import './polyfill';
import { checkPropertiesSupport, createTouchEvents } from './helpers';
import Animator from './Animator';

checkPropertiesSupport();

export function addFpTouchEvents() {
  createTouchEvents(document);
};

export class Fullpage {
  constructor(container, options) {
    this.container = container;
    this.sections = [].slice.call(this.container.children);
    this.defaultParams = {
      delay: 1400,
      transition: 500,
      easing: 'ease',
      navigation: false,
      renderNavButton: false,
      prevButton: false,
      nextButton: false,
      fadeIn: false,
      fadeInDuration: 500,
      touchevents: false,
      customTransition: false
    };
    options = Object.assign({}, this.defaultParams, options);
    this.options = {
      delay: options.delay,
      transition: options.transition,
      easing: options.easing,
      navigation: options.navigation,
      renderNavButton: options.renderNavButton,
      prevButton: options.prevButton,
      prevButton: options.prevButton,
      nextButton: options.nextButton,
      fadeIn: options.fadeIn,
      fadeInDuration: options.fadeInDuration,
      touchevents: options.touchevents,
      customTransition: options.customTransition,
    };

    this.allowPagination = true;
    this.current = 0;
  };

  init() {    
    this._addElementsAttributes();
    this._crateNavigation();

    this.paginateBinded = this.paginate.bind(this);

    this._paginate();
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
      const targetSection = document.querySelector(id);

      this.next = +targetSection.getAttribute(Fullpage.constants.index);;
      this.direction = this.next > this.current ? 1 : -1;
  };

  paginateOnPrevNextClick(e, prevBtn, nextBtn) {
    e.preventDefault();
    this.paginateToNext(nextBtn);    
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

    if (this.next >= this.sections.length || this.next < 0 || this.next === this.current) return;

    this.allowPagination = false;

    this.navigation.forEach(btn => {
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
      fadeInDuration: this.options.fadeInDuration,
      customTransition: this.options.customTransition
    });
    this.animator.animate();

    this.current = this.next;

    setTimeout(() => {
      this.allowPagination = true;
    }, this.options.delay);
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
  };

  _paginate() {
    const events = this.options.touchevents ? ['wheel', 'click', 'swu', 'swd'] : ['wheel', 'click'];

    events.forEach(event => {
      document.addEventListener(event, this.paginateBinded);
    });
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
  navList: 'fullpage-nav',
  navItem: 'fullpage-nav__item',
  navButton: 'fullpage-nav__button',
  prev: 'fullpage__prev',
  next: 'fullpage__next',
  anchor: 'data-anchor',
  index: 'data-fullpage-index'
};