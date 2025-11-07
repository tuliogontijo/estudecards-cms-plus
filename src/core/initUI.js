import ButtonCreateBulk from '@components/buttonCreateBulk';
import ModalConfirm from '@components/ModalConfirm';
import ModalDBSelect from '@components/ModalDBSelect';
import ModalExecution from '@components/ModalExecution';


const initUI = (page) => {

  ButtonCreateBulk(page);
  ModalDBSelect(page);
  ModalConfirm(page);
  ModalExecution(page);


};

export default initUI;
