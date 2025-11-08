import automationEngine from '@core/automationEngine';

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

export const handleQuantity = (quantity) => $('#rows-quantity').text(quantity);

