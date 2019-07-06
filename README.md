# fullpage-js

### Example

  * [Codepen](https://codepen.io/yurayarosh/pen/jjvXYZ?editors=0010)

### Install

```html
npm i @yurayarosh/fullpage-js' -D
```

```html
<div class="fullpage">
  <div class="fullpage__inner js-fullpage">
    <div class="fullpage__section" id="section-1">section-1</div>
    <div class="fullpage__section" id="section-2">section-2</div>
    <div class="fullpage__section" id="section-3">section-3</div>
    <div class="fullpage__section" id="section-4">section-4</div>
    <div class="fullpage__section" id="section-5">section-5</div>
  </div>

  <div class="fullpage__nav js-fullpage-nav"></div>

  <div class="fullpage__btns">
    <button class="" data-anchor="#section-1">to section-1</button>
    <button class="" data-anchor="#section-5">to section-5</button>
    <button class="js-prev">prev</button>
    <button class="js-next">next</button>
  </div>    
</div>
```

```js
import Fullpage from 'fullpage-pagination';

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
fullpage.onExit = (section, resolve) => {
  console.log('this is some EXIT animation hapening');
  setTimeout(() => {
    console.log('EXIT animaton finished with this section', section);
    resolve();
  }, 0);
};
fullpage.onEnter = (section) => {
  console.log('hello from ENTER animation. this is current section', section);
};
fullpage.init();
```

### Options

Standart options
```js
{
  delay: 1400,
  transition: 500,
  easing: 'ease',
  navigation: false,
  renderNavButton: false,
  prevButton: false,
  nextButton: false,
  fadeIn: false,
  fadeInDuration: 500
}
```

### Events

```js
fullpage.onExit = (section, resolve) => {
  // some callback
};
fullpage.onEnter = (section) => {
  // some callback
};
```
