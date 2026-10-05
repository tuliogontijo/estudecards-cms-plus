import { listUrl, updateUrl } from '@constants';

import fetchDocument from '@utils/fetchDocument';
import getListRows, { isSelected } from '@utils/getListRows';
import mapWithConcurrency from '@utils/mapWithConcurrency';

const CONCURRENT_REQUESTS = 4;

/**
 * Todas as perguntas da disciplina, lidas da listagem completa (sem filtro de busca).
 * A listagem não traz a fonte nem as respostas; use `readQuestionDetails` para isso.
 */
export const readQuestions = async (disciplineId) => {
  const doc = await fetchDocument(listUrl('disciplina_perguntas', disciplineId), 'Não foi possível ler a lista de perguntas da disciplina');

  return getListRows(doc).map(({ id, cells }) => ({
    id,
    assunto: cells[1].textContent.trim(),
    pergunta: cells[2].innerHTML.trim(),
    comentario: cells[3].innerHTML.trim(),
    status: cells[4].textContent.trim(),
    selecionado: isSelected(cells[6]),
  }));
};

/**
 * A fonte não aparece na listagem; é lida do formulário de edição da pergunta.
 */
const readSource = async (disciplineId, questionId) => {
  const doc = await fetchDocument(updateUrl('disciplina_perguntas', disciplineId, questionId), `Não foi possível ler a pergunta ${questionId}`);
  return doc.querySelector('textarea[name="disciplina_perguntas.fonte"]')?.value.trim() ?? '';
};

/**
 * Respostas da pergunta em ordem de cadastro (a mesma ordem das colunas Res1..Res6 na importação).
 */
export const readAnswers = async (questionId) => {
  const doc = await fetchDocument(listUrl('disciplina_pergunta_respostas', questionId), `Não foi possível ler as respostas da pergunta ${questionId}`);

  return getListRows(doc)
    .sort((a, b) => a.id - b.id)
    .map(({ id, cells }) => ({
      id,
      resposta: cells[1].innerHTML.trim(),
      correta: cells[2].textContent.trim().toLowerCase() === 'correto',
      status: cells[3].textContent.trim(),
      ativa: cells[3].textContent.trim().toLowerCase() === 'ativo',
    }));
};

/**
 * Completa as perguntas com fonte e respostas (duas páginas por pergunta, com requisições em paralelo limitadas).
 */
export const readQuestionDetails = (disciplineId, questions) =>
  mapWithConcurrency(questions, CONCURRENT_REQUESTS, async question => ({
    ...question,
    fonte: await readSource(disciplineId, question.id),
    respostas: await readAnswers(question.id),
  }));
