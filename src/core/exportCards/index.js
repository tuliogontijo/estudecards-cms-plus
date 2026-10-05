import readCards from '@core/readers/cards';

import downloadCSV, { fileDate } from '@utils/downloadCSV';

const sortByPosition = (a, b) => {
  const positionA = a.posicao || Infinity;
  const positionB = b.posicao || Infinity;
  return positionA !== positionB ? positionA - positionB : a.id - b.id;
};

/**
 * Exporta os cards selecionados no mesmo layout do CSV de importação. A coluna ID permite
 * reenviar a planilha editada para atualizar os cards em vez de criar novos.
 */
const exportCards = async (disciplineId) => {
  const cards = (await readCards(disciplineId)).filter(card => card.selecionado);

  if (!cards.length) {
    throw new Error('Nenhum card selecionado. Marque os cards na coluna "Seleção" (ou use "Selecionar tudo") e tente novamente.');
  }

  downloadCSV(
    ['ID', 'Pergunta', 'Resposta', 'Comentario', 'Assunto', 'Status', 'Posição'],
    cards.sort(sortByPosition).map(card => [card.id, card.pergunta, card.resposta, card.comentario, card.assunto, card.status, card.posicao || '']),
    `cards_disciplina_${disciplineId}_${fileDate()}.csv`
  );

  return { warnings: [] };
};

export default exportCards;
