
import ModalBase from '@components/ModalBase';
import buttons from './buttons';

const ModalConfirm = (page = 'registros') => {

  $('body').append(`
  <div id="confirm" title="Confirmação">
    <p id="confirm-summary"></p>
  </div>
  `);

  $('#confirm').dialog({
    ...ModalBase,
    buttons: (() => buttons(page))()
  });
};

export default ModalConfirm;
