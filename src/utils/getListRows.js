/**
 * Linhas de dados de uma listagem do CMS. Nas telas "called" toda linha de registro tem
 * onMouseOver="onFocus(...)" e a primeira célula (oculta) guarda o id.
 */
const getListRows = (doc) => Array.from(doc.querySelectorAll('tr[onmouseover]'))
  .map(tr => {
    const cells = tr.querySelectorAll('td');
    return { id: parseInt(cells[0]?.textContent.trim(), 10), cells };
  })
  .filter(row => !isNaN(row.id));

export const isSelected = (cell) => cell?.textContent.trim().toLowerCase() === 'selecionado';

export default getListRows;
