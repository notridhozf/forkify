import View from './view.js';

class HomepageView extends View {
  _parentElement = document.querySelector('.header__logo');

  addHandlerHomepage(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

export default new HomepageView();
