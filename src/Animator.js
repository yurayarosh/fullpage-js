export default class Animator {
  constructor({ direction, sections, from, to, transition, easing, onExit, onEnter, fadeIn, fadeInDuration }) {
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
  };

  animate() {
    this._onExit()
      .then(this._changeSection.bind(this))
      .then(this._onEnter.bind(this));
    
  };

  getSectionTop(section) {
    const rect = section.getBoundingClientRect();
    return rect.top;
  };

  fadeToggle() {
    this.current.style.transition = `opacity ${this.fadeInDuration}ms`;
    this.current.style.opacity = 0;

    setTimeout(() => {
      this.current.style.display = 'none';
      this.current.style.transition = '';
      this.current.classList.remove(Animator.classNames.IS_ACTIVE);
    }, this.fadeInDuration);

    this.next.classList.add(Animator.classNames.IS_ACTIVE);
    this.next.style.display = '';
    this.next.style.transition = `opacity ${this.fadeInDuration}ms`;
    setTimeout(() => {
      this.next.style.opacity = 1;
    }, 66);      
  };

  _onExit() {
    return new Promise(resolve => {
      if (this.onExit) {
        this.onExit(this.current, resolve);
      } else {
        resolve();
      };
    });
  };

  _onEnter() {
    if (this.onEnter) {
      this.onEnter(this.next);
    };
  };

  _changeSection() {
    if (this.fadeIn) {
      // this.setActiveClasses();
      this.fadeToggle();
    } else {
      const wrapTop = this.getSectionTop(this.container);
      const nextTop = this.getSectionTop(this.next) - wrapTop;
      const currentTop = this.getSectionTop(this.current) - wrapTop;

      this.translate = nextTop;

      this.container.style.transform = `translate(0px, -${this.translate}px)`;
      this.container.style.transition = `transform ${this.transition}ms ${this.easing}`;

      setTimeout(() => {
        this.container.style.transition = '';
        this.current.classList.remove(Animator.classNames.IS_ACTIVE);
        this.next.classList.add(Animator.classNames.IS_ACTIVE);
      }, this.transition);
    };        
  };
};

Animator.classNames = {
  IS_ACTIVE: 'is-active'
}