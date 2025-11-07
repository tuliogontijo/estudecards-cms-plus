import csvProcessor from '@core/csvProcessor';

export const handleClickCancel = () => {
  $('#dataBase').dialog('close');
  $('#dataBase small').remove();
};

export const handleClickSend = async (page) => {
  $('#dataBase small').remove();
  const file = $('#inputCSV')[0].files[0];
  const fileExtension = file.name.substring(file.name.lastIndexOf('.'), file.name.length).toLocaleLowerCase().trim();

  if (fileExtension === '.csv') {
    const { isValid, errors, data } = await csvProcessor(file, page);

    if (isValid) {
      localStorage.setItem('csvData', JSON.stringify(data));
      $('#rows-quantity').text(data.length);
      $('#dataBase').dialog('close');
      $('#confirm').dialog('open');
    } else {
      handleValidationError(errors);
    }

  } else {
    $('#inputCSV').after('<small class="small-error">Arquivo inválido! Selecione um documento no formato "CSV".</small>');
  }
};

export const handleBtnSendStatus = () => $('#inputCSV').on('change', () => {
  $('#btnSendCSV').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  $('#dataBase small').remove();
});

const handleValidationError = (errors) => {
  errors.forEach(error => $('#inputCSV').after(`<small class="small-error">${error}</small>`));
  $('#btnSendCSV').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
};
