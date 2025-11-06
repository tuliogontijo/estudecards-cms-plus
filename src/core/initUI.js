import ButtonCreateBulk from '@components/buttonCreateBulk';
import ModalCheckCSV from '@components/ModalCheckCSV';
import ModalDBSelect from '@components/ModalDBSelect';


const initUI = (page) => {

  ButtonCreateBulk(page);
  ModalDBSelect(page);
  ModalCheckCSV(page);


};

export default initUI;
