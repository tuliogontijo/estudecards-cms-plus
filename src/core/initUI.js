import ButtonCreateBulk from '@components/buttonCreateBulk';
import ModalConfirm from '@components/ModalConfirm';
import ModalDBSelect from '@components/ModalDBSelect';
import ModalExecution from '@components/ModalExecution';
import ModalError from '../components/ModalError';


const initUI = (page) => {

  ModalDBSelect(page);
  ModalConfirm(page);
  ModalExecution(page);
  ModalError();
  ButtonCreateBulk(page);


};

export default initUI;
