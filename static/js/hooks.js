import db from './db';

/** Helper */
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
export const aceEditorCSS = () => {
  if (!clientVars.userAgent.isMobile) return [];
  return ['ep_mobile_view/static/css/innerMobile.css'];
};

export const aceEditEvent = (hookName, call) => {
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
};
