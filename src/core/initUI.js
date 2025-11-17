import { pages } from '@constants';

import fixEditCardsUI from '@utils/fixEditCardsUI';

import ButtonCreateBulk from '@components/buttonCreateBulk';
import ModalConfirm from '@components/ModalConfirm';
import ModalDBSelect from '@components/ModalDBSelect';
import ModalError from '@components/ModalError';
import ModalExecution from '@components/ModalExecution';


const initUI = (page) => {
  if (page === pages.CARDS || page === pages.QUESTIONS) {
    ModalDBSelect(page);
    ModalConfirm(page);
    ModalExecution(page);
    ModalError();
    ButtonCreateBulk(page);
  } else if (page === pages.EDIT) {
    fixEditCardsUI();
  }
};

export default initUI;
