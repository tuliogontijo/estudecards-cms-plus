const createCard = async (subjectId, statusId, disciplineId, data) => {

  const formData = new FormData();
  formData.append('form', `<p>${data.pergunta}</p><gz><p>${data.resposta}</p><gz><p>${data.comentário}</p><gz>${subjectId}<gz>${statusId}<gz>null`);
  formData.append('base', disciplineId);

  try {
    const response = await fetch('https://estudecards.com.br/ws/disciplina_cards/sys-create', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    // const response = { ok: true };
    if (response.ok) {
      // console.log('card created', data.pergunta);
      return {
        success: true,
      };
    }
  } catch (error) {
    return {
      success: true,
      error: error.message,
    };
  }

};

export default createCard;
