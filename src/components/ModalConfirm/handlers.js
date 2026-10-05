import automationEngine from '@core/AutomationEngine';

export const handleClickCancel = () => {
  $('#confirm').dialog('close');
};

export const handleClickYes = (page) => {
  $('#confirm').dialog('close');
  $('#execution').dialog('open');
  automationEngine(page);
};

export const handleClickBack = () => {
  $('#confirm').dialog('close');
  $('#dataBase').dialog('open');
};

/**
 * Texto de confirmação: linhas sem ID incluem registros; linhas com ID atualizam os existentes.
 */
export const handleSummary = (data, page) => {
  const updates = data.filter(row => parseInt(row.id, 10) > 0).length;
  const creates = data.length - updates;
  const actions = [
    creates ? `incluir ${creates}` : '',
    updates ? `atualizar ${updates}` : '',
  ].filter(Boolean).join(' e ');

  $('#confirm-summary').text(`Você tem certeza de que deseja ${actions} ${page.toLowerCase()}?`);
};

