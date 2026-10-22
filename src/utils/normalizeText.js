/**
 * Normaliza um texto para comparar nomes (assuntos e status) de forma tolerante:
 * - ignora maiúsculas/minúsculas e acentos (Crase = crase = CRASE; Hífen = Hifen);
 * - trata como iguais variantes tipográficas comuns em textos gerados por IA ou pelo Word:
 *   aspas curvas, travessões/hifens especiais, espaço não separável, caracteres invisíveis
 *   e caracteres de compatibilidade (ligaduras, º, letras de largura total);
 * - ignora espaços extras, inclusive ao redor de hífen e barra ("Orações - adjetivas" = "Orações-adjetivas");
 * - ignora pontuação final (. … , ; :), como o ponto final que agentes de IA costumam colocar.
 * Ex.: ' “Haver”  IMPESSOAL. ' -> '"haver" impessoal'
 */
const normalizeText = (value) => (value ?? '')
  .toString()
  .replace(/[\u2018\u2019\u201A\u201B\u2032\u00B4`]/g, '\'')
  .replace(/[\u201C\u201D\u201E\u201F\u2033\u00AB\u00BB]/g, '"')
  .replace(/[\u2010-\u2015\u2212\u2043\uFE58\uFE63\uFF0D]/g, '-')
  .replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, '')
  .normalize('NFKD')
  .replace(/\p{M}/gu, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([-/])\s*/g, '$1')
  .trim()
  .replace(/[\s.\u2026,;:]+$/u, '')
  .toLowerCase();

export default normalizeText;
