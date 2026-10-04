import { listUrl } from '@constants';

import fetchDocument from '@utils/fetchDocument';
import getListRows from '@utils/getListRows';

/**
 * Retorna os ids de todos os registros (cards ou perguntas) da disciplina, em ordem crescente.
 * Os endpoints de criação do CMS não devolvem o id, então ele é lido da listagem da disciplina.
 */
const getRecordIds = async (screen, disciplineId) => {
  const doc = await fetchDocument(listUrl(screen, disciplineId), 'Não foi possível ler a lista de registros da disciplina');
  return getListRows(doc).map(({ id }) => id).sort((a, b) => a - b);
};

/**
 * Ids dos registros da disciplina criados depois do snapshot `lastIdBefore`, em ordem de criação.
 */
export const getRecordIdsCreatedAfter = async (screen, disciplineId, lastIdBefore) =>
  (await getRecordIds(screen, disciplineId)).filter(id => id > lastIdBefore);

export const getLastRecordId = async (screen, disciplineId) => {
  const ids = await getRecordIds(screen, disciplineId);
  return ids.length ? ids[ids.length - 1] : 0;
};

export default getRecordIds;
