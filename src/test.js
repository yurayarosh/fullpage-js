// commands
// rollup -c -w watch files
// rollup -c - bundle files

import Fullpage from './main';

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
  nextButton: next
});
fullpage.init();

