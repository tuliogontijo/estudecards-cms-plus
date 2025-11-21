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
    id: 'downloadCSVModel',
    text: 'Baixar modelo CSV',
    prepend: '<span class=\'ui-icon ui-icon-arrowthickstop-1-s\'></span>',
    click: () => {
      const link = document.createElement('a');
      link.href = `https://tuliogontijo.github.io/estudecards-cms-plus/modelo_${page.toLowerCase()}.csv`;
      link.download = `modelo_${page.toLowerCase}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  {
    text: 'Cancelar',
    prepend: '<span class=\'ui-icon ui-icon-circle-close\'></span>',
    click: handleClickCancel
  },

];

export default buttons;
