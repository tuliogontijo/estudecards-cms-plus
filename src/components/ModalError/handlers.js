export const handleOpen = () => {
  const errorImg = $('#error').find('svg');
  errorImg.replaceWith(errorImg.clone());
};

export const handleCallErrorModal = (errorMessage) => {
  $('#error').dialog('open');
  $('#error-description').text(errorMessage);
};

export const handleClickCloseBtn = () => {
  $('#error').dialog('close');
};
