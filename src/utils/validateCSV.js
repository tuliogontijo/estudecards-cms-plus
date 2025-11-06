import { pages } from '@constants';

const validateCSV = (data, page) => {

  let expectedKeys;
  const errors = [];

  if (page === pages.CARDS) {
    expectedKeys = ['pergunta', 'resposta', 'comentário', 'assunto', 'status'];
  } else if (page === pages.QUESTIONS) {
    expectedKeys = ['pergunta', 'fonte', 'comentário', 'assunto', 'status']; //somente obrigatórias. Verificar 'Alt01', 'Alt02', 'correta'
  }

  !data.length && errors.push('A planilha CSV fornecida está vazia.');

  data.every(row => {
    const objKeys = Object.keys(row).map(key => key.toLowerCase());

    const hasAllKeys = expectedKeys.every(expectedKey => objKeys.includes(expectedKey.toLowerCase()));
    !hasAllKeys && errors.push(`A planilha CSV fornecida não possui todas as colunas esperadas. São elas: ${expectedKeys.join(', ')}`);

    const noExtraKeys = objKeys.every(objKey => expectedKeys.map(k => k.toLowerCase()).includes(objKey));
    !noExtraKeys && errors.push(`A planilha CSV fornecida possui colunas não esperadas. Somente são permitidas estas: ${expectedKeys.join(', ')}`);

  });

  if (errors.length) {
    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    errors: []
  };

};

export default validateCSV;
