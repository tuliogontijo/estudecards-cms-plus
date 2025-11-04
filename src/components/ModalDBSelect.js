
import csvProcessor from '@fn/csvProcessor';

const ModalDBSelect = (page = 'registros') => {

  $('body').append(`
  <div id="dataBase" title="Base de dados">
    <p>Selecione um arquivo no formato CSV para servir como base de dados para a inserção de ${page} em lote:</p>
    <input id="inputCSV" type="file" accept=".csv, text/csv"></input>
  </div>
  `);


  $('#dataBase').dialog({
    autoOpen: false,
    resizable: false,
    width: 400,
    modal: true,
    show: 300,
    buttons: [
      {
        id: 'btnSendCSV',
        text: 'Enviar',
        disabled: true,
        prepend: '<span class=\'ui-icon ui-icon-triangle-1-n\'></span>',
        click: function () {
          const file = $('#inputCSV')[0].files[0];
          const fileExtension = file.name.substring(file.name.lastIndexOf('.'), file.name.length).toLocaleLowerCase().trim();

          if (fileExtension === '.csv') {
            csvProcessor(file);
            //   $('#analiseCSV').dialog('open');
            $(this).dialog('close');
          } else {
            $('#inputCSV').after('<small class="noFieldsError">Arquivo inválido! Selecione um documento no formato "CSV".</small>');
          }
        },
      },
      {
        text: 'Cancelar',
        prepend: '<span class=\'ui-icon ui-icon-circle-close\'></span>',
        click: function () {
          $(this).dialog('close');
          $('#dataBase small').remove();
          // functions.clearInputs();
        }
      },

    ],
  });

  $('#inputCSV').on('change', () => {
    $('#btnSendCSV').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  });


};

export default ModalDBSelect;
