module.exports.aceEditorCSS = () => {
  if (!clientVars.userAgent.isMobile) return [];
  return ['ep_mobile_view/static/css/innerMobile.css'];
};

$.fn.ndModal = function () {
  if ($(this).find('.blackScreen').length === 0) {
    this.prepend('<div class="blackScreen"></div>');
  }
  $(this).on('click touchstart', '.btnCloseNdModal', () => {
    $(this).addClass('close');
    setTimeout(() => {
      $(this).removeClass('active close');
    }, 600);
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

  $(this).addClass('active');
  return this;
};

module.exports.postAceInit = () => {
  $(document).on('click touchstart', '#openLeftSideMenue', () => {
    $('#tableOfContentsModal').ndModal();
  });

  $(document).on('click', '.floatingButton button', () => {
    const aceInner = $(document).find('iframe[name="ace_outer"]')
        .contents().find('iframe[name="ace_inner"]').contents().find('#innerdocbody')[0];

    const p = aceInner;
    p.focus(); // alternatively use setTimeout(() => { p.focus(); }, 0);
    // this is enough to focus an empty element (at least in Chrome)

    if (p.hasChildNodes()) { // if the element is not empty
      const s = window.getSelection();
      const r = document.createRange();
      const e = p.childElementCount > 0 ? p.lastChild : p;
      r.setStart(e, 1);
      r.setEnd(e, 1);
      s.removeAllRanges();
      s.addRange(r);
    }
  });
};
