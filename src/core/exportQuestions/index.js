import { readQuestionDetails, readQuestions } from '@core/readers/questions';

import downloadCSV, { fileDate } from '@utils/downloadCSV';

const MAX_IMPORT_ANSWERS = 6;

/**
 * Exporta as perguntas selecionadas no mesmo layout do CSV de importação, com as respostas ativas.
 * A coluna ID permite reenviar a planilha editada para atualizar as perguntas em vez de criar novas.
 * Devolve avisos sobre perguntas que não poderão ser reimportadas sem ajuste.
 */
const exportQuestions = async (disciplineId) => {
  const questions = (await readQuestions(disciplineId)).filter(question => question.selecionado);

  if (!questions.length) {
    throw new Error('Nenhuma pergunta selecionada. Marque as perguntas na coluna "Seleção" (ou use "Selecionar tudo") e tente novamente.');
  }

  const fullQuestions = (await readQuestionDetails(disciplineId, questions))
    .map(question => ({ ...question, respostas: question.respostas.filter(answer => answer.ativa) }))
    .sort((a, b) => a.id - b.id);

  const answerColumns = Math.max(MAX_IMPORT_ANSWERS, ...fullQuestions.map(({ respostas }) => respostas.length));
  const warnings = [];

  const data = fullQuestions.map(({ id, pergunta, fonte, comentario, assunto, status, respostas }) => {
    const correctIndexes = respostas.map((answer, i) => answer.correta ? i + 1 : null).filter(Boolean);

    if (respostas.length > MAX_IMPORT_ANSWERS) {
      warnings.push(`Pergunta ${id}: tem ${respostas.length} respostas ativas (a importação aceita até ${MAX_IMPORT_ANSWERS}).`);
    }
    if (correctIndexes.length !== 1) {
      warnings.push(`Pergunta ${id}: tem ${correctIndexes.length} respostas corretas (a importação exige exatamente 1).`);
    }

    const answerCells = Array.from({ length: answerColumns }, (_, i) => respostas[i]?.resposta ?? '');

    return [id, pergunta, fonte, comentario, assunto, status, ...answerCells, correctIndexes.length === 1 ? correctIndexes[0] : ''];
  });

  downloadCSV(
    ['ID', 'Pergunta', 'Fonte', 'Comentario', 'Assunto', 'Status', ...Array.from({ length: answerColumns }, (_, i) => `Res${i + 1}`), 'Correta'],
    data,
    `perguntas_disciplina_${disciplineId}_${fileDate()}.csv`
  );

  return { warnings };
};

export default exportQuestions;
