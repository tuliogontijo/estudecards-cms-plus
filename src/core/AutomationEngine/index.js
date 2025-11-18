import createCard from './createCard';
import createQuestion from './createQuestion';
import getStatus from './getStatus';
import getSubjects from './getSubjects';

import { pages } from '@constants';

import { handleCallErrorModal } from '@components/ModalError/handlers';
import { handleSetCurrentExecution, handleSetSuccessfulExecutionText } from '@components/ModalExecution/handlers';

import delay from '@utils/delay';


const automationEngine = async (page) => {
  const csvData = JSON.parse(localStorage.getItem('csvData')).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value?.toString() || ''])));
  const disciplineId = localStorage.getItem('pageId');
  const subjects = await getSubjects(disciplineId);
  const status = getStatus();

  for (const [i, row] of csvData.entries()) {
    const subjectId = subjects.find(subject => subject.subjectName === row.assunto.toLowerCase()).subjectId;
    const statusId = status.find(status => status.statusName === row.status.toLowerCase()).statusId;

    const { success, error } = page === pages.CARDS ? await createCard(subjectId, statusId, disciplineId, row) : await createQuestion(subjectId, statusId, disciplineId, row);

    if (success) {
      handleSetCurrentExecution(i + 1);
    } else {
      handleCallErrorModal(error);
      break;
    }
  }

  await delay(1000);
  handleSetSuccessfulExecutionText();

  await delay(2000);
  window.location.reload();
};



export default automationEngine;
