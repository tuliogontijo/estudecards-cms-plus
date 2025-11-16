export const handleOpen = () => {
  const errorImg = $('#error').find('svg');
  errorImg.replaceWith(errorImg.clone());
};

export const handleCallErrorModal = () => {
  $('#error').dialog('open');
};

export const handleClickCloseBtn = () => {
  $('#error').dialog('close');
};
