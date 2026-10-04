/**
 * Retorna os ids dos últimos `quantity` cards criados na disciplina, em ordem de criação.
 * O endpoint de criação do CMS não devolve o id, então ele é lido da listagem da disciplina.
 */
const getCreatedCardIds = async (disciplineId, quantity) => {
  const response = await fetch(`https://estudecards.com.br/cms/disciplina_cards/called/${disciplineId}/1/historyBack/0`, {
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`Não foi possível ler a lista de cards da disciplina (HTTP ${response.status}).`);
  }

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const ids = Array.from(doc.querySelectorAll('td.gz-posicao-cell[data-id]'))
    .map(cell => parseInt(cell.getAttribute('data-id'), 10))
    .filter(id => !isNaN(id))
    .sort((a, b) => b - a)
    .slice(0, quantity)
    .reverse();

  if (ids.length !== quantity) {
    throw new Error(`Esperava encontrar ${quantity} cards recém-criados, mas foram encontrados ${ids.length}.`);
  }

  return ids;
};

export default getCreatedCardIds;
