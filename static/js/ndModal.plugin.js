$.fn.ndModal = function () {
  if ($(this).find('.blackScreen').length === 0) {
    this.append('<div class="blackScreen"></div>');
  }

  const closeModal = (el) => {
    $(el).addClass('close');
    setTimeout(() => {
      $(el).removeClass('active close');
    }, 600);
  };

  $(this).on('click touchstart', '.btnCloseNdModal', (e) => {
    closeModal(this);
  });

  const closeBtn = `
      <button class="btnCloseNdModal">
        <span class="icon close">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M6.75 17.25L17.25 6.75" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.25 17.25L6.75 6.75" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>
    `;

  if ($(this).find('.btnCloseNdModal').length === 0) {
    $(this).find('.menue').prepend(closeBtn);
  }

  // if click to the balck screen close the modal
  $(this).on('click touchstart', (e) => {
    const isBlackScreen = $(e.target).hasClass('blackScreen');
    const isWrapperActive = $(this).hasClass('active');
    if (isBlackScreen && isWrapperActive) {
      closeModal(this);
    }
  });

  // I do not want the black screen event to be activated immediately.
  setTimeout(() => {
    $(this).addClass('active');
  }, 200);

  return this;
};
