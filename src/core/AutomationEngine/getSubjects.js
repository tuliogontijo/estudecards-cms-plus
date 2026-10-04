const getSubjects = async (disciplineId) => {

  const subjects = [];
  const formData = new FormData();
  formData.append('form', '');
  formData.append('base', disciplineId);

  const response = await fetch('https://estudecards.com.br/ws/disciplina_temas/sys-screen/1', {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`Não foi possível carregar os assuntos da disciplina (HTTP ${response.status}).`);
  }

  const subjectPage = await response.text();
  $(subjectPage).find('tr[id]').each((i, el) => {
    const cells = $(el).find('td');
    subjects.push({
      subjectId: cells.eq(0).text().trim(),
      subjectName: cells.eq(1).text().trim()
    });
  });

  if (!subjects.length) {
    throw new Error('Esta disciplina não possui assuntos cadastrados. Cadastre os assuntos antes de importar o CSV.');
  }

  return subjects;

};

export default getSubjects;
