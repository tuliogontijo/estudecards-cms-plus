
import ModalBase from '@components/ModalBase';
import buttons from './buttons';

const ModalExecution = (page = 'registros') => {

  $('body').append(`
  <div id="execution" title="Execução">
    <p>Por favor, aguarde enquanto a execução é realizada...</p>
    <p>A extensão está gerando ${page}.</p>
  </div>
  `);

  $('#execution').dialog({
    ...ModalBase,
    buttons: buttons
  });


};

export default ModalExecution;
