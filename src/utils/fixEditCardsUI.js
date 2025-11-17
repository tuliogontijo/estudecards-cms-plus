const fixEditCardsUI = () => {
  const maxAttempts = 50;
  let attempts = 0;

  const checkAndMove = setInterval(() => {
    attempts++;

    const tinyMCEContainer = $('textarea[name="disciplina_cards.comentario"]').next('.tox.tox-tinymce');

    if (tinyMCEContainer.length > 0 || attempts >= maxAttempts) {
      clearInterval(checkAndMove);

      if (tinyMCEContainer.length > 0) {
        const labelCommentElement = $('div.gz-label-mdpi:contains("Comentário")').filter(function() {
          return $(this).text().trim() === 'Comentário';
        }).eq(0);

        if (labelCommentElement.length) {
          const clone = labelCommentElement.clone();
          labelCommentElement.remove();
          tinyMCEContainer.before(clone.width('100%'));
        }
      }
    }
  }, 100);
};

export default fixEditCardsUI;
