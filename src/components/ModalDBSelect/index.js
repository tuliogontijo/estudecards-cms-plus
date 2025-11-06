import ModalBase from '@components/ModalBase';

import buttons from './buttons';
import { handleBtnSendStatus } from './handlers';

const ModalDBSelect = (page = 'registros') => {

  $('body').append(`
  <div id="dataBase" title="Base de dados">
    <p>Selecione um arquivo no formato CSV para servir como base de dados para a inserção de ${page} em lote:</p>
    <input id="inputCSV" type="file" accept=".csv, text/csv"></input>
  </div>
  `);


  $('#dataBase').dialog({
    ...ModalBase,
    buttons: (() => buttons(page))()
  });

  handleBtnSendStatus();

};

export default ModalDBSelect;
