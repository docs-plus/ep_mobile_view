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

  $(document).on('click touchstart', '#openLeftSideMenue', () => {
    $('#tableOfContentsModal').ndModal();
  });

  viewportController(context);
  toolbar(context);
  floatButton(context);
};

export const collectContentPre = (hookName, context) => {
  const tname = context.tname;
  if ("i, b, u".includes(tname)) {
    context.state.author = clientVars.author = clientVars.userId;
  }
  return [];
};
