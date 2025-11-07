import languageEncoding from 'detect-file-encoding-and-language';
import Papa from 'papaparse';

import adjustEncodingName from '@utils/adjustEncodingName';
import validateCSV from '@utils/validateCSV';

const csvProcessor = async (file, page) => {

  const { encoding: encodingDetected } = await languageEncoding(file);
  const encoding = adjustEncodingName(encodingDetected.toLowerCase());

  return new Promise((resolve, reject) => {

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      encoding,
      dynamicTyping: true,
      complete: results => {
        const { data } = results;
        const { isValid, errors } = validateCSV(data, page);

        resolve({ isValid, errors, data });
      },
      error: error => {
        reject({
          isValid: false,
          errors: [error.message || 'Erro ao processar CSV'],
          data: []
        });
      }
    });
  });
};

export default csvProcessor;
