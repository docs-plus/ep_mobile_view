module.exports.aceEditorCSS = () => {
  if (!clientVars.userAgent.isMobile) return [];
  return ['ep_mobile_view/static/css/innerMobile.css'];
};

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

const innderDoc = () => $(document)
    .find('iframe[name="ace_outer"]')
    .contents().find('iframe[name="ace_inner"]').contents();

module.exports.postAceInit = (hookName, context) => {
  $(document).on('click touchstart', '#openLeftSideMenue', () => {
    $('#tableOfContentsModal').ndModal();
  });

  const scrollDown = () => {
    $('#mainHeader').css({
      transform: 'translateY(-100%)',
    });
    $('.floatingButton').css({
      transform: 'translateY(160%)',
    });
  };

  const scrollUp = () => {
    $('#mainHeader').css({
      transform: 'translateY(0)',
    });
    $('.floatingButton').css({
      transform: 'translateY(0)',
    });
  };

  let touchStartPosX = 0;
  // Detect Scroll Down and Up in mobile(android|ios)
  innderDoc().on('touchmove', (e) => {
    // Different devices give different values with different decimal percentages.
    const currentPageX = Math.round(e.originalEvent.touches[0].screenY);

    if (currentPageX <= 60) return false;
    if (touchStartPosX === currentPageX) return false;

    if (touchStartPosX - currentPageX > 0) {
      // console.log('down');
      scrollDown();
    } else {
      // console.log('up');
      scrollUp();
    }
    touchStartPosX = currentPageX;
  });

  $(document).on('click touchstart', '.floatingButton button', () => {
    const p = $(document).find('iframe[name="ace_outer"]')
        .contents().find('iframe[name="ace_inner"]').contents().find('#innerdocbody')[0];

    p.focus(); // alternatively use setTimeout(() => { p.focus(); }, 0);
    // this is enough to focus an empty element (at least in Chrome)

    if (p.hasChildNodes()) { // if the element is not empty
      const s = $(document).find('iframe[name="ace_outer"]')
          .contents().find('iframe[name="ace_inner"]').contents()[0].getSelection();
      const r = p.parentNode.parentNode.createRange();
      const e = p.childElementCount > 0 ? p.lastChild : p;
      r.setStart(e, 1);
      r.setEnd(e, 1);
      s.removeAllRanges();
      s.addRange(r);
    }

    $('.floatingButton').fadeOut('fast');
    $('#mobileToolbar').show();
  });


  const onKeyboardOnOff = (isOpen, viewportHeight, pageTop) => {
    // Write down your handling code
    viewportHeight = Math.trunc(viewportHeight + pageTop);
    if (isOpen) {
      // keyboard is open
      $('#mobileToolbar, #closeVirtualKeyboar').show();
      $('#openLeftSideMenue').hide();
      $('.floatingButton').fadeOut('fast');
    } else {
      // keyboard is closed
      $('#mobileToolbar, #closeVirtualKeyboar').hide();
      $('#openLeftSideMenue').show();
      $('.floatingButton').fadeIn('fast');
    }

    $('html.pad, html.pad body').css({
      height: `${viewportHeight}px`,
    });
  };

  if ($('body').hasClass('mobileView')) {
    const viewPortHeight = window.innerHeight;
    const viewportHandler = (event) => {
      event.preventDefault();
      window.scrollTo(0, 0);
      const viewport = event.target;
      if (viewport.height < viewPortHeight) {
        // console.log("keyboard open")
        onKeyboardOnOff(true, viewport.height, viewport.pageTop);
      } else {
        // console.log("keyboard closed")
        onKeyboardOnOff(false, viewport.height, viewport.pageTop);
      }
    };
    window.visualViewport.addEventListener('resize', viewportHandler);
    window.visualViewport.addEventListener('scroll', viewportHandler);
  }

  const toggleAttributeOnSelection = (action) => {
    context.ace.callWithAce((ace) => {
      ace.ace_toggleAttributeOnSelection(action);
    }, action);
  };

  $(document).on('touchstart', '#mobileToolbar ul li', function () {
    const action = $(this).attr('data-action');
    if (action === 'insertorderedlist') {
      context.ace.callWithAce((ace) => {
        ace.ace_doInsertOrderedList();
      }, action);
    } else if (action === 'insertunorderedlist') {
      context.ace.callWithAce((ace) => {
        ace.ace_doInsertUnorderedList();
      }, action);
    } else if ('bold, italic, underline'.includes(action)) {
      toggleAttributeOnSelection(action);
    }
  });

  // prevent close keyboard
  $(document).on('touchend touchstart', '#mobileToolbar, #headings', (e) => {
    e.preventDefault();
  });
};
