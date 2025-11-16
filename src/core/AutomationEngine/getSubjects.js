import { handleCallErrorModal } from '@components/ModalError/handlers';

const getSubjects = async (disciplineId) => {

  const subjects = [];
  const formData = new FormData();
  formData.append('form', '');
  formData.append('base', disciplineId);

  try {
    const response = await fetch('https://estudecards.com.br/ws/disciplina_temas/sys-screen/1', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });

    const subjectPage = await response.text();
    $(subjectPage).find('tr[id]').each((i, el) => {
      const subjectId = $(el).find('td').eq(0).text();
      const subjectName = $(el).find('td').eq(1).text();
      subjects.push({ subjectId, subjectName });
    });

    if (subjects.length) {
      return subjects;
    } else {
      throw new Error('Nenhum assunto encontrado.');
    }
  } catch (error) {
    console.err(error);
    handleCallErrorModal();
  }

};

export default getSubjects;
