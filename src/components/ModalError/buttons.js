import { handleClickCloseBtn } from './handlers';

const buttons = [

  {
    id: 'btn-close-error',
    text: 'Fechar',
    prepend: '<span class=\'ui-icon ui-icon-circle-close\'></span>',
    click: handleClickCloseBtn
  },

];

export default buttons;
