
import ModalBase from '@components/ModalBase';
import loading from '@img/loading.svg';
import buttons from './buttons';

import { pages } from '@constants';
import { handleOpen } from './handlers';

const ModalExecution = (page = 'registros') => {

  $('body').append(`
  <div id="execution" title="Execução">
    <div id="execution-ongoing">
      <p>Por favor, aguarde..</p>
      <div class="execution-container">
        <div id="loader"></div>
        <p><span id="execution-current">0</span> de <span id="execution-total"></span></p>
        <p>${page} foram processad${page === pages.CARDS ? 'o' : 'a'}s.</p>
      </div>
    </div>
    <div id="execution-success">
      <p id="execution-success-text">Registros processados com sucesso!</p>
    </div>
  </div>
  `);

  $('#execution').dialog({
    ...ModalBase,
    open: () => handleOpen(loading),
    buttons: buttons
  });


};

export default ModalExecution;
