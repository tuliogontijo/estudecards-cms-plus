import btnImg from '@img/btn-img.svg';

const ButtonCreateBulk = (page = 'registros') => {
  $('#gz-button-create').after(`
    <div id="button-create-bulk" class="gz-button dv-f-l dv-mt-mdpi dv-mr-mdpi dv-mb-mdpi dv-ml-hdpi btn-container">
				<a href="#" class="gz-tooltip btn-img-container" onclick="return false;">
					<img src="${btnImg}" class="btn-img" alt="Adicionar cards em lote">
					<span class="gz-span-bottom-right gz-dark-blue-grey">
						Adicionar ${page} em lote
					</span>
				</a>
			</div>
    `);

  $('#button-create-bulk').on('click', () => {
    $('#dataBase').dialog('open');
  });

};

export default ButtonCreateBulk;
