import { handleClickCancel } from './handlers';

const buttons = [

  {
    id: 'btn-execution-cancel',
    text: 'Cancelar execução',
    prepend: '<span class=\'ui-icon ui-icon-circle-close\'></span>',
    click: handleClickCancel
  },

];

export default buttons;
