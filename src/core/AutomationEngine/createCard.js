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

    if (response.ok) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: `o servidor respondeu HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }

};

export default createCard;
