import getCreatedCardIds from './getCreatedCardIds';
import setCardPosition from './setCardPosition';

/**
 * Aplica a coluna "Posição" aos cards recém-criados.
 * As posições são enviadas em ordem crescente: o CMS desloca os cards com posição >= à informada,
 * então inserir do menor para o maior preserva exatamente a ordem definida no CSV.
 */
const applyPositions = async (disciplineId, createdRows) => {
  const hasPositions = createdRows.some(row => parseInt(row.posicao, 10) > 0);
  if (!hasPositions) return { success: true };

  try {
    const ids = await getCreatedCardIds(disciplineId, createdRows.length);

    const positionedCards = createdRows
      .map((row, i) => ({ cardId: ids[i], position: parseInt(row.posicao, 10) || 0 }))
      .filter(card => card.position > 0)
      .sort((a, b) => a.position - b.position);

    for (const { cardId, position } of positionedCards) {
      const result = await setCardPosition(disciplineId, cardId, position);
      if (!result.success) return result;
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Os cards foram criados, mas houve falha ao aplicar as posições: ${error.message}`,
    };
  }
};

export default applyPositions;
