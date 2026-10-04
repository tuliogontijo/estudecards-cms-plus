const createAnswer = async (data, questionId) => {

  const formData = new FormData();
  formData.append('form', data);
  formData.append('base', questionId);

  try {
    const response = await fetch('https://estudecards.com.br/ws/disciplina_pergunta_respostas/sys-create', {
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
      error: `o servidor respondeu HTTP ${response.status} ao criar uma resposta`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }

};

export default createAnswer;
