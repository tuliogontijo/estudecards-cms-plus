import { deleteUrl } from '@constants';

/**
 * Exclui registros pelo mesmo endpoint do botão "Excluir" do CMS.
 * O CMS recebe os ids no formato "<gz>id1<gz>id2". Para cards ele renumera as posições da disciplina;
 * para perguntas ele exclui também as respostas de cada pergunta.
 */
const deleteRecords = async (screen, disciplineId, ids) => {
  const code = ids.map(id => `<gz>${id}`).join('');

  const formData = new FormData();
  formData.append('form', '');
  formData.append('base', disciplineId);

  const response = await fetch(deleteUrl(screen, code), {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
  });

  const result = response.ok ? await response.json() : null;

  if (result?.[0]?.message !== 'success') {
    throw new Error(result?.[0]?.message === 'permission'
      ? 'sem permissão para excluir registros'
      : `o servidor respondeu ${response.ok ? `"${result?.[0]?.message}"` : `HTTP ${response.status}`}`);
  }
};

export default deleteRecords;
