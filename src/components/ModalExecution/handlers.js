export const handleClickCancel = () => {
  $('#execution').dialog('close');
};

export const handleSetCurrentExecution = (current) => {
  $('#execution-current').text(current);
};

export const handleSetSuccessfulExecutionText = () => {
  $('#execution').html(`
    <p>Registros processados com sucesso!</p>
    `);
};
