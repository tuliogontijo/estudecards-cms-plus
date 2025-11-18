import { pages } from '@constants';

const validateCSV = (data, page) => {

  const isQuestionPage = page === pages.QUESTIONS;

  let acceptedHeaders = {};
  const errors = [];

  const acceptedCardHeaders = {
    pergunta: { headers: ['pergunta', 'perguntas'], required: true },
    resposta: { headers: ['resposta', 'respostas'], required: true },
    comentario: { headers: ['comentário', 'comentários', 'comentario', 'comentarios'], required: true },
    assunto: { headers: ['assunto', 'assuntos'], required: true },
    status: { headers: ['status', 'statuss'], required: true },
  };

  const acceptedQuestionHeaders = {
    ...acceptedCardHeaders,
    fonte: { headers: ['fonte', 'fontes'], required: true },
    res1: { headers: ['resposta1', 'resposta 1', 'res1', 'res 1', 'alternativa1', 'alternativa 1', 'alt1', 'alt 1'], required: true },
    res2: { headers: ['resposta2', 'resposta 2', 'res2', 'res 2', 'alternativa2', 'alternativa 2', 'alt2', 'alt 2'], required: true },
    res3: { headers: ['resposta3', 'resposta 3', 'res3', 'res 3', 'alternativa3', 'alternativa 3', 'alt3', 'alt 3'], required: false },
    res4: { headers: ['resposta4', 'resposta 4', 'res4', 'res 4', 'alternativa4', 'alternativa 4', 'alt4', 'alt 4'], required: false },
    res5: { headers: ['resposta5', 'resposta 5', 'res5', 'res 5', 'alternativa5', 'alternativa 5', 'alt5', 'alt 5'], required: false },
    res6: { headers: ['resposta6', 'resposta 6', 'res6', 'res 6', 'alternativa6', 'alternativa 6', 'alt6', 'alt 6'], required: false },
    correta: { headers: ['correta', 'certa'], required: true },
  };


  delete acceptedQuestionHeaders.resposta;

  if (page === pages.CARDS) {

    data.forEach((row, index) => {
      Object.keys(row).forEach(header => {
        Object.keys(acceptedCardHeaders).forEach(acceptedHeader => {
          if (acceptedCardHeaders[acceptedHeader].headers.includes(header.toLowerCase())) {
            data[index][acceptedHeader] = data[index][header];
            delete data[index][header];
          }
        });
      });
    });

    acceptedHeaders = acceptedCardHeaders;

  } else if (isQuestionPage) {

    data.forEach((row, index) => {
      Object.keys(row).forEach(header => {
        Object.keys(acceptedQuestionHeaders).forEach(acceptedHeader => {
          if (acceptedQuestionHeaders[acceptedHeader].headers.includes(header.toLowerCase())) {
            data[index][acceptedHeader] = data[index][header];
            if (acceptedHeader !== header) {
              delete data[index][header];
            }
          }
        });
      });
    });

    acceptedHeaders = acceptedQuestionHeaders;
  }

  !data.length && errors.push('A planilha fornecida está vazia.');

  const missignCorrectAnswers = [];

  data.forEach((row, index) => {
    const sentHeaders = Object.keys(row);
    const expectedHeaders = Object.keys(acceptedHeaders);

    const misingKeys = [];
    expectedHeaders.forEach(expectedHeader => {
      if (!sentHeaders.includes(expectedHeader)) {
        if (acceptedHeaders[expectedHeader].required) {
          misingKeys.push(expectedHeader);
        }
      }
    });

    misingKeys.length && errors.push(`A planilha fornecida não possui todas as colunas esperadas. Faltam as seguintes colunas: ${misingKeys.join(', ').toUpperCase()}`);

    const extraKeys = [];
    sentHeaders.forEach(sentHeader => {
      if (!expectedHeaders.includes(sentHeader)) {
        extraKeys.push(sentHeader);
      }
    });

    extraKeys.length && errors.push(`A planilha fornecida possui colunas NÃO esperadas. As seguintes colunas NÃO são permitidas: ${extraKeys.join(', ').toUpperCase()}`);



    if (isQuestionPage && row['correta'] !== undefined) {

      const correctAnswer = row['correta'] ? row['correta'].toString() : '';

      if (!correctAnswer) {
        missignCorrectAnswers.push(index + 2);
      } else {
        const possibleAnswers = Object.keys(row).filter(key => key.toLowerCase().includes('res') && row[key]).map(key => key.replace(/res/i, ''));

        if (!possibleAnswers.includes(correctAnswer)) {
          errors.push(`Na linha ${index + 2}, a resposta correta informada (${correctAnswer}) não corresponde a nenhuma das respostas fornecidas: (${possibleAnswers.join(', ')}).`);
        }
      }
    }

  });

  missignCorrectAnswers.length && errors.push(`A planilha possui linhas sem valores na coluna "CORRETA". As linhas com erros são: (${missignCorrectAnswers.join(', ')})`);

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
