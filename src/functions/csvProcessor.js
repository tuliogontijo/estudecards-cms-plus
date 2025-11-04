import Papa from 'papaparse';

const csvProcessor = (file) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: 'greedy',
    encoding: 'utf-8',
    dynamicTyping: true,
    complete: (results) => {
      localStorage.setItem('csvData', JSON.stringify(results.data));
    }
  });

};



export default csvProcessor;
