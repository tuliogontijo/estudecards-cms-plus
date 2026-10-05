import { readAnswers, readQuestionDetails, readQuestions } from '@core/readers/questions';

import csvContent from '@utils/csvContent';

import { ANSWER_STATUS, ANSWER_TYPE, createAnswerRecord, deleteAnswers, updateAnswer, updateQuestion } from './updateRecords';

const ANSWER_KEYS = ['res1', 'res2', 'res3', 'res4', 'res5', 'res6'];

/**
 * Respostas preenchidas do CSV, na ordem das colunas (as vazias são ignoradas, como na criação).
 */
const answersFromRow = (row) => ANSWER_KEYS
  .filter(key => row[key])
  .map(key => ({ cell: row[key], tipo: key === `res${row.correta}` ? ANSWER_TYPE.CORRECT : ANSWER_TYPE.WRONG }));

/**
 * Atualização de perguntas existentes (linhas do CSV com ID) e de suas respostas,
 * guardando o estado anterior para desfazer tudo em caso de erro.
 *
 * As respostas ativas são casadas por ordem com as colunas Res1..Res6. Respostas que sobram no CMS são
 * desativadas (não excluídas): elas podem estar referenciadas em simulados já respondidos.
 */
const questionSync = ({ disciplineId, refs }) => {
  const snapshots = new Map();
  const journal = [];

  return {
    /** Carrega o estado atual (incluindo fonte e respostas) e devolve os ids que não pertencem à disciplina. */
    async load(ids) {
      const questions = (await readQuestions(disciplineId)).filter(question => ids.includes(question.id));
      (await readQuestionDetails(disciplineId, questions)).forEach(question => snapshots.set(question.id, question));
      return ids.filter(id => !snapshots.has(id));
    },

    async update(id, { row, subjectId, statusId }) {
      const current = snapshots.get(id);
      const entry = { current, questionChanged: false, answersTouched: false };
      journal.push(entry);

      const fields = {
        pergunta: csvContent(row.pergunta, current.pergunta),
        fonte: csvContent(row.fonte, current.fonte),
        comentario: csvContent(row.comentario, current.comentario),
      };

      entry.questionChanged = Object.keys(fields).some(key => fields[key] !== current[key]) ||
        !refs.sameName(row.assunto, current.assunto) || !refs.sameName(row.status, current.status);

      if (entry.questionChanged) {
        await updateQuestion(disciplineId, id, { ...fields, subjectId, statusId });
      }

      const csvAnswers = answersFromRow(row);
      const activeAnswers = current.respostas.filter(answer => answer.ativa);

      for (let i = 0; i < Math.max(csvAnswers.length, activeAnswers.length); i++) {
        const csvAnswer = csvAnswers[i];
        const answer = activeAnswers[i];

        if (csvAnswer && answer) {
          const resposta = csvContent(csvAnswer.cell, answer.resposta);
          const wasCorrect = answer.correta;

          if (resposta !== answer.resposta || (csvAnswer.tipo === ANSWER_TYPE.CORRECT) !== wasCorrect) {
            entry.answersTouched = true;
            await updateAnswer(id, answer.id, { resposta, tipo: csvAnswer.tipo, status: ANSWER_STATUS.ACTIVE });
          }
        } else if (csvAnswer) {
          entry.answersTouched = true;
          await createAnswerRecord(id, { resposta: csvContent(csvAnswer.cell, ''), tipo: csvAnswer.tipo });
        } else {
          entry.answersTouched = true;
          await updateAnswer(id, answer.id, {
            resposta: answer.resposta,
            tipo: answer.correta ? ANSWER_TYPE.CORRECT : ANSWER_TYPE.WRONG,
            status: ANSWER_STATUS.INACTIVE,
          });
        }
      }

      return entry.questionChanged || entry.answersTouched;
    },

    /**
     * Restaura perguntas e respostas alteradas e chama `deleteCreated` para excluir as perguntas novas.
     */
    async rollback(deleteCreated) {
      const failures = [];
      let restored = 0;

      for (const { current, questionChanged, answersTouched } of journal.slice().reverse()) {
        if (!questionChanged && !answersTouched) continue;
        restored++;

        try {
          if (answersTouched) {
            const answersNow = await readAnswers(current.id);
            const originalIds = current.respostas.map(answer => answer.id);
            const createdIds = answersNow.filter(answer => !originalIds.includes(answer.id)).map(answer => answer.id);

            createdIds.length && await deleteAnswers(current.id, createdIds);

            for (const original of current.respostas) {
              const now = answersNow.find(answer => answer.id === original.id);
              if (now && now.resposta === original.resposta && now.correta === original.correta && now.status === original.status) continue;

              await updateAnswer(current.id, original.id, {
                resposta: original.resposta,
                tipo: original.correta ? ANSWER_TYPE.CORRECT : ANSWER_TYPE.WRONG,
                status: refs.statusId(original.status),
              });
            }
          }

          if (questionChanged) {
            await updateQuestion(disciplineId, current.id, {
              pergunta: current.pergunta,
              fonte: current.fonte,
              comentario: current.comentario,
              subjectId: refs.subjectId(current.assunto),
              statusId: refs.statusId(current.status),
            });
          }
        } catch (error) {
          failures.push(`pergunta ${current.id}: ${error.message}`);
        }
      }

      return { deleteMessage: await deleteCreated(), restored, failures };
    },
  };
};

export default questionSync;
