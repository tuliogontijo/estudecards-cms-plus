import btnImg from '@img/btn-download.svg';

import exportCards from '@core/exportCards';

import { handleCallErrorModal } from '@components/ModalError/handlers';

const ButtonDownloadCards = () => {
  $('#button-create-bulk').after(`
    <div id="button-download-cards" class="gz-button dv-f-l dv-mt-mdpi dv-mr-mdpi dv-mb-mdpi dv-ml-hdpi btn-container">
      <a href="#" class="gz-tooltip btn-img-container" onclick="return false;">
        ${btnImg}
        <span class="gz-span-bottom-right gz-dark-blue-grey">
          Baixar cards selecionados (CSV)
        </span>
      </a>
    </div>
    `);

  const button = $('#button-download-cards');

  button.on('click', async () => {
    if (button.hasClass('btn-loading')) return;
    button.addClass('btn-loading');

    try {
      await exportCards(localStorage.getItem('pageId'));
    } catch (error) {
      handleCallErrorModal(error.message);
    } finally {
      button.removeClass('btn-loading');
    }
  });

};

export default ButtonDownloadCards;
