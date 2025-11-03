import btnImg from '@img/btn-img.svg';
import $ from './libs/jquery-3.7.1.min.js';

(function() {
  'use strict';

const isCardsPage = document.location.pathname.includes('disciplina_cards');

if (isCardsPage) {

  $('#gz-button-create').after(`
    <div id="button-create-bulk" class="gz-button dv-f-l dv-mt-mdpi dv-mr-mdpi dv-mb-mdpi dv-ml-hdpi btn-container">
				<a href="#" class="gz-tooltip btn-img-container" onclick="return false;">
					<img src="${btnImg}" class="btn-img" alt="Adicionar cards em lote">
					<span class="gz-span-bottom-right gz-dark-blue-grey">
						Adicionar cards em lote
					</span>
				</a>
			</div>
    `);
}

})();