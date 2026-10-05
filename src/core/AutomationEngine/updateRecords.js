import postForm from './postForm';

const ANSWER_TYPE = { CORRECT: 1, WRONG: 2 };
const ANSWER_STATUS = { ACTIVE: 1, INACTIVE: 2 };

export { ANSWER_STATUS, ANSWER_TYPE };

/**
 * Campos na ordem esperada pela action "update" de disciplina_cards:
 * pergunta, resposta, comentário, assunto, posição, status.
 */
export const updateCard = (disciplineId, cardId, { pergunta, resposta, comentario, subjectId, posicao, statusId }) =>
  postForm(`/ws/disciplina_cards/sys-update/${cardId}`, [pergunta, resposta, comentario, subjectId, posicao, statusId].join('<gz>'), disciplineId);

/**
 * Campos na ordem esperada pela action "update" de disciplina_perguntas:
 * pergunta, fonte, comentário, assunto, status.
 */
export const updateQuestion = (disciplineId, questionId, { pergunta, fonte, comentario, subjectId, statusId }) =>
  postForm(`/ws/disciplina_perguntas/sys-update/${questionId}`, [pergunta, fonte, comentario, subjectId, statusId].join('<gz>'), disciplineId);

export const updateAnswer = (questionId, answerId, { resposta, tipo, status }) =>
  postForm(`/ws/disciplina_pergunta_respostas/sys-update/${answerId}`, [resposta, tipo, status].join('<gz>'), questionId);

export const createAnswerRecord = (questionId, { resposta, tipo }) =>
  postForm('/ws/disciplina_pergunta_respostas/sys-create', [resposta, tipo, ANSWER_STATUS.ACTIVE].join('<gz>'), questionId);

export const deleteAnswers = (questionId, answerIds) =>
  postForm(`/ws/disciplina_pergunta_respostas/sys-delete/${encodeURIComponent(answerIds.map(id => `<gz>${id}`).join(''))}`, '', questionId);

export const setPosition = (disciplineId, cardId, position) =>
  postForm(`/ws/disciplina_cards/posicao/${cardId}`, position, disciplineId);
