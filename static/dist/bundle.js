'use strict';Object.defineProperty(exports,'__esModule',{value:true});var db = {
  lastCaretPos: 0,
  keyboardOpen: false,
  autoHideToolbar: false,
};/** Helper */
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

/** Hooks */
const aceEditorCSS$1 = () => {
  if (!clientVars.userAgent.isMobile) return [];
  return ['ep_mobile_view/static/css/innerMobile.css'];
};

const aceEditEvent$1 = (hookName, call) => {
  // If it's not a click or a key event and the text hasn't changed then do nothing
  const cs = call.callstack;

  // save last postion of the caret
  // TODO: refactor needed
  if ((cs.type === 'handleKeyEvent')) {
    setTimeout(() => {
      db.lastCaretPos = getCurrentCursorPosition('innerdocbody');
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
};const commands = {};

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

var toolbar = (context) => {
  const triggerCommand = (cmd, item) => {
    if (commands[cmd]) {
      commands[cmd](cmd, context.ace, item);
    }
    if (context.ace) context.ace.focus();
  };

  const preventTouchElemets = '#mobileToolbar, #headings, .buttonicon-undo, .buttonicon-redo';
  // prevent close keyboard
  $(document).on('touchend touchstart', preventTouchElemets, (e) => {
    e.preventDefault();
  });

  $('#mobileToolbar [data-action], #menu_editeMode [data-action]').each((i, elt) => {
    $(elt).unbind('click');
    new ToolbarItem($(elt)).bind((command, item) => {
      triggerCommand(command, item);
    });
  });

  const registerCommand = (cmd, callback) => {
    commands[cmd] = callback;
  };

  const registerAceCommand = (cmd, callback) => {
    registerCommand(cmd, (cmd, ace, item) => {
      ace.callWithAce((ace) => {
        callback(cmd, ace, item);
      }, cmd, true);
    });
  };

  const aceAttributeCommand = (cmd, ace) => {
    ace.ace_toggleAttributeOnSelection(cmd);
  };

  // register tooblar buttons
  registerAceCommand('bold', aceAttributeCommand);
  registerAceCommand('italic', aceAttributeCommand);
  registerAceCommand('underline', aceAttributeCommand);
  registerAceCommand('insertunorderedlist', (cmd, ace) => {
    ace.ace_doInsertUnorderedList();
  });
  registerAceCommand('insertorderedlist', (cmd, ace) => {
    ace.ace_doInsertOrderedList();
  });
  registerAceCommand('undo', (cmd, ace) => ace.ace_doUndoRedo(cmd));
  registerAceCommand('redo', (cmd, ace) => ace.ace_doUndoRedo(cmd));
};const $outerBody = () => $('iframe[name="ace_outer"]').contents().find('body');// TODO: refactor needed
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
    const innerdoc = $(document).find('iframe[name="ace_outer"]')
        .contents()
        .find('iframe[name="ace_inner"]')
        .contents()
        .find('#innerdocbody')[0];

    const range = createRange(innerdoc, {count: chars});

    if (range) {
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};


var floatButton = (context) => {
  const fButton = `
    <div class="floatingButton">
      <button>
        <span class="icon pencil"></span>
      </button>
    </div>
  `;

  $outerBody().append(fButton);

  $outerBody().on('click touchstart', '.floatingButton button', () => {
    setCurrentCursorPosition(db.lastCaretPos);
    // put the contents in to the editable mode
    context.ace.callWithAce((ace) => {
      ace.ace_setEditable(true);
      // if the device is Android
      if (!clientVars.userAgent.isSafari) {
        $(document).find('iframe[name="ace_outer"]')
            .contents().find('iframe[name="ace_inner"]')
            .contents().find('#innerdocbody')[0].focus();
      }
    }, 'contentEditable', true);

    $outerBody().find('.floatingButton').fadeOut('fast');
    $('#mobileToolbar').show();

    $('body.mobileView header .title, #openLeftSideMenue')
        .hide(0, () => {
          $('#menu_editeMode').css({display: 'flex'});
        });
  });
};const viewPortHeight = window.innerHeight;

const innderDoc = () => $(document)
    .find('iframe[name="ace_outer"]')
    .contents().find('iframe[name="ace_inner"]').contents();

var viewportController = (context) => {

  // Detect Scroll Down and Up in mobile(android|ios)
  innderDoc().on('touchmove', (e) => {
    return;
  });

  const onKeyboardOnOff = (isOpen, viewportHeight, pageTop) => {
    // Write down your handling code
    viewportHeight = Math.trunc(viewportHeight + pageTop);
    if (isOpen) {
      // keyboard is open
      $('#mobileToolbar, #menu_editeMode').css('display', 'flex');
      $('#openLeftSideMenue').hide();
      $outerBody().find('.floatingButton').fadeOut('fast');
      db.keyboardOpen = true;
    } else {
      // keyboard is closed
      $('#mobileToolbar, #menu_editeMode').hide();
      $('#openLeftSideMenue, body.mobileView header .title').show();
      $outerBody().find('.floatingButton').fadeIn('fast');
      // put the contents in to the readOnly mode
      context.ace.callWithAce((ace) => {
        ace.ace_setEditable(false);
      }, 'contentEditable', true);
      db.keyboardOpen = false;
      // ios close keyboard
      $(document).find('iframe[name="ace_outer"]')
          .contents().find('iframe[name="ace_inner"]')
          .contents()[0].activeElement.blur();

      // navigator.virtualKeyboard.hide();
    }

    $('html.pad, html.pad body').css({
      height: `${viewportHeight}px`,
    });
  };

  const viewportHandler = (event) => {
    event.preventDefault();
    const viewport = event.target;
    if (viewport.height < viewPortHeight) {
      onKeyboardOnOff(true, viewport.height, viewport.pageTop);
      // scrollToFixViewPort(viewport);
    } else {
      // console.log("keyboard closed")
      onKeyboardOnOff(false, viewport.height, viewport.pageTop);
    }
  };

  window.visualViewport.addEventListener('resize', viewportHandler);
  window.visualViewport.addEventListener('scroll', viewportHandler);

  $(document).on('click touchstart', '#closeVirtualKeyboar', (event) => {
    $('#menu_editeMode').hide(0, () => {
      $('body.mobileView header .title, #openLeftSideMenue').show();
      viewportHandler(event);
    });
  });
};$.fn.ndModal = function () {
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
};const aceEditorCSS = aceEditorCSS$1;
const aceEditEvent = aceEditEvent$1;

const postAceInit = (hookName, context) => {
  if (!clientVars.userAgent.isMobile) return false;

  // put the contents in to the readOnly mode
  context.ace.callWithAce((ace) => {
    ace.ace_setEditable(false);
  }, 'disableContentEditable', true);

  $(document).on('touchstart', '#openLeftSideMenue', () => {
    $('#tableOfContentsModal').ndModal();
  });

  viewportController(context);
  toolbar(context);
  floatButton(context);
};

const collectContentPre = (hookName, context) => {
  const tname = context.tname;
  if ('i, b, u'.includes(tname)) {
    context.state.author = clientVars.author = clientVars.userId;
  }
  return [];
};exports.aceEditEvent=aceEditEvent;exports.aceEditorCSS=aceEditorCSS;exports.collectContentPre=collectContentPre;exports.postAceInit=postAceInit;//# sourceMappingURL=bundle.js.map
