
import ModalBase from '@components/ModalBase';
import svgError from '@img/error.svg';

import buttons from './buttons';
import { handleOpen } from './handlers';


const ModalError = () => {

  $('body').append(`
  <div id="error" title="Erro">
    ${svgError}
    <p>Alguma coisa deu errado durante o processo de replicação.</p>
    <p>Verifique sua conexão e seu arquivo CSV e tente novamente</p>
  </div>
  `);

  $('#error').dialog({
    ...ModalBase,
    open: () => handleOpen(),
    buttons: buttons
  });
};

export default ModalError;
