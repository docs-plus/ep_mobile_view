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

  // TODO: refactor needed

  const createRange = (node, chars, range) => {
    if (!range) {
      range = document.createRange();
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    } else if (node && chars.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      } else {
        for (let lp = 0; lp < node.childNodes.length; lp++) {
          range = createRange(node.childNodes[lp], chars, range);

          if (chars.count === 0) {
            break;
          }
        }
      }
    }

    return range;
  };

  const setCurrentCursorPosition = (chars) => {
    if (chars >= 0) {
      const selection = window.getSelection();

      const range = createRange($(document).find('iframe[name="ace_outer"]')
          .contents().find('iframe[name="ace_inner"]').contents().find('#innerdocbody')[0], {count: chars});

      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  $(document).on('click touchstart', '.floatingButton button', () => {
    setCurrentCursorPosition(lastCaretPos.caretPosistion);
    $('.floatingButton').fadeOut('fast');
    $('#mobileToolbar').css('display', 'flex');
  });


  const onKeyboardOnOff = (isOpen, viewportHeight, pageTop) => {
    // Write down your handling code
    viewportHeight = Math.trunc(viewportHeight + pageTop);
    if (isOpen) {
      // keyboard is open
      $('#mobileToolbar').css('display', 'flex');
      $('#closeVirtualKeyboar').show();
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
  class ToolbarItem {
    constructor(element) {
      this.$el = element;
    }

    getCommand() {
      return this.$el.attr('data-action');
    }

    getValue() {
      if (this.isSelect()) {
        return this.$el.find('select').val();
      }
    }

    setValue(val) {
      if (this.isSelect()) {
        return this.$el.find('select').val(val);
      }
    }

    getType() {
      return this.$el.attr('data-type');
    }

    isSelect() {
      return this.getType() === 'select';
    }

    isButton() {
      return this.getType() === 'button';
    }

    bind(callback) {
      if (this.isButton()) {
        this.$el.on('click touchstart', (event) => {
          $(':focus').blur();
          callback(this.getCommand(), this);
          event.preventDefault();
        });
      } else if (this.isSelect()) {
        this.$el.find('select').change(() => {
          callback(this.getCommand(), this);
        });
      }
    }
  }

  const commands = {};

  const registerCommand = (cmd, callback) => {
    commands[cmd] = callback;
    return this;
  };

  const registerAceCommand = (cmd, callback) => {
    registerCommand(cmd, (cmd, ace, item) => {
      ace.callWithAce((ace) => {
        callback(cmd, ace, item);
      }, cmd, true);
    });
  };

  const triggerCommand = (cmd, item) => {
    if (commands[cmd]) {
      commands[cmd](cmd, context.ace, item);
    }
    if (context.ace) context.ace.focus();
  };

  const aceAttributeCommand = (cmd, ace) => {
    ace.ace_toggleAttributeOnSelection(cmd);
  };

  registerAceCommand('bold', aceAttributeCommand);
  registerAceCommand('italic', aceAttributeCommand);
  registerAceCommand('underline', aceAttributeCommand);

  registerAceCommand('insertunorderedlist', (cmd, ace) => {
    ace.ace_doInsertUnorderedList();
  });

  registerAceCommand('insertorderedlist', (cmd, ace) => {
    ace.ace_doInsertOrderedList();
  });


  $('#mobileToolbar [data-action]').each((i, elt) => {
    $(elt).unbind('click');
    new ToolbarItem($(elt)).bind((command, item) => {
      triggerCommand(command, item);
    });
  });

  // prevent close keyboard
  $(document).on('touchend touchstart', '#mobileToolbar, #headings', (e) => {
    e.preventDefault();
  });
};

let lastCaretPos = {};

// TODO: refactor needed
const isChildOf = (node, parentId) => {
  while (node != null) {
    if (node.id === parentId) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};

const getCurrentCursorPosition = (parentId) => {
  const selection = $(document).find('iframe[name="ace_outer"]')
      .contents().find('iframe[name="ace_inner"]').contents()[0].getSelection();
  let charCount = -1;
  let node;

  if (selection.focusNode) {
    if (isChildOf(selection.focusNode, parentId)) {
      node = selection.focusNode;
      charCount = selection.focusOffset;

      while (node) {
        if (node.id === parentId) {
          break;
        }

        if (node.previousSibling) {
          node = node.previousSibling;
          charCount += node.textContent.length;
        } else {
          node = node.parentNode;
          if (node == null) {
            break;
          }
        }
      }
    }
  }

  return charCount;
};

exports.aceEditEvent = (hookName, call) => {
  // If it's not a click or a key event and the text hasn't changed then do nothing
  const cs = call.callstack;

  // save last postion of the caret
  // TODO: refactor needed
  if ((cs.type === 'handleKeyEvent')) {
    setTimeout(() => {
      lastCaretPos = {
        caretPosistion: getCurrentCursorPosition('innerdocbody'),
      };
    }, 200);
  }

  if (!(cs.type === 'handleClick') && !(cs.type === 'handleKeyEvent') && !(cs.docTextChanged)) {
    return false;
  }
  // If it's an initial setup event then do nothing..
  if (cs.type === 'setBaseText' || cs.type === 'setup') return false;

  // toolbar caret attr check
  setTimeout(() => {
    const attributeManager = call.documentAttributeManager;
    $('#mobileToolbar > ul > li').removeClass('active');

    for (const caretAttr of ['bold', 'italic', 'underline']) {
      const activeCaret = attributeManager.hasAttributeOnSelectionOrCaretPosition(caretAttr);
      if (activeCaret) {
        $(`#mobileToolbar > ul > li[data-action="${caretAttr}"]`).addClass('active');
      }
    }
  }, 250);

  return {};
};
