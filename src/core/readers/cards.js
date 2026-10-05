import { listUrl } from '@constants';

import fetchDocument from '@utils/fetchDocument';
import getListRows, { isSelected } from '@utils/getListRows';

/**
 * Todos os cards da disciplina, lidos da listagem completa (sem filtro de busca).
 * A listagem é buscada de novo porque o DOM da página tem os textos truncados para exibição.
 */
const readCards = async (disciplineId) => {
  const doc = await fetchDocument(listUrl('disciplina_cards', disciplineId), 'Não foi possível ler a lista de cards da disciplina');

  return getListRows(doc).map(({ id, cells }) => ({
    id,
    posicao: parseInt(cells[1].getAttribute('data-posicao'), 10) || 0,
    assunto: cells[2].textContent.trim(),
    pergunta: cells[3].innerHTML.trim(),
    resposta: cells[4].innerHTML.trim(),
    comentario: cells[5].innerHTML.trim(),
    status: cells[6].textContent.trim(),
    selecionado: isSelected(cells[7]),
  }));
};

export default readCards;
