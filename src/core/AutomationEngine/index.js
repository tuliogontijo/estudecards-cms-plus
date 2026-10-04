import applyPositions from './applyPositions';
import createCard from './createCard';
import createQuestion from './createQuestion';
import getStatus from './getStatus';
import getSubjects from './getSubjects';
import resolveReferences from './resolveReferences';

import { pages } from '@constants';

import { handleCallErrorModal } from '@components/ModalError/handlers';
import { handleCloseExecution, handleSetCurrentExecution, handleSetSuccessfulExecutionText } from '@components/ModalExecution/handlers';

import delay from '@utils/delay';


const automationEngine = async (page) => {
  try {
    const storedCsvData = localStorage.getItem('csvData');

    if (!storedCsvData) {
      throw new Error('Nenhum CSV carregado. Envie o arquivo novamente.');
    }

    const csvData = JSON.parse(storedCsvData).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value?.toString() || ''])));
    const disciplineId = localStorage.getItem('pageId');
    const subjects = await getSubjects(disciplineId);

    // Valida todos os assuntos e status antes de criar qualquer registro.
    const { rows, errors } = resolveReferences(csvData, subjects, getStatus());

    if (errors.length) {
      throw new Error(`${errors.join('\n\n')}\n\nNenhum registro foi criado.`);
    }

    const createRecord = page === pages.CARDS ? createCard : createQuestion;

    for (const [i, { row, subjectId, statusId }] of rows.entries()) {
      const { success, error } = (await createRecord(subjectId, statusId, disciplineId, row)) || {};

      if (!success) {
        throw new Error(`Falha na linha ${i + 2} do CSV: ${error || 'resposta inesperada do servidor'}.\n${i} de ${rows.length} registros já foram criados antes do erro.`);
      }

      handleSetCurrentExecution(i + 1);
    }

    if (page === pages.CARDS) {
      const { success, error } = await applyPositions(disciplineId, rows.map(({ row }) => row));

      if (!success) {
        throw new Error(error);
      }
    }

    await delay(1000);
    handleSetSuccessfulExecutionText();

    await delay(2000);
    window.location.reload();
  } catch (error) {
    handleCloseExecution();
    handleCallErrorModal(error.message);
  }
};



export default automationEngine;
