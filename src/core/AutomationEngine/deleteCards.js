/**
 * Exclui cards pelo mesmo endpoint do botão "Excluir" do CMS.
 * O CMS recebe os ids no formato "<gz>id1<gz>id2" e, ao final, renumera as posições da disciplina.
 */
const deleteCards = async (disciplineId, cardIds) => {
  const code = cardIds.map(id => `<gz>${id}`).join('');

  const formData = new FormData();
  formData.append('form', '');
  formData.append('base', disciplineId);

  const response = await fetch(`https://estudecards.com.br/ws/disciplina_cards/sys-delete/${encodeURIComponent(code)}`, {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
  });

  const result = response.ok ? await response.json() : null;

  if (result?.[0]?.message !== 'success') {
    throw new Error(result?.[0]?.message === 'permission'
      ? 'sem permissão para excluir cards'
      : `o servidor respondeu ${response.ok ? `"${result?.[0]?.message}"` : `HTTP ${response.status}`}`);
  }
};

export default deleteCards;
