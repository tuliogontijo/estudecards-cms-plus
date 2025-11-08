import createCard from './createCard';
import getStatus from './getStatus';
import getSubjects from './getSubjects';

import { handleSetCurrentExecution, handleSetSuccessfulExecutionText } from '@components/ModalExecution/handlers';

import { pages } from '@constants';

const automationEngine = async (page) => {
  const csvData = JSON.parse(localStorage.getItem('csvData')).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])));
  const disciplineId = localStorage.getItem('pageId');
  const subjects = await getSubjects(disciplineId);
  const status = getStatus();

  if (page === pages.CARDS) {
    csvData.forEach(async (row, i) => {
      const subjectId = subjects.find(subject => subject.subjectName === row.assunto).subjectId;
      const statusId = status.find(status => status.statusName === row.status).statusId;

      const { success, error } = await createCard(subjectId, statusId, disciplineId, row);

      if (success) {
        handleSetCurrentExecution(i + 1);
      } else {
        console.log(error);
      }
    });

    handleSetSuccessfulExecutionText();

    setTimeout(() => window.location.reload(),2000);

  };
};

export default automationEngine;
