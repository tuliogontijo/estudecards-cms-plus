import { pages } from '@constants';

import fixEditCardsUI from '@utils/fixEditCardsUI';

import ButtonCreateBulk from '@components/ButtonCreateBulk';
import ButtonDownloadCards from '@components/ButtonDownloadCards';
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
    page === pages.CARDS && ButtonDownloadCards();
  } else if (page === pages.EDIT) {
    fixEditCardsUI();
  }
};

export default initUI;
