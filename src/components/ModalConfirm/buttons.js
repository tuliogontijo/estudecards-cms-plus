import { handleClickBack, handleClickCancel, handleClickYes } from './handlers';

const buttons = [
  {
    id: 'btnConfirm',
    text: 'Sim',
    prepend: '<span class=\'ui-icon ui-icon-circle-check\'></span>',
    click: handleClickYes,
  },
  {
    text: 'Cancelar',
    prepend: '<span class=\'ui-icon ui-icon-circle-close\'></span>',
    click: handleClickCancel
  }, {
    text: 'Voltar',
    prepend: '<span class=\'ui-icon ui-icon-circle-arrow-w\'></span>',
    click: handleClickBack
  },

];

export default buttons;
