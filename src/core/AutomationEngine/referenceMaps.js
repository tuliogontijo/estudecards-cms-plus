import normalizeText from '@utils/normalizeText';

/**
 * Conversores nome -> id de assunto e de status, com a mesma comparação usada na importação
 * (ignora acentos, caixa e espaços extras).
 */
const referenceMaps = (subjects, statusList) => {
  const subjectsByName = new Map();
  subjects.forEach(({ subjectId, subjectName }) => {
    const key = normalizeText(subjectName);
    !subjectsByName.has(key) && subjectsByName.set(key, subjectId);
  });

  const statusByName = new Map(statusList.map(({ statusId, statusName }) => [normalizeText(statusName), statusId]));

  const resolve = (map, kind) => (name) => {
    const id = map.get(normalizeText(name));
    if (id === undefined) throw new Error(`${kind} "${name}" não encontrado`);
    return id;
  };

  return {
    subjectId: resolve(subjectsByName, 'assunto'),
    statusId: resolve(statusByName, 'status'),
    sameName: (a, b) => normalizeText(a) === normalizeText(b),
  };
};

export default referenceMaps;
