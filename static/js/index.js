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

module.exports.postAceInit = (hookName, context) => {
  $(document).on('click touchstart', '#openLeftSideMenue', () => {
    $('#tableOfContentsModal').ndModal();
  });

  $(document).on('click touchstart', '.floatingButton button', () => {
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

    $('.floatingButton').fadeOut('fast');
    $('#mobileToolbar').show();
  });


  const onKeyboardOnOff = (isOpen) => {
    // Write down your handling code
    if (isOpen) {
      // keyboard is open
      $('#mobileToolbar').show();
      $('.floatingButton').fadeOut('fast');
    } else {
      // keyboard is closed
      $('#mobileToolbar').hide();
      $('.floatingButton').fadeIn('fast');
    }
  };

  let originalPotion = false;
  $(document).ready(() => {
    if (originalPotion === false) originalPotion = $(window).width() + $(window).height();
  });

  /**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
  const getMobileOperatingSystem = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'winphone';
    }

    if (/android/i.test(userAgent)) {
      return 'android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }

    return '';
  };

  const applyAfterResize = () => {
    if (getMobileOperatingSystem() !== 'ios') {
      if (originalPotion !== false) {
        const wasWithKeyboard = $('body').hasClass('view-withKeyboard');
        let nowWithKeyboard = false;

        const diff = Math.abs(originalPotion - ($(window).width() + $(window).height()));
        if (diff > 100) nowWithKeyboard = true;

        $('body').toggleClass('view-withKeyboard', nowWithKeyboard);
        if (wasWithKeyboard !== nowWithKeyboard) {
          onKeyboardOnOff(nowWithKeyboard);
        }
      }
    }
  };

  $(document).find('iframe[name="ace_outer"]')
      .contents()
      .find('iframe[name="ace_inner"]')
      .contents()
      .find('#innerdocbody')
      .on('focus blur', 'select, textarea, input[type=text], input[type=date], input[type=password], input[type=email], input[type=number]', function (e) {
        const $obj = $(this);
        const nowWithKeyboard = (e.type === 'focusin');
        $('body').toggleClass('view-withKeyboard', nowWithKeyboard);
        onKeyboardOnOff(nowWithKeyboard);
      });

  $(window).on('resize orientationchange', () => {
    applyAfterResize();
  });


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
    } else if ('bold, italic, underline'.includes(action)) {
      toggleAttributeOnSelection(action);
    }
  });
};
