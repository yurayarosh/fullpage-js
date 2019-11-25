import constants from './components/constants';

export default class Animator {
  constructor(paginator) {
    this.paginator = paginator,
    this.sections = paginator.sections;
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
  };

  animate() {
    this._onExit.call(this.paginator)
      .then(this._changeSection.bind(this))
      .then(this._onEnter.bind(this.paginator))
      .then(this._onComplete.bind(this.paginator))
      .then(this.finish.bind(this.paginator))
  };

  destroy() {
    this._removeStyles();
  }

  fadeToggle() {
    this.current.style.transition = `opacity ${this.fadeInDuration}ms`;
    this.current.style.opacity = 0;

    setTimeout(() => {
      this.current.style.display = 'none';
      this.current.style.transition = '';
      this.current.classList.remove(constants.IS_ACTIVE);
    }, this.fadeInDuration);

    this.next.classList.add(constants.IS_ACTIVE);
    this.next.style.display = '';
    this.next.style.transition = `opacity ${this.fadeInDuration}ms`;
    setTimeout(() => {
      this.next.style.opacity = 1;
    }, 66);      
  };

  scrollToSection() {
    const wrapTop = this.container.getBoundingClientRect().top;
    const nextTop = this.next.getBoundingClientRect().top - wrapTop;

    this.translate = nextTop;

    this.container.style.transform = `translate(0px, -${this.translate}px)`;
    this.container.style.transition = `transform ${this.transition}ms ${this.easing}`;

    setTimeout(() => {
      this.container.style.transition = '';
      this.toggleActiveClasses();
    }, this.transition);    
  };

  toggleActiveClasses() {
    this.current.classList.remove(constants.IS_ACTIVE);
    this.next.classList.add(constants.IS_ACTIVE);
  };

  _onExit() {
    return new Promise(resolve => {
      if (this.onExit) {
        this.onExit(this.animator.current, resolve);
      } else {
        resolve();
      };
    });
  };

  _onEnter() {
    return new Promise(resolve => {
      if (this.onEnter) {
        this.onEnter(this.animator.next, resolve);
      } else {
        resolve();
      }
    });    
  };

  _onComplete() {
    return new Promise(resolve => {
      this.finishTime = new Date().getTime();
      
      if (this.onComplete) {
        this.onComplete(this.animator.next, resolve);
      } else {
        resolve();
      }
    });
  };

  _changeSection() {
    if (this.fadeIn) {
      this.fadeToggle();
    } else if (this.customTransition) {
      this.toggleActiveClasses();
    } else {
      this.scrollToSection();
    };        
  };

  _removeStyles() {
    this.sections.forEach((section) => {
      section.style.opacity = '';
      section.style.display = '';
      section.style.transition = '';
    })
  }
};
