import { Fullpage, addTouchEvents } from './main';
addTouchEvents();

class MyFullpage extends Fullpage {
  constructor(page, options) {
    super(page, options);
    this.prevButton = options.prevButton;
    this.nextButton = options.nextButton;
  }

  // afterLoad() {
  //   console.log('hello from AFTERLOAD function');
  // }
  onExit(section, resolve) {
    console.log('exit', this);
    resolve()
    
    // console.log('EXIT animation is hapening');
    // setTimeout(() => {
    //   console.log('EXIT animaton has finished in this section', section);
    //   resolve();
    // }, 500);
  }
  onEnter(section, resolve) {
    console.log('enter', this);
    resolve()
    
    // setTimeout(() => {
    //   console.log('ENTER animation has finished in this section', section);
    //   resolve();
    // }, 500);
  }
  onComplete(section, resolve) {
    console.log('complete', this);
    resolve()
     
    // const { sections } = this;
    // const { from, to } = this.animator;   
    
    // setTimeout(() => {
    //   console.log('this is ONCOMPETE function is triggering.');
    //   console.log('previous section', sections[from]);
    //   console.log('current section', sections[to]);
    //   resolve();
    // }, 1000);
  }

  init() {
    super.init();
  }

  destroy() {
    super.destroy()
  }
}

const page = document.querySelector('.js-fullpage');
const nav = document.querySelector('.js-fullpage-nav');
const prev = document.querySelector('.js-prev');
const next = document.querySelector('.js-next');

const options = {
  transition: 1000,
  delay: 1000,
  easing: 'cubic-bezier(.17,.67,.24,1.02)',
  touchevents: true,
  customTransition: false,
  fadeIn: false,
  fadeInDuration: 1000,
  navigation: nav,
  renderNavButton: i => {
    return i < 9 ? `0${i + 1}` : i + 1;
  },
  prevButton: prev,
  nextButton: next,
  loop: false,
  toggleClassesFirst: false
};

const fullpage = new MyFullpage(page, options);
fullpage.init();


