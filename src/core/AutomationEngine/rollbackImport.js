import deleteRecords from './deleteRecords';
import { getRecordIdsCreatedAfter } from './getRecordIds';

/**
 * Desfaz uma importação: exclui todos os registros da disciplina com id maior que `lastIdBefore`
 * (o maior id existente antes da importação) e confere que nenhum ficou para trás.
 * Se houver mais registros novos do que cadastros tentados (`attempts`), alguém criou registros na
 * disciplina durante a importação; nesse caso nada é excluído, para não apagar registros de outra pessoa.
 * Retorna a mensagem que descreve o resultado, para ser anexada ao erro original.
 */
const rollbackImport = async ({ screen, label }, disciplineId, lastIdBefore, attempts) => {
  let createdIds = [];

  try {
    createdIds = await getRecordIdsCreatedAfter(screen, disciplineId, lastIdBefore);

    if (!createdIds.length) {
      return 'Nenhum registro foi criado nesta importação.';
    }

    if (createdIds.length > attempts) {
      throw new Error(`foram encontrados ${createdIds.length} registros novos para ${attempts} cadastro(s) tentado(s), possivelmente criados por outra pessoa`);
    }

    await deleteRecords(screen, disciplineId, createdIds);

    const remainingIds = await getRecordIdsCreatedAfter(screen, disciplineId, lastIdBefore);

    if (remainingIds.length) {
      throw new Error(`os registros ${remainingIds.join(', ')} continuam cadastrados`);
    }

    return `A importação foi desfeita: os registros criados (${createdIds.length} ${label}) foram excluídos e a disciplina voltou ao estado anterior.`;
  } catch (error) {
    return 'ATENÇÃO: não foi possível desfazer a importação automaticamente ' +
      `(${error.message}). Confira e exclua manualmente os registros desta importação (id maior que ${lastIdBefore}` +
      `${createdIds.length ? `: ${createdIds.join(', ')}` : ''}) antes de importar o CSV novamente.`;
  }
};

export default rollbackImport;
