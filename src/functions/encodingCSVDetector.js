import adjustEncodingName from '@utils/adjustEncodingName';
import languageEncoding from 'detect-file-encoding-and-language';


const encodingCSVDetector = async (file) => {

  const { encoding } = await languageEncoding(file);

  return adjustEncodingName(encoding.toLowerCase());

};

export default encodingCSVDetector;
