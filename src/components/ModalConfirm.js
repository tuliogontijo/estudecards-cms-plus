import clearInputs from '@utils/clearInputs';

const ModalConfirm = (page = 'registros') => {

  const quantity = JSON.parse(localStorage.getItem('csvData')).length;

  $('body').append(`
  <div id="confirm" title="Confirmação">
    <p>Você tem certeza de que deseja incluir ${quantity} ${page}?</p>
  </div>
  `);

  $('#confirm').dialog({
    autoOpen: false,
    resizable: false,
    width: 400,
    modal: true,
    show: 300,
    close: () => clearInputs(),
    buttons: [
      {
        id: 'btnConfirm',
        text: 'Sim',
        prepend: '<span class=\'ui-icon ui-icon-circle-check\'></span>',
        click: function () {
          $(this).dialog('close');
          //chama automação
        },
      },
      {
        text: 'Cancelar',
        prepend: '<span class=\'ui-icon ui-icon-circle-close\'></span>',
        click: function () {
          $(this).dialog('close');
          clearInputs();
        }
      }, {
        text: 'Voltar',
        prepend: '<span class=\'ui-icon ui-icon-circle-arrow-w\'></span>',
        click: function () {
          $(this).dialog('close');
          $('#dataBase').dialog('open');
        }
      },

    ],
  });


};

export default ModalConfirm;
