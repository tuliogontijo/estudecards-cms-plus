import 'jquery';
import 'jquery-ui-dist/jquery-ui.js';

import '@styles/global.css';

import 'jquery-ui-dist/jquery-ui.css';

import ButtonCreateBulk from '@components/ButtonCreateBulk';
import initModals from '@fn/initModals';

(function () {
  'use strict';

  const pathName = document.location.pathname;
  let page;

  if (pathName.includes('disciplina_cards')) {
    page = 'Cards';
  } else if (pathName.includes('disciplina_perguntas')) {
    page = 'Perguntas';
  }



  initModals(page);
  ButtonCreateBulk(page);




})();
