import encodingCSVDetector from '@fn/encodingCSVDetector';
import Papa from 'papaparse';

const csvProcessor = async (file) => {

  const encoding = await encodingCSVDetector(file);

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
