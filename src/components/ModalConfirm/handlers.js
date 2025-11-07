
export const handleClickCancel = () => {
  $('#confirm').dialog('close');
};

export const handleClickYes = () => {
  $('#confirm').dialog('close');
  $('#execution').dialog('open');
};

export const handleClickBack = () => {
  $('#confirm').dialog('close');
  $('#dataBase').dialog('open');
};

export const handleQuantity = (quantity) => $('#rows-quantity').text(quantity);

