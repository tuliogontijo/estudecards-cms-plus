import languageEncoding from 'detect-file-encoding-and-language';
import Papa from 'papaparse';

import adjustEncodingName from '@utils/adjustEncodingName';

const csvProcessor = async (file) => {

  const { encoding: encodingDetected } = await languageEncoding(file);
  const encoding = adjustEncodingName(encodingDetected.toLowerCase());

  Papa.parse(file, {
    header: true,
    skipEmptyLines: 'greedy',
    encoding,
    dynamicTyping: true,
    complete: (results) => {
      localStorage.setItem('csvData', JSON.stringify(results.data));
    }
  });

};



export default csvProcessor;
