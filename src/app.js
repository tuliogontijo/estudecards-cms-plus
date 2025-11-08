import 'jquery';
import 'jquery-ui-dist/jquery-ui.css';
import 'jquery-ui-dist/jquery-ui.js';

import '@styles/global.css';

import { pages } from '@constants';

import initUI from '@core/initUI';

(() => {
  'use strict';

  const pathNameParts = document.location.pathname.split('/');
  const pageName = pathNameParts[2];
  const pageId = pathNameParts[4];

  localStorage.setItem('pageId', pageId);

  let page;

  let inject = true;

  if (pageName === 'disciplina_cards') {
    page = pages.CARDS;
  } else if (pageName === 'disciplina_perguntas') {
    page = pages.QUESTIONS;
  } else {
    inject = false;
  }

  inject && initUI(page);


})();
