
import ModalBase from '@components/ModalBase';
import buttons from './buttons';

const ModalConfirm = (page = 'registros') => {

  $('body').append(`
  <div id="confirm" title="Confirmação">
    <p>Você tem certeza de que deseja incluir <span id="rows-quantity"></span> ${page}?</p>
  </div>
  `);

  $('#confirm').dialog({
    ...ModalBase,
    buttons: buttons
  });


};

export default ModalConfirm;
