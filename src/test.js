import { Fullpage, addTouchEvents } from './main';
addTouchEvents();

const page = document.querySelector('.js-fullpage');
const nav = document.querySelector('.js-fullpage-nav');
const prev = document.querySelector('.js-prev');
const next = document.querySelector('.js-next');

const fullpage = new Fullpage(page, {
  easing: 'ease-out',
  navigation: nav,
  fadeIn: false,
  fadeInDuration: 1000,
  renderNavButton: (i) => {
    return '0' + (i + 1);
  },
  prevButton: prev,
  nextButton: next,
  touchevents: true,
  customTransition: false,
  loop: false
});
fullpage.onExit = (section, resolve) => {
  console.log('EXIT animation is hapening');
  setTimeout(() => {
    console.log('EXIT animaton has finished in this section', section);
    resolve();
  }, 500);
};
fullpage.onEnter = (section) => {
  console.log('ENTER animation has started in this section', section);
};
fullpage.afterLoad = () => {
  console.log('hello from AFTERLOAD function');
};
fullpage.init();

