import btnImg from '@img/btn-download.svg';

import { pages } from '@constants';

import exportCards from '@core/exportCards';
import exportQuestions from '@core/exportQuestions';

import { handleCallErrorModal } from '@components/ModalError/handlers';

const ButtonDownloadSelected = (page) => {
  const isCardsPage = page === pages.CARDS;
  const exportRecords = isCardsPage ? exportCards : exportQuestions;

  $('#button-create-bulk').after(`
    <div id="button-download-selected" class="gz-button dv-f-l dv-mt-mdpi dv-mr-mdpi dv-mb-mdpi dv-ml-hdpi btn-container">
      <a href="#" class="gz-tooltip btn-img-container" onclick="return false;">
        ${btnImg}
        <span class="gz-span-bottom-right gz-dark-blue-grey">
          Baixar ${page.toLowerCase()} selecionad${isCardsPage ? 'o' : 'a'}s (CSV)
        </span>
      </a>
    </div>
    `);

  const button = $('#button-download-selected');

  button.on('click', async () => {
    if (button.hasClass('btn-loading')) return;
    button.addClass('btn-loading');

    try {
      const { warnings } = await exportRecords(localStorage.getItem('pageId'));

      if (warnings.length) {
        alert(`Download concluído, mas o arquivo precisa de ajustes antes de ser reimportado:\n\n${warnings.join('\n')}`);
      }
    } catch (error) {
      handleCallErrorModal(error.message);
    } finally {
      button.removeClass('btn-loading');
    }
  });

};

export default ButtonDownloadSelected;
