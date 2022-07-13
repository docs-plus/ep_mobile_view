import {aceEditorCSS as aceCss, aceEditEvent as aceEvents} from './hooks';
import toolbar from './toolbar';
import floatButton from './floatButton';
import viewportController from './viewportController';
import './ndModal.plugin';

export const aceEditorCSS = aceCss;
export const aceEditEvent = aceEvents;

export const postAceInit = (hookName, context) => {
  if (!clientVars.userAgent.isMobile) return false;

  // put the contents in to the readOnly mode
  context.ace.callWithAce((ace) => {
    ace.ace_setEditable(false);
  }, 'disableContentEditable', true);

  $(document).on('touchstart', '#openLeftSideMenue', () => {
    $('#tableOfContentsModal').ndModal();
  });

  $(document).on('touchstart', '#mainHeader #pad_title .padName, body > header .shortMenue .btnChat', (e) => {
    e.stopPropagation();
    e.preventDefault();
    $('.ndModal.active').each(function () {
      $(this).removeClass('active');
    });
    // open chat modal
    $('#chatModal')
        .ndModal()
        .find('.btnCloseNdModal')
        .attr({id: 'header_chat_room_close'});
    setTimeout(() => {
      const headerCounter = $(document).find('#headerContainer');
      $('#chatModal .header .title').html(headerCounter.text());
      headerCounter.trigger('click');
    }, 400);
  });

  viewportController(context);
  toolbar(context);
  floatButton(context);
};

export const collectContentPre = (hookName, context) => {
  const tname = context.tname;
  if ('i, b, u'.includes(tname)) {
    context.state.author = clientVars.author = clientVars.userId;
  }
  return [];
};
