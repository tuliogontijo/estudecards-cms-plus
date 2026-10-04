/**
 * Busca uma página do CMS e devolve o documento parseado (sem executar scripts nem carregar imagens).
 */
const fetchDocument = async (url, errorMessage) => {
  const response = await fetch(url, { credentials: 'same-origin' });

  if (!response.ok) {
    throw new Error(`${errorMessage} (HTTP ${response.status}).`);
  }

  return new DOMParser().parseFromString(await response.text(), 'text/html');
};

export default fetchDocument;
