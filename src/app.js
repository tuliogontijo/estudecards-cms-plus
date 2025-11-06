import 'jquery';
import 'jquery-ui-dist/jquery-ui.css';
import 'jquery-ui-dist/jquery-ui.js';

import '@styles/global.css';

import { pages } from '@constants';

import initUI from '@core/initUI';

(() => {
  'use strict';

  const pathName = document.location.pathname;
  let page;
  let inject = true;

  if (pathName.includes('disciplina_cards')) {
    page = pages.CARDS;
  } else if (pathName.includes('disciplina_perguntas')) {
    page = pages.QUESTIONS;
  } else {
    inject = false;
  }

  inject && initUI(page);


})();
