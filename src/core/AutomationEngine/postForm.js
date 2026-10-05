const BASE_URL = 'https://estudecards.com.br';

/**
 * POST no padrão dos webservices do CMS (campos "form" e "base"), exigindo a resposta [{"message":"success"}].
 */
const postForm = async (path, form, base) => {
  const formData = new FormData();
  formData.append('form', form);
  formData.append('base', base);

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
  });

  let message;
  try {
    message = (await response.json())?.[0]?.message;
  } catch {
    message = undefined;
  }

  if (message !== 'success') {
    throw new Error(message === 'permission'
      ? 'sem permissão para esta operação no CMS'
      : `o servidor respondeu ${message ? `"${message}"` : `HTTP ${response.status}`}`);
  }
};

export default postForm;
