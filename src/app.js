import 'jquery';
import 'jquery-ui-dist/jquery-ui.js';

import '@styles/global.css';

import 'jquery-ui-dist/jquery-ui.css';

import initUI from '@fn/initUI';

(function () {
  'use strict';

  const pathName = document.location.pathname;
  let page;
  let inject = true;

  if (pathName.includes('disciplina_cards')) {
    page = 'Cards';
  } else if (pathName.includes('disciplina_perguntas')) {
    page = 'Perguntas';
  } else {
    inject = false;

  }

  inject && initUI(page);





})();
