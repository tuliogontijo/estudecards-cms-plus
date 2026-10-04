import Papa from 'papaparse';

/**
 * Gera e baixa um CSV no layout de importação da extensão (separador ";", UTF-8 com BOM para o Excel).
 */
const downloadCSV = (fields, data, fileName) => {
  const csv = Papa.unparse({ fields, data }, { delimiter: ';' });
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

export const fileDate = () => new Date().toISOString().slice(0, 10);

export default downloadCSV;
