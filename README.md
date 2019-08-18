# fullpage-pagination

### Example

  * [Codesandbox](https://codesandbox.io/s/fullpage-pagination-example-srixb)

### Install

```html
npm i fullpage-pagination -D
```

```html
<div class="fullpage">
  <div class="fullpage__inner js-fullpage">
    <div class="fullpage__section" data-fullpage-id="section-1">section-1</div>
    <div class="fullpage__section" data-fullpage-id="section-2">section-2</div>
    <div class="fullpage__section" data-fullpage-id="section-3">section-3</div>
    <div class="fullpage__section" data-fullpage-id="section-4">section-4</div>
    <div class="fullpage__section" data-fullpage-id="section-5">section-5</div>
  </div>   
</div>

<!-- anchor -->
<button data-fullpage-anchor="section-3">button anchor to section 3</button>

<!-- anchor from another page -->
<a href="#section-3">link anchor to section 3 from another page</a>
```

```js
import { Fullpage, addTouchEvents } from 'fullpage-pagination';
addTouchEvents();

const page = document.querySelector('.js-fullpage');
const options = {
  // some options
};

const fullpage = new Fullpage(page, options);
fullpage.init();
```

### Options

Standart options
```js
{
  transition: 500, // slide transition in miliseconds
  easing: 'ease', // slide transition easing
  navigation: false, // html nav container
  renderNavButton: false, // (i) => { // return button html }
  prevButton: false, // prev button html element
  nextButton: false, // next button html element
  fadeIn: false, // fade effect
  fadeInDuration: 500, // fade effect duration
  customTransition: false, // no effects, just toggle active classnames
  touchevents: false, // pagination on touchevents
  loop: false, // loop option
  toggleClassesFirst: false // if true - toggle sections classes before animation
}
```

### Events

```js
fullpage.afterLoad = () => {
  // some callback
};
fullpage.onExit = (section, resolve) => {
  // some callback
};
fullpage.onEnter = (section, resolve) => {
  // some callback
};
fullpage.onComplete = () => {
  // some callback
};
```
