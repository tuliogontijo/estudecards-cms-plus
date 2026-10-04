import setCardPosition from './setCardPosition';

/**
 * Aplica a coluna "Posição" aos cards recém-criados (`cardIds` na mesma ordem de `createdRows`).
 * As posições são enviadas em ordem crescente: o CMS desloca os cards com posição >= à informada,
 * então inserir do menor para o maior preserva exatamente a ordem definida no CSV.
 */
const applyPositions = async (disciplineId, createdRows, cardIds) => {
  const positionedCards = createdRows
    .map((row, i) => ({ cardId: cardIds[i], position: parseInt(row.posicao, 10) || 0 }))
    .filter(card => card.position > 0)
    .sort((a, b) => a.position - b.position);

  for (const { cardId, position } of positionedCards) {
    const { success, error } = await setCardPosition(disciplineId, cardId, position);

    if (!success) {
      throw new Error(`Falha ao aplicar as posições: ${error}`);
    }
  }
};

export default applyPositions;
