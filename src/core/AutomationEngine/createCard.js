import cardFormatter from '@utils/cardFormatter';

const createCard = async (subjectId, statusId, disciplineId, data) => {

  const formattedData = cardFormatter(subjectId, statusId, data);

  const formData = new FormData();
  formData.append('form', formattedData);
  formData.append('base', disciplineId);

  try {
    const response = await fetch('https://estudecards.com.br/ws/disciplina_cards/sys-create', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    //const response = { ok: true };
    if (response.ok) {
      //console.log('card created', data.pergunta);
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
