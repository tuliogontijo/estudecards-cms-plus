import MarkdownParser from './markdownParser';

const parser = new MarkdownParser();

const normalize = (value) => (value ?? '').toString().replace(/\r\n?/g, '\n').trim();

/**
 * Conteúdo a gravar a partir de uma célula do CSV de atualização.
 * Se a célula for igual ao conteúdo atual (como veio na exportação), devolve o conteúdo atual sem
 * passar pelo conversor de Markdown, para que campos não editados fiquem exatamente como estão.
 */
const csvContent = (cell, current) =>
  normalize(cell) === normalize(current) ? current : parser.parse(normalize(cell)).trim();

export default csvContent;
