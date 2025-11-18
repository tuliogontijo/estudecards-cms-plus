import clearInputs from '@utils/clearInputs';

const ModalBase = {
  autoOpen: false,
  resizable: false,
  width: 400,
  modal: true,
  show: 300,
  maxHeight: 400,
  close: () => {
    clearInputs();
  }
};

export default ModalBase;
