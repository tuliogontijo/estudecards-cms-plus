import Papa from 'papaparse';

const SELECTED_TEXT = 'selecionado';

/**
 * Lê a listagem completa da disciplina (sem filtro de busca) e devolve os cards marcados como "Selecionado".
 * A listagem é buscada de novo porque o DOM da página tem os textos truncados para exibição.
 */
const getSelectedCards = async (disciplineId) => {
  const response = await fetch(`https://estudecards.com.br/cms/disciplina_cards/called/${disciplineId}/1/historyBack/0`, {
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`Não foi possível ler a lista de cards da disciplina (HTTP ${response.status}).`);
  }

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  return Array.from(doc.querySelectorAll('td.gz-posicao-cell[data-id]'))
    .map(positionCell => {
      const cells = positionCell.closest('tr').querySelectorAll('td');
      return {
        id: parseInt(positionCell.getAttribute('data-id'), 10),
        posicao: parseInt(positionCell.getAttribute('data-posicao'), 10) || 0,
        assunto: cells[2].textContent.trim(),
        pergunta: cells[3].innerHTML.trim(),
        resposta: cells[4].innerHTML.trim(),
        comentario: cells[5].innerHTML.trim(),
        status: cells[6].textContent.trim(),
        selecionado: cells[7].textContent.trim().toLowerCase() === SELECTED_TEXT,
      };
    })
    .filter(card => card.selecionado);
};

const sortByPosition = (a, b) => {
  const positionA = a.posicao || Infinity;
  const positionB = b.posicao || Infinity;
  return positionA !== positionB ? positionA - positionB : a.id - b.id;
};

const downloadCSV = (csv, fileName) => {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta os cards selecionados no mesmo layout do CSV de importação (separador ";", UTF-8 com BOM),
 * para que o arquivo possa ser reimportado pela própria extensão.
 */
const exportCards = async (disciplineId) => {
  const cards = await getSelectedCards(disciplineId);

  if (!cards.length) {
    throw new Error('Nenhum card selecionado. Marque os cards na coluna "Seleção" (ou use "Selecionar tudo") e tente novamente.');
  }

  const csv = Papa.unparse({
    fields: ['Pergunta', 'Resposta', 'Comentario', 'Assunto', 'Status', 'Posição'],
    data: cards.sort(sortByPosition).map(card => [
      card.pergunta,
      card.resposta,
      card.comentario,
      card.assunto,
      card.status,
      card.posicao || '',
    ]),
  }, { delimiter: ';' });

  const date = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `cards_disciplina_${disciplineId}_${date}.csv`);

  return cards.length;
};

export default exportCards;
