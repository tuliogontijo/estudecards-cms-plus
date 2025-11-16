import MarkdownParser from './markdownParser';

const parser = new MarkdownParser();

const formatter = (subjectId, statusId, data) => {
  const perguntaHtml = parser.parse(data.pergunta || '');
  const respostaHtml = parser.parse(data.resposta || '');
  const comentarioHtml = parser.parse(data.comentário || '');

  const formattedData = `<p>${perguntaHtml}</p><gz><p>${respostaHtml}</p><gz><p>${comentarioHtml}</p><gz>${subjectId}<gz>${statusId}<gz>null`;

  return formattedData;
};

export default formatter;
