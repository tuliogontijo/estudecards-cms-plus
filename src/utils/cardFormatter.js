import MarkdownParser from './markdownParser';

const parser = new MarkdownParser();

const cardFormatter = (subjectId, statusId, data) => {
  const perguntaHtml = parser.parse(data.pergunta || '');
  const respostaHtml = parser.parse(data.resposta || '');
  const comentarioHtml = parser.parse(data.comentario || '');

  const formattedData = `${perguntaHtml}<gz>${respostaHtml}<gz>${comentarioHtml}<gz>${subjectId}<gz>${statusId}<gz>null`;

  return formattedData;
};

export default cardFormatter;
