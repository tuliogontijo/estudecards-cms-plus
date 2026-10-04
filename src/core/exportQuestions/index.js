import { listUrl, updateUrl } from '@constants';

import downloadCSV, { fileDate } from '@utils/downloadCSV';
import fetchDocument from '@utils/fetchDocument';
import getListRows, { isSelected } from '@utils/getListRows';

const MAX_IMPORT_ANSWERS = 6;
const CONCURRENT_REQUESTS = 4;

/**
 * Perguntas marcadas como "Selecionado" na listagem completa da disciplina (sem filtro de busca).
 */
const getSelectedQuestions = async (disciplineId) => {
  const doc = await fetchDocument(listUrl('disciplina_perguntas', disciplineId), 'Não foi possível ler a lista de perguntas da disciplina');

  return getListRows(doc)
    .filter(({ cells }) => isSelected(cells[6]))
    .map(({ id, cells }) => ({
      id,
      assunto: cells[1].textContent.trim(),
      pergunta: cells[2].innerHTML.trim(),
      comentario: cells[3].innerHTML.trim(),
      status: cells[4].textContent.trim(),
    }));
};

/**
 * A fonte não aparece na listagem; é lida do formulário de edição da pergunta.
 */
const getSource = async (disciplineId, questionId) => {
  const doc = await fetchDocument(updateUrl('disciplina_perguntas', disciplineId, questionId), `Não foi possível ler a pergunta ${questionId}`);
  return doc.querySelector('textarea[name="disciplina_perguntas.fonte"]')?.value.trim() ?? '';
};

/**
 * Respostas da pergunta em ordem de cadastro (a mesma ordem das colunas Res1..Res6 na importação).
 */
const getAnswers = async (questionId) => {
  const doc = await fetchDocument(listUrl('disciplina_pergunta_respostas', questionId), `Não foi possível ler as respostas da pergunta ${questionId}`);

  return getListRows(doc)
    .sort((a, b) => a.id - b.id)
    .map(({ cells }) => ({
      resposta: cells[1].innerHTML.trim(),
      correta: cells[2].textContent.trim().toLowerCase() === 'correto',
    }));
};

const mapWithConcurrency = async (items, limit, fn) => {
  const results = new Array(items.length);
  let next = 0;

  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

/**
 * Exporta as perguntas selecionadas no mesmo layout do CSV de importação.
 * Devolve avisos sobre perguntas que não poderão ser reimportadas sem ajuste.
 */
const exportQuestions = async (disciplineId) => {
  const questions = await getSelectedQuestions(disciplineId);

  if (!questions.length) {
    throw new Error('Nenhuma pergunta selecionada. Marque as perguntas na coluna "Seleção" (ou use "Selecionar tudo") e tente novamente.');
  }

  const fullQuestions = await mapWithConcurrency(questions, CONCURRENT_REQUESTS, async question => ({
    ...question,
    fonte: await getSource(disciplineId, question.id),
    respostas: await getAnswers(question.id),
  }));

  fullQuestions.sort((a, b) => a.id - b.id);

  const answerColumns = Math.max(MAX_IMPORT_ANSWERS, ...fullQuestions.map(({ respostas }) => respostas.length));
  const warnings = [];

  const data = fullQuestions.map(({ id, pergunta, fonte, comentario, assunto, status, respostas }) => {
    const correctIndexes = respostas.map((answer, i) => answer.correta ? i + 1 : null).filter(Boolean);

    if (respostas.length > MAX_IMPORT_ANSWERS) {
      warnings.push(`Pergunta ${id}: tem ${respostas.length} respostas (a importação aceita até ${MAX_IMPORT_ANSWERS}).`);
    }
    if (correctIndexes.length !== 1) {
      warnings.push(`Pergunta ${id}: tem ${correctIndexes.length} respostas corretas (a importação exige exatamente 1).`);
    }

    const answerCells = Array.from({ length: answerColumns }, (_, i) => respostas[i]?.resposta ?? '');

    return [pergunta, fonte, comentario, assunto, status, ...answerCells, correctIndexes.length === 1 ? correctIndexes[0] : ''];
  });

  downloadCSV(
    ['Pergunta', 'Fonte', 'Comentario', 'Assunto', 'Status', ...Array.from({ length: answerColumns }, (_, i) => `Res${i + 1}`), 'Correta'],
    data,
    `perguntas_disciplina_${disciplineId}_${fileDate()}.csv`
  );

  return { warnings };
};

export default exportQuestions;
