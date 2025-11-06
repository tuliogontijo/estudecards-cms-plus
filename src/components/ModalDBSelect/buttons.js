import { handleClickCancel, handleClickSend } from './handlers';

const buttons = (page) => [
  {
    id: 'btnSendCSV',
    text: 'Enviar',
    disabled: true,
    prepend: '<span class=\'ui-icon ui-icon-circle-triangle-n\'></span>',
    click: () => handleClickSend(page),
  },
  {
    text: 'Cancelar',
    prepend: '<span class=\'ui-icon ui-icon-circle-close\'></span>',
    click: handleClickCancel
  },

];

export default buttons;
