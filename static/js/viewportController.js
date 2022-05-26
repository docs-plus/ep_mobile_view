import db from './db';

const viewPortHeight = window.innerHeight;
let touchStartPosX = 0;

const innderDoc = () => $(document)
    .find('iframe[name="ace_outer"]')
    .contents().find('iframe[name="ace_inner"]').contents();

export default (context) => {
  const scrollDown = () => {
    if (!db.keyboardOpen) {
      $('#mainHeader').css({
        transform: 'translateY(-100%)',
      });
    }

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

  const onKeyboardOnOff = (isOpen, viewportHeight, pageTop) => {
    // Write down your handling code
    viewportHeight = Math.trunc(viewportHeight + pageTop);
    if (isOpen) {
      // keyboard is open
      $('#mobileToolbar, #menu_editeMode').css('display', 'flex');
      $('#openLeftSideMenue').hide();
      $('.floatingButton').fadeOut('fast');
      db.keyboardOpen = true;
    } else {
      // keyboard is closed
      $('#mobileToolbar, #menu_editeMode').hide();
      $('#openLeftSideMenue, body.mobileView header .title').show();
      $('.floatingButton').fadeIn('fast');
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

  const scrollToFixViewPort = (viewport) => {
    const selection = $(document).find('iframe[name="ace_outer"]')
        .contents().find('iframe[name="ace_inner"]').contents()[0].getSelection();

    const targetNode = selection.anchorNode.parentElement.closest('div');

    if (!targetNode) return;

    const $outerdoc = $('iframe[name="ace_outer"]').contents().find('#outerdocbody');
    const $outerdocHTML = $outerdoc.parent();
    if (targetNode.offsetTop > viewport.height) {
      // center of viewport
      const offsetTop = targetNode.offsetTop - (viewport.height / 2);
      $outerdoc.animate({scrollTop: offsetTop});
      $outerdocHTML.animate({scrollTop: offsetTop});
    }
  };

  const viewportHandler = (event) => {
    event.preventDefault();
    const viewport = event.target;
    if (viewport.height < viewPortHeight) {
      onKeyboardOnOff(true, viewport.height, viewport.pageTop);
      scrollToFixViewPort(viewport);
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
};
