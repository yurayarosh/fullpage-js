// commands
// rollup -c -w watch files
// rollup -c - bundle files

import { Fullpage, addFpTouchEvents } from './main';
addFpTouchEvents();

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
  loop: true
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
fullpage.init();

