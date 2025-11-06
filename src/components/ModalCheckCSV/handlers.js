
export const handleClickCancel = () => {
  $('#check-csv').dialog('close');
};

export const handleClickYes = () => {
  $('#check-csv').dialog('close');
  //chama automação
};

export const handleClickBack = () => {
  $('#check-csv').dialog('close');
  $('#dataBase').dialog('open');
};

export const handleQuantity = (quantity) => $('#rows-quantity').text(quantity);

