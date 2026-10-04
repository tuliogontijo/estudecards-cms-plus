import normalizeText from '@utils/normalizeText';

const MAX_LINES_LISTED = 10;

const formatLines = (lines) => {
  const listed = lines.slice(0, MAX_LINES_LISTED).join(', ');
  const remaining = lines.length - MAX_LINES_LISTED;
  return remaining > 0 ? `${listed} e mais ${remaining}` : listed;
};

const trackMissing = (missing, value, line) => {
  const key = normalizeText(value);
  if (!missing.has(key)) {
    missing.set(key, { label: value?.toString().trim() || '(vazio)', lines: [] });
  }
  missing.get(key).lines.push(line);
};

const describeMissing = (missing) => [...missing.values()]
  .map(({ label, lines }) => `- "${label}" (linha${lines.length > 1 ? 's' : ''} ${formatLines(lines)})`)
  .join('\n');

/**
 * Associa cada linha do CSV ao id do assunto e ao id do status, ANTES de criar qualquer registro.
 * A comparação ignora acentos, caixa e espaços extras.
 * As linhas são numeradas como na planilha (cabeçalho = linha 1).
 */
const resolveReferences = (csvData, subjects, statusList) => {
  const subjectsByName = new Map();
  subjects.forEach(({ subjectId, subjectName }) => {
    const key = normalizeText(subjectName);
    if (!subjectsByName.has(key)) {
      subjectsByName.set(key, subjectId);
    }
  });

  const statusByName = new Map(statusList.map(({ statusId, statusName }) => [normalizeText(statusName), statusId]));

  const missingSubjects = new Map();
  const missingStatus = new Map();

  const rows = csvData.map((row, index) => {
    const line = index + 2;
    const subjectId = subjectsByName.get(normalizeText(row.assunto));
    const statusId = statusByName.get(normalizeText(row.status));

    if (subjectId === undefined) {
      trackMissing(missingSubjects, row.assunto, line);
    }
    if (statusId === undefined) {
      trackMissing(missingStatus, row.status, line);
    }

    return { row, subjectId, statusId };
  });

  const errors = [];

  if (missingSubjects.size) {
    errors.push(
      `Assunto(s) do CSV que não existem nesta disciplina:\n${describeMissing(missingSubjects)}\n` +
      `Assuntos cadastrados: ${subjects.map(({ subjectName }) => subjectName).join(', ')}`
    );
  }

  if (missingStatus.size) {
    errors.push(
      `Status inválido(s) no CSV:\n${describeMissing(missingStatus)}\n` +
      `Valores aceitos: ${statusList.map(({ statusName }) => statusName).join(', ')}`
    );
  }

  return { rows, errors };
};

export default resolveReferences;
