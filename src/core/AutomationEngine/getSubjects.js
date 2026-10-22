// O endpoint "screen" do CMS devolve os assuntos em páginas de 5 (LIMIT 5 no controller Disciplina_temas).
const PAGE_SIZE = 5;
// Trava de segurança contra laço infinito caso o endpoint mude de comportamento (até 5.000 assuntos).
const MAX_PAGES = 1000;

const fetchSubjectsPage = async (disciplineId, page) => {
  const formData = new FormData();
  formData.append('form', '');
  formData.append('base', disciplineId);

  const response = await fetch(`https://estudecards.com.br/ws/disciplina_temas/sys-screen/${page}`, {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`Não foi possível carregar os assuntos da disciplina (HTTP ${response.status}).`);
  }

  const doc = new DOMParser().parseFromString(await response.text(), 'text/html');

  return Array.from(doc.querySelectorAll('tr[id]')).map(row => {
    const cells = row.querySelectorAll('td');
    return {
      subjectId: cells[0]?.textContent.trim(),
      subjectName: cells[1]?.textContent.trim()
    };
  }).filter(({ subjectId }) => subjectId);
};

/**
 * Todos os assuntos da disciplina, percorrendo as páginas do endpoint até a última.
 */
const getSubjects = async (disciplineId) => {
  const subjects = [];
  const seenIds = new Set();

  for (let page = 1; page <= MAX_PAGES; page++) {
    const pageSubjects = await fetchSubjectsPage(disciplineId, page);
    const newSubjects = pageSubjects.filter(({ subjectId }) => !seenIds.has(subjectId));

    newSubjects.forEach(subject => {
      seenIds.add(subject.subjectId);
      subjects.push(subject);
    });

    if (pageSubjects.length < PAGE_SIZE || !newSubjects.length) break;
  }

  if (!subjects.length) {
    throw new Error('Esta disciplina não possui assuntos cadastrados. Cadastre os assuntos antes de importar o CSV.');
  }

  return subjects;

};

export default getSubjects;
