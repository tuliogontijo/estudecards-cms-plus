import MarkdownParser from './markdownParser';

const parser = new MarkdownParser();

const QAformatter = (subjectId, statusId, data) => {

  const perguntaHtml = parser.parse(data.pergunta || '');
  const fonteHtml = parser.parse(data.fonte || '');
  const comentarioHtml = parser.parse(data.comentário || '');

  const questionFormattedData = `${perguntaHtml}<gz>${fonteHtml}<gz>${comentarioHtml}<gz>${subjectId}<gz>${statusId}`;

  const answersFormattedData = [];

  Object.keys(data).forEach(key => {
    if (data[key] && key.toLowerCase().includes('res')) {
      const answerFormatted = parser.parse(data[key] || '');
      let correct = false;
      if (data.correta && key.includes(data.correta)) {
        correct = true;
      }
      const answerFormattedData = `${answerFormatted}<gz>${correct ? '1' : '2'}<gz>1`;
      answersFormattedData.push(answerFormattedData);
    }
  });

  return {
    questionFormattedData,
    answersFormattedData
  };
};

export default QAformatter;
