import applyPositions from './applyPositions';
import createCard from './createCard';
import createQuestion from './createQuestion';
import getStatus from './getStatus';
import { getCardIdsCreatedAfter, getLastCardId } from './getDisciplineCardIds';
import getSubjects from './getSubjects';
import resolveReferences from './resolveReferences';
import rollbackCards from './rollbackCards';

import { pages } from '@constants';

import { handleCallErrorModal } from '@components/ModalError/handlers';
import { handleCloseExecution, handleSetCurrentExecution, handleSetRollbackText, handleSetSuccessfulExecutionText } from '@components/ModalExecution/handlers';

import delay from '@utils/delay';


const automationEngine = async (page) => {
  const isCardsPage = page === pages.CARDS;
  let disciplineId;
  // Maior id de card da disciplina antes da importação; definido apenas quando há algo a desfazer.
  let lastCardIdBefore;
  let attempts = 0;

  try {
    const storedCsvData = localStorage.getItem('csvData');

    if (!storedCsvData) {
      throw new Error('Nenhum CSV carregado. Envie o arquivo novamente.');
    }

    const csvData = JSON.parse(storedCsvData).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value?.toString() || ''])));
    disciplineId = localStorage.getItem('pageId');
    const subjects = await getSubjects(disciplineId);

    // Valida todos os assuntos e status antes de criar qualquer registro.
    const { rows, errors } = resolveReferences(csvData, subjects, getStatus());

    if (errors.length) {
      throw new Error(`${errors.join('\n\n')}\n\nNenhum registro foi criado.`);
    }

    if (isCardsPage) {
      lastCardIdBefore = await getLastCardId(disciplineId);
    }

    const createRecord = isCardsPage ? createCard : createQuestion;

    for (const [i, { row, subjectId, statusId }] of rows.entries()) {
      attempts++;
      const { success, error } = (await createRecord(subjectId, statusId, disciplineId, row)) || {};

      if (!success) {
        throw new Error(`Falha na linha ${i + 2} do CSV: ${error || 'resposta inesperada do servidor'}.\n${i} de ${rows.length} registros já foram criados antes do erro.`);
      }

      handleSetCurrentExecution(i + 1);
    }

    if (isCardsPage && rows.some(({ row }) => parseInt(row.posicao, 10) > 0)) {
      const createdIds = await getCardIdsCreatedAfter(disciplineId, lastCardIdBefore);

      if (createdIds.length !== rows.length) {
        throw new Error(`Esperava encontrar ${rows.length} cards recém-criados, mas foram encontrados ${createdIds.length}. As posições não puderam ser aplicadas com segurança.`);
      }

      await applyPositions(disciplineId, rows.map(({ row }) => row), createdIds);
    }

    await delay(1000);
    handleSetSuccessfulExecutionText();

    await delay(2000);
    window.location.reload();
  } catch (error) {
    let message = error.message;

    // Importação de cards é tudo ou nada: um erro no meio não pode deixar cards criados sem posição.
    if (isCardsPage && lastCardIdBefore !== undefined) {
      handleSetRollbackText();
      message += `\n\n${await rollbackCards(disciplineId, lastCardIdBefore, attempts)}`;
    }

    handleCloseExecution();
    handleCallErrorModal(message);
  }
};



export default automationEngine;
