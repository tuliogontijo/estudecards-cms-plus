/**
 * Retorna os ids de todos os cards da disciplina, em ordem crescente.
 * O endpoint de criação do CMS não devolve o id, então ele é lido da listagem da disciplina.
 */
const getDisciplineCardIds = async (disciplineId) => {
  const response = await fetch(`https://estudecards.com.br/cms/disciplina_cards/called/${disciplineId}/1/historyBack/0`, {
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`Não foi possível ler a lista de cards da disciplina (HTTP ${response.status}).`);
  }

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  return Array.from(doc.querySelectorAll('td.gz-posicao-cell[data-id]'))
    .map(cell => parseInt(cell.getAttribute('data-id'), 10))
    .filter(id => !isNaN(id))
    .sort((a, b) => a - b);
};

/**
 * Ids dos cards da disciplina criados depois do snapshot `lastIdBefore`, em ordem de criação.
 */
export const getCardIdsCreatedAfter = async (disciplineId, lastIdBefore) =>
  (await getDisciplineCardIds(disciplineId)).filter(id => id > lastIdBefore);

export const getLastCardId = async (disciplineId) => {
  const ids = await getDisciplineCardIds(disciplineId);
  return ids.length ? ids[ids.length - 1] : 0;
};

export default getDisciplineCardIds;
