export const pages = {
  CARDS: 'Cards',
  QUESTIONS: 'Perguntas',
  EDIT: 'Editar',
};


const BASE_URL = 'https://estudecards.com.br';

/**
 * Telas do CMS usadas por cada página da extensão.
 */
export const records = {
  [pages.CARDS]: { screen: 'disciplina_cards', label: 'card(s)' },
  [pages.QUESTIONS]: { screen: 'disciplina_perguntas', label: 'pergunta(s)' },
};

export const listUrl = (screen, baseId) => `${BASE_URL}/cms/${screen}/called/${baseId}/1/historyBack/0`;

export const updateUrl = (screen, baseId, recordId) => `${BASE_URL}/cms/${screen}/called/${baseId}/update/${recordId}/1/historyBack/0`;

export const deleteUrl = (screen, code) => `${BASE_URL}/ws/${screen}/sys-delete/${encodeURIComponent(code)}`;
