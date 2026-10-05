import cardSync from './cardSync';
import createCard from './createCard';
import createQuestion from './createQuestion';
import getStatus from './getStatus';
import { getLastRecordId, getRecordIdsCreatedAfter } from './getRecordIds';
import getSubjects from './getSubjects';
import questionSync from './questionSync';
import referenceMaps from './referenceMaps';
import resolveReferences from './resolveReferences';
import rollbackImport from './rollbackImport';

import { pages, records } from '@constants';

import { handleCallErrorModal } from '@components/ModalError/handlers';
import { handleCloseExecution, handleSetCurrentExecution, handleSetRollbackText, handleSetSuccessfulExecutionText } from '@components/ModalExecution/handlers';

import delay from '@utils/delay';

const recordId = (row) => parseInt(row.id, 10) || 0;

const describeRollback = ({ deleteMessage, restored, failures }) => [
  deleteMessage,
  restored ? `Registros atualizados restaurados ao estado anterior: ${restored - failures.length} de ${restored}.` : '',
  failures.length ? `ATENÇÃO: não foi possível restaurar automaticamente:\n- ${failures.join('\n- ')}\nConfira esses registros no CMS.` : '',
].filter(Boolean).join('\n\n');

/**
 * Importa o CSV: linhas sem ID criam registros; linhas com ID atualizam o registro existente.
 * A importação é tudo ou nada: em caso de erro, os registros criados são excluídos e os atualizados
 * voltam ao estado anterior.
 */
const automationEngine = async (page) => {
  const isCardsPage = page === pages.CARDS;
  const record = records[page];
  let disciplineId;
  let sync;
  // Maior id de registro da disciplina antes da importação; definido apenas quando há algo a desfazer.
  let lastIdBefore;
  let attempts = 0;

  try {
    const storedCsvData = localStorage.getItem('csvData');

    if (!storedCsvData) {
      throw new Error('Nenhum CSV carregado. Envie o arquivo novamente.');
    }

    const csvData = JSON.parse(storedCsvData).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value?.toString() || ''])));
    disciplineId = localStorage.getItem('pageId');
    const subjects = await getSubjects(disciplineId);
    const statusList = getStatus();

    // Valida todos os assuntos e status antes de criar ou alterar qualquer registro.
    const { rows, errors } = resolveReferences(csvData, subjects, statusList);

    if (errors.length) {
      throw new Error(`${errors.join('\n\n')}\n\nNenhum registro foi criado ou alterado.`);
    }

    const syncFactory = isCardsPage ? cardSync : questionSync;
    sync = syncFactory({ disciplineId, refs: referenceMaps(subjects, statusList) });

    const updateIds = rows.map(({ row }) => recordId(row)).filter(id => id > 0);

    if (updateIds.length) {
      const foreignIds = await sync.load(updateIds);

      if (foreignIds.length) {
        throw new Error(`Os IDs a seguir não pertencem a nenhum(a) ${record.label} desta disciplina: ${foreignIds.join(', ')}.\n` +
          'Para criar um registro novo, deixe a coluna ID em branco.\n\nNenhum registro foi criado ou alterado.');
      }
    }

    lastIdBefore = await getLastRecordId(record.screen, disciplineId);

    const createRecord = isCardsPage ? createCard : createQuestion;

    for (const [i, resolvedRow] of rows.entries()) {
      const { row, subjectId, statusId } = resolvedRow;
      const id = recordId(row);

      try {
        if (id) {
          await sync.update(id, resolvedRow);
        } else {
          attempts++;
          const { success, error } = (await createRecord(subjectId, statusId, disciplineId, row)) || {};
          if (!success) throw new Error(error || 'resposta inesperada do servidor');
        }
      } catch (error) {
        throw new Error(`Falha na linha ${i + 2} do CSV${id ? ` (ID ${id})` : ''}: ${error.message}.`);
      }

      handleSetCurrentExecution(i + 1);
    }

    if (isCardsPage) {
      const newRows = rows.filter(({ row }) => !recordId(row));
      const needsCreatedIds = newRows.some(({ row }) => parseInt(row.posicao, 10) > 0);
      const createdIds = needsCreatedIds ? await getRecordIdsCreatedAfter(record.screen, disciplineId, lastIdBefore) : [];

      if (needsCreatedIds && createdIds.length !== newRows.length) {
        throw new Error(`Esperava encontrar ${newRows.length} cards recém-criados, mas foram encontrados ${createdIds.length}. As posições não puderam ser aplicadas com segurança.`);
      }

      let next = 0;
      await sync.applyPositions(rows.map(({ row }) => {
        const id = recordId(row);
        return id ? { id, row, isNew: false } : { id: createdIds[next++], row, isNew: true };
      }));
    }

    await delay(1000);
    handleSetSuccessfulExecutionText();

    await delay(2000);
    window.location.reload();
  } catch (error) {
    let message = error.message;

    // Tudo ou nada: um erro no meio não pode deixar cards sem posição, perguntas sem respostas
    // nem parte da planilha aplicada.
    if (lastIdBefore !== undefined) {
      handleSetRollbackText();
      const result = await sync.rollback(() => rollbackImport(record, disciplineId, lastIdBefore, attempts));
      message += `\n\n${describeRollback(result)}`;
    }

    handleCloseExecution();
    handleCallErrorModal(message);
  }
};

export default automationEngine;
