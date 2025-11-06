import ButtonCreateBulk from '@components/buttonCreateBulk';
import ModalConfirm from '@components/ModalConfirm';
import ModalDBSelect from '@components/ModalDBSelect';

const initUI = (page) => {

  ButtonCreateBulk(page);
  ModalDBSelect(page);
  ModalConfirm(page);



};

export default initUI;
