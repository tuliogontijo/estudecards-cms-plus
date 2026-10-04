import deleteCards from './deleteCards';
import { getCardIdsCreatedAfter } from './getDisciplineCardIds';

/**
 * Desfaz uma importação de cards: exclui todos os cards da disciplina com id maior que `lastIdBefore`
 * (o maior id existente antes da importação) e confere que nenhum ficou para trás.
 * Se houver mais cards novos do que cadastros tentados (`attempts`), alguém criou cards na disciplina
 * durante a importação; nesse caso nada é excluído, para não apagar cards de outra pessoa.
 * Retorna a mensagem que descreve o resultado, para ser anexada ao erro original.
 */
const rollbackCards = async (disciplineId, lastIdBefore, attempts) => {
  let createdIds = [];

  try {
    createdIds = await getCardIdsCreatedAfter(disciplineId, lastIdBefore);

    if (!createdIds.length) {
      return 'Nenhum card foi criado nesta importação.';
    }

    if (createdIds.length > attempts) {
      throw new Error(`foram encontrados ${createdIds.length} cards novos para ${attempts} cadastro(s) tentado(s), possivelmente criados por outra pessoa`);
    }

    await deleteCards(disciplineId, createdIds);

    const remainingIds = await getCardIdsCreatedAfter(disciplineId, lastIdBefore);

    if (remainingIds.length) {
      throw new Error(`os cards ${remainingIds.join(', ')} continuam cadastrados`);
    }

    return `A importação foi desfeita: os ${createdIds.length} card(s) criados foram excluídos e as posições da disciplina voltaram ao estado anterior.`;
  } catch (error) {
    return 'ATENÇÃO: não foi possível desfazer a importação automaticamente ' +
      `(${error.message}). Confira e exclua manualmente os cards desta importação (id maior que ${lastIdBefore}` +
      `${createdIds.length ? `: ${createdIds.join(', ')}` : ''}) antes de importar o CSV novamente.`;
  }
};

export default rollbackCards;
