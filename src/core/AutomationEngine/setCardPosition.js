const setCardPosition = async (disciplineId, cardId, position) => {

  const formData = new FormData();
  formData.append('form', position);
  formData.append('base', disciplineId);

  try {
    const response = await fetch(`https://estudecards.com.br/ws/disciplina_cards/posicao/${cardId}`, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });

    const result = response.ok ? await response.json() : null;

    if (result?.[0]?.message === 'success') {
      return { success: true };
    }

    return {
      success: false,
      error: result?.[0]?.message === 'permission'
        ? 'Você não tem permissão para alterar a posição dos cards.'
        : `Não foi possível salvar a posição ${position} do card ${cardId}.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }

};

export default setCardPosition;
