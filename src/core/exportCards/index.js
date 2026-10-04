import { listUrl } from '@constants';

import downloadCSV, { fileDate } from '@utils/downloadCSV';
import fetchDocument from '@utils/fetchDocument';
import getListRows, { isSelected } from '@utils/getListRows';

/**
 * Lê a listagem completa da disciplina (sem filtro de busca) e devolve os cards marcados como "Selecionado".
 * A listagem é buscada de novo porque o DOM da página tem os textos truncados para exibição.
 */
const getSelectedCards = async (disciplineId) => {
  const doc = await fetchDocument(listUrl('disciplina_cards', disciplineId), 'Não foi possível ler a lista de cards da disciplina');

  return getListRows(doc)
    .filter(({ cells }) => isSelected(cells[7]))
    .map(({ id, cells }) => ({
      id,
      posicao: parseInt(cells[1].getAttribute('data-posicao'), 10) || 0,
      assunto: cells[2].textContent.trim(),
      pergunta: cells[3].innerHTML.trim(),
      resposta: cells[4].innerHTML.trim(),
      comentario: cells[5].innerHTML.trim(),
      status: cells[6].textContent.trim(),
    }));
};

const sortByPosition = (a, b) => {
  const positionA = a.posicao || Infinity;
  const positionB = b.posicao || Infinity;
  return positionA !== positionB ? positionA - positionB : a.id - b.id;
};

/**
 * Exporta os cards selecionados no mesmo layout do CSV de importação,
 * para que o arquivo possa ser reimportado pela própria extensão.
 */
const exportCards = async (disciplineId) => {
  const cards = await getSelectedCards(disciplineId);

  if (!cards.length) {
    throw new Error('Nenhum card selecionado. Marque os cards na coluna "Seleção" (ou use "Selecionar tudo") e tente novamente.');
  }

  downloadCSV(
    ['Pergunta', 'Resposta', 'Comentario', 'Assunto', 'Status', 'Posição'],
    cards.sort(sortByPosition).map(card => [card.pergunta, card.resposta, card.comentario, card.assunto, card.status, card.posicao || '']),
    `cards_disciplina_${disciplineId}_${fileDate()}.csv`
  );

  return { warnings: [] };
};

export default exportCards;
