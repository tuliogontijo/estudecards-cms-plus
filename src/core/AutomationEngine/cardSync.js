import readCards from '@core/readers/cards';

import csvContent from '@utils/csvContent';

import { setPosition, updateCard } from './updateRecords';

/**
 * Atualização de cards existentes (linhas do CSV com ID) e aplicação da coluna Posição,
 * guardando o estado anterior para desfazer tudo em caso de erro.
 */
const cardSync = ({ disciplineId, refs }) => {
  const snapshots = new Map();
  const contentUpdated = [];
  let reorder = [];
  let positionsTouched = false;

  const restoreFields = (card) => ({
    pergunta: card.pergunta,
    resposta: card.resposta,
    comentario: card.comentario,
    subjectId: refs.subjectId(card.assunto),
    statusId: refs.statusId(card.status),
    posicao: card.posicao,
  });

  return {
    /** Carrega o estado atual da disciplina e devolve os ids que não pertencem a ela. */
    async load(ids) {
      (await readCards(disciplineId)).forEach(card => snapshots.set(card.id, card));
      return ids.filter(id => !snapshots.has(id));
    },

    /** Atualiza o card se algo mudou. A posição é tratada depois, em `applyPositions`. */
    async update(id, { row, subjectId, statusId }) {
      const current = snapshots.get(id);
      const fields = {
        pergunta: csvContent(row.pergunta, current.pergunta),
        resposta: csvContent(row.resposta, current.resposta),
        comentario: csvContent(row.comentario, current.comentario),
      };

      const changed = Object.keys(fields).some(key => fields[key] !== current[key]) ||
        !refs.sameName(row.assunto, current.assunto) || !refs.sameName(row.status, current.status);

      if (!changed) return false;

      contentUpdated.push(current);
      await updateCard(disciplineId, id, { ...fields, subjectId, statusId, posicao: current.posicao });
      return true;
    },

    /**
     * Leva os cards do CSV às posições pedidas. Os cards cuja posição muda saem da ordenação (posição 0)
     * e são reinseridos em ordem crescente: o CMS desloca os cards com posição >= à informada, então
     * inserir do menor para o maior deixa cada card exatamente na posição definida no CSV.
     * Sem a coluna Posição, cards atualizados mantêm a posição atual.
     */
    async applyPositions(entries) {
      reorder = entries
        .map(({ id, row, isNew }) => {
          const current = isNew ? 0 : snapshots.get(id).posicao;
          const desired = row.posicao === undefined ? current : parseInt(row.posicao, 10) || 0;
          return { id, isNew, current, desired };
        })
        .filter(entry => entry.desired !== entry.current);

      if (!reorder.length) return;
      positionsTouched = true;

      for (const { id } of reorder.filter(entry => entry.current > 0)) {
        await setPosition(disciplineId, id, 0);
      }

      for (const { id, desired } of reorder.filter(entry => entry.desired > 0).sort((a, b) => a.desired - b.desired)) {
        await setPosition(disciplineId, id, desired);
      }
    },

    /**
     * Desfaz posições e conteúdos alterados. `deleteCreated` exclui os cards novos e é chamado entre a
     * retirada e a reinserção das posições, para que a ordem original seja reconstruída exatamente.
     */
    async rollback(deleteCreated) {
      const failures = [];
      const attempt = async (id, fn) => {
        try {
          await fn();
        } catch (error) {
          failures.push(`card ${id}: ${error.message}`);
        }
      };

      const movedExisting = reorder.filter(entry => !entry.isNew);

      if (positionsTouched) {
        for (const { id } of movedExisting) {
          await attempt(id, () => setPosition(disciplineId, id, 0));
        }
      }

      const deleteMessage = await deleteCreated();

      if (positionsTouched) {
        for (const { id, current } of movedExisting.filter(entry => entry.current > 0).sort((a, b) => a.current - b.current)) {
          await attempt(id, () => setPosition(disciplineId, id, current));
        }
      }

      for (const card of contentUpdated) {
        await attempt(card.id, () => updateCard(disciplineId, card.id, restoreFields(card)));
      }

      return { deleteMessage, restored: contentUpdated.length, failures };
    },
  };
};

export default cardSync;
