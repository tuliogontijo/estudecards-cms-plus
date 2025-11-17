import QAformatter from '@utils/QAformatter';

import createAnswer from './createAnswer';
import getQuestionId from './getQuestionId';

const createQuestion = async (subjectId, statusId, disciplineId, data) => {

  const { questionFormattedData, answersFormattedData } = QAformatter(subjectId, statusId, data);

  const formData = new FormData();
  formData.append('form', questionFormattedData);
  formData.append('base', disciplineId);

  try {
    const response = await fetch('https://estudecards.com.br/ws/disciplina_perguntas/sys-create', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    if (response.ok) {

      const questionId = await getQuestionId();

      answersFormattedData.forEach(async answer => await createAnswer(answer, questionId));

      return {
        success: true,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }

};

export default createQuestion;
