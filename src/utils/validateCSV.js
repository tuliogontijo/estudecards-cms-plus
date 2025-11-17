import { pages } from '@constants';

const validateCSV = (data, page) => {

  let expectedKeys;
  const errors = [];

  if (page === pages.CARDS) {
    expectedKeys = ['pergunta', 'resposta', 'comentário', 'assunto', 'status'];
  } else if (page === pages.QUESTIONS) {
    expectedKeys = ['pergunta', 'fonte', 'comentário', 'assunto', 'status', 'res1', 'res2', 'res3', 'res4', 'res5', 'res6', 'correta']; //somente obrigatórias. TODO: Verificar 'Alt01', 'Alt02', 'correta'
  }

  !data.length && errors.push('A planilha CSV fornecida está vazia.');

  data.forEach(row => {
    const objKeys = Object.keys(row).map(key => key.toLowerCase());

    const misingKeys = [];
    const hasAllKeys = expectedKeys.every(expectedKey => {
      if (objKeys.includes(expectedKey.toLowerCase())) {
        return true;
      } else {
        misingKeys.push(expectedKey);
      }
    });

    !hasAllKeys && errors.push(`A planilha CSV fornecida não possui todas as colunas esperadas. Faltam as seguintes colunas: ${misingKeys.join(', ')}`);

    const extraKeys = [];
    const noExtraKeys = objKeys.every(objKey => {
      if(expectedKeys.map(k => k.toLowerCase()).includes(objKey)){
        return true;
      } else {
        extraKeys.push(objKey);
      }
    });

    !noExtraKeys && errors.push(`A planilha CSV fornecida possui colunas não esperadas. As seguintes colunas não são permitidas: ${extraKeys.join(', ')}`);

  });

  if (errors.length) {
    return {
      isValid: false,
      errors: Array.from(new Set(errors))
    };
  }

  return {
    isValid: true,
    errors: []
  };

};

export default validateCSV;
