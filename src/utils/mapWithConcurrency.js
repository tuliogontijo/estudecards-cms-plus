/**
 * Executa `fn` sobre todos os itens com no máximo `limit` chamadas simultâneas, preservando a ordem.
 */
const mapWithConcurrency = async (items, limit, fn) => {
  const results = new Array(items.length);
  let next = 0;

  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

export default mapWithConcurrency;
