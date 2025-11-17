const getQuestionId = async () => {
  const pageId = localStorage.getItem('pageId');

  const listQuestionsPage = await fetch(`https://estudecards.com.br/cms/disciplina_perguntas/called/${pageId}/1/historyBack/`);

  const listQuestionsPageHTML = await listQuestionsPage.text();

  const btnIncludeAnswers = $(listQuestionsPageHTML).find('tr[id="0"] .gz-link');

  const questionId = btnIncludeAnswers.attr('onclick').split('/')[3];

  return questionId;
};

export default getQuestionId;
