import normalizeText from './normalizeText';

/**
 * Índice nome normalizado -> itens com aquele nome. Permite detectar nomes que, depois de
 * normalizados, passam a coincidir (ex.: "Crase" e "Crase." cadastrados como assuntos distintos).
 */
const nameIndex = (items, getName) => {
  const index = new Map();
  items.forEach(item => {
    const key = normalizeText(getName(item));
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(item);
  });
  return index;
};

export default nameIndex;
