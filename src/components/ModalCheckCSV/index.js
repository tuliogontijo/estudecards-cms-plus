
import ModalBase from '../ModalBase';
import buttons from './buttons';

const ModalCheckCSV = (page = 'registros') => {

  $('body').append(`
  <div id="check-csv" title="Confirmação">
    <p>Você tem certeza de que deseja incluir <span id="rows-quantity"></span> ${page}?</p>
  </div>
  `);

  $('#check-csv').dialog({
    ...ModalBase,
    buttons: buttons
  });


};

export default ModalCheckCSV;
