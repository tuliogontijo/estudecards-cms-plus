/**
 * Normaliza um texto para comparação: remove acentos, colapsa espaços,
 * apara as pontas e converte para minúsculas.
 * Ex.: '  ORTOGRAFÍA   Premium ' -> 'ortografia premium'
 */
const normalizeText = (value) => (value ?? '')
  .toString()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

export default normalizeText;
