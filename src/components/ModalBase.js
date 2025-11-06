import clearInputs from '@utils/clearInputs';

const ModalBase = {
  autoOpen: false,
  resizable: false,
  width: 400,
  modal: true,
  show: 300,
  close: () => {
    clearInputs();
  }
};

export default ModalBase;
