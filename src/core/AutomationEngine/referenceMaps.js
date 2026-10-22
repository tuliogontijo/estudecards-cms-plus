import nameIndex from '@utils/nameIndex';
import normalizeText from '@utils/normalizeText';

/**
 * Conversores nome -> id de assunto e de status, com a mesma comparação usada na importação
 * (`normalizeText`). Usados para restaurar registros a partir dos nomes lidos do CMS, por isso
 * o nome exato tem prioridade e um nome que corresponda a mais de um assunto é recusado.
 */
const referenceMaps = (subjects, statusList) => {
  const subjectsByExactName = new Map(subjects.map(({ subjectId, subjectName }) => [subjectName.trim(), subjectId]));
  const subjectsByName = nameIndex(subjects, ({ subjectName }) => subjectName);
  const statusByName = new Map(statusList.map(({ statusId, statusName }) => [normalizeText(statusName), statusId]));

  const subjectId = (name) => {
    const exact = subjectsByExactName.get((name ?? '').toString().trim());
    if (exact !== undefined) return exact;

    const candidates = subjectsByName.get(normalizeText(name)) || [];
    if (candidates.length === 1) return candidates[0].subjectId;

    throw new Error(candidates.length ? `assunto "${name}" corresponde a mais de um assunto cadastrado` : `assunto "${name}" não encontrado`);
  };

  const statusId = (name) => {
    const id = statusByName.get(normalizeText(name));
    if (id === undefined) throw new Error(`status "${name}" não encontrado`);
    return id;
  };

  return {
    subjectId,
    statusId,
    sameName: (a, b) => normalizeText(a) === normalizeText(b),
  };
};

export default referenceMaps;
