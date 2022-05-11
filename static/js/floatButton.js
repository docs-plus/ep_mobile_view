import db from './db';

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


export default (context) => {
  $(document).on('click touchstart', '.floatingButton button', () => {
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

    $('.floatingButton').fadeOut('fast');
    $('#mobileToolbar').show();
  });
};
