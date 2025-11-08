
import ModalBase from '@components/ModalBase';
import loading from '@img/loading.svg';
import buttons from './buttons';

import { pages } from '@constants';

const ModalExecution = (page = 'registros') => {

  $('body').append(`
  <div id="execution" title="Execução">
    <p>Por favor, aguarde..</p>
    <div class="execution-container">
      <img src="${loading}" alt="Executando..." />
      <p><span id="execution-current">0</span> de <span id="execution-total"></span></p>
      <p>${page} foram processad${page === pages.CARDS ? 'o' : 'a'}s.</p>
    </div>
  </div>
  `);

  $('#execution').dialog({
    ...ModalBase,
    buttons: buttons
  });


};

export default ModalExecution;
