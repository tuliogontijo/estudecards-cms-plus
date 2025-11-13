import success from '@img/success.svg';

export const handleClickCancel = () => {
  $('#execution').dialog('close');
};

export const handleSetCurrentExecution = (current) => {
  $('#execution-current').text(current);
};

export const handleSetSuccessfulExecutionText = () => {
  $('#execution-ongoing').hide();
  $('#execution').siblings('.ui-dialog-buttonpane').eq(0).hide();
  $('#execution-success').show();
  $('#execution-success-text').prepend(`<img src="${success}" alt="Sucesso!" />`);
};
