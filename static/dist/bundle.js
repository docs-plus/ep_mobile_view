"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e={lastCaretPos:0,keyboardOpen:!1,autoHideToolbar:!1};const t={};class n{constructor(e){this.$el=e}getCommand(){return this.$el.attr("data-action")}getValue(){if(this.isSelect())return this.$el.find("select").val()}setValue(e){if(this.isSelect())return this.$el.find("select").val(e)}getType(){return this.$el.attr("data-type")}isSelect(){return"select"===this.getType()}isButton(){return"button"===this.getType()}bind(e){this.isButton()?this.$el.on("click touchstart",(t=>{$(":focus").blur(),e(this.getCommand(),this),t.preventDefault()})):this.isSelect()&&this.$el.find("select").change((()=>{e(this.getCommand(),this)}))}}var o=e=>{$(document).on("touchend touchstart","#mobileToolbar, #headings, .buttonicon-undo, .buttonicon-redo",(e=>{e.preventDefault()})),$("#mobileToolbar [data-action], #menu_editeMode [data-action]").each(((o,i)=>{$(i).unbind("click"),new n($(i)).bind(((n,o)=>{((n,o)=>{t[n]&&t[n](n,e.ace,o),e.ace&&e.ace.focus()})(n,o)}))}));const o=(e,n)=>{((e,n)=>{t[e]=n})(e,((e,t,o)=>{t.callWithAce((t=>{n(e,t,o)}),e,!0)}))},i=(e,t)=>{t.ace_toggleAttributeOnSelection(e)};o("bold",i),o("italic",i),o("underline",i),o("insertunorderedlist",((e,t)=>{t.ace_doInsertUnorderedList()})),o("insertorderedlist",((e,t)=>{t.ace_doInsertOrderedList()})),o("undo",((e,t)=>t.ace_doUndoRedo(e))),o("redo",((e,t)=>t.ace_doUndoRedo(e)))};const i=()=>$('iframe[name="ace_outer"]').contents().find("body"),a=(e,t,n)=>{if(n||((n=document.createRange()).selectNode(e),n.setStart(e,0)),0===t.count)n.setEnd(e,t.count);else if(e&&t.count>0)if(e.nodeType===Node.TEXT_NODE)e.textContent.length<t.count?t.count-=e.textContent.length:(n.setEnd(e,t.count),t.count=0);else for(let o=0;o<e.childNodes.length&&(n=a(e.childNodes[o],t,n),0!==t.count);o++);return n};var s=t=>{i().append('\n    <div class="floatingButton">\n      <button>\n        <span class="icon pencil"></span>\n      </button>\n    </div>\n  '),i().on("click touchstart",".floatingButton button",(()=>{(e=>{if(e>=0){const t=window.getSelection(),n=$(document).find('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents().find("#innerdocbody")[0],o=a(n,{count:e});o&&(o.collapse(!1),t.removeAllRanges(),t.addRange(o))}})(e.lastCaretPos),t.ace.callWithAce((e=>{e.ace_setEditable(!0),clientVars.userAgent.isSafari||$(document).find('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents().find("#innerdocbody")[0].focus()}),"contentEditable",!0),i().find(".floatingButton").fadeOut("fast"),$("#mobileToolbar").show(),$("body.mobileView header .title, #openLeftSideMenue").hide(0,(()=>{$("#menu_editeMode").css({display:"flex"})}))}))};const c=window.innerHeight;var d=t=>{$(document).find('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents().on("touchmove",(e=>{}));const n=(n,o,a)=>{o=Math.trunc(o+a),n?($("#mobileToolbar, #menu_editeMode").css("display","flex"),$("#openLeftSideMenue").hide(),i().find(".floatingButton").fadeOut("fast"),e.keyboardOpen=!0):($("#mobileToolbar, #menu_editeMode").hide(),$("#openLeftSideMenue, body.mobileView header .title").show(),i().find(".floatingButton").fadeIn("fast"),t.ace.callWithAce((e=>{e.ace_setEditable(!1)}),"contentEditable",!0),e.keyboardOpen=!1,$(document).find('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents()[0].activeElement.blur()),$("html.pad, html.pad body").css({height:`${o}px`})},o=e=>{e.preventDefault();const t=e.target;t.height<c?(n(!0,t.height,t.pageTop),(e=>{const t=$(document).find('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents()[0].getSelection().anchorNode.parentElement.closest("div");if(!t)return;const n=$('iframe[name="ace_outer"]').contents().find("#outerdocbody").parent(),o=$("#mainHeader").innerHeight(),i=t.offsetTop-o-25;n.animate({scrollTop:i})})()):n(!1,t.height,t.pageTop)};window.visualViewport.addEventListener("resize",o),window.visualViewport.addEventListener("scroll",o),$(document).on("click touchstart","#closeVirtualKeyboar",(e=>{$("#menu_editeMode").hide(0,(()=>{$("body.mobileView header .title, #openLeftSideMenue").show(),o(e)}))}))};$.fn.ndModal=function(){0===$(this).find(".blackScreen").length&&this.append('<div class="blackScreen"></div>');const e=e=>{$(e).addClass("close"),setTimeout((()=>{$(e).removeClass("active close")}),600)};$(this).on("click touchstart",".btnCloseNdModal",(t=>{e(this)}));return 0===$(this).find(".btnCloseNdModal").length&&$(this).find(".menue").prepend('\n      <button class="btnCloseNdModal">\n        <span class="icon close">\n          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">\n            <path d="M6.75 17.25L17.25 6.75" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            <path d="M17.25 17.25L6.75 6.75" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n          </svg>\n        </span>\n      </button>\n    '),$(this).on("click touchstart",(t=>{const n=$(t.target).hasClass("blackScreen"),o=$(this).hasClass("active");n&&o&&e(this)})),setTimeout((()=>{$(this).addClass("active")}),200),this};const r=()=>clientVars.userAgent.isMobile?["ep_mobile_view/static/css/innerMobile.css"]:[],l=(t,n)=>{const o=n.callstack;return"handleKeyEvent"===o.type&&setTimeout((()=>{e.lastCaretPos=(e=>{const t=$(document).find('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents()[0].getSelection();let n,o=-1;if(t.focusNode&&((e,t)=>{for(;null!=e;){if(e.id===t)return!0;e=e.parentNode}return!1})(t.focusNode,e))for(n=t.focusNode,o=t.focusOffset;n&&n.id!==e;)if(n.previousSibling)n=n.previousSibling,o+=n.textContent.length;else if(n=n.parentNode,null==n)break;return o})("innerdocbody")}),200),!("handleClick"!==o.type&&"handleKeyEvent"!==o.type&&!o.docTextChanged)&&("setBaseText"!==o.type&&"setup"!==o.type&&(setTimeout((()=>{const e=n.documentAttributeManager;$("#mobileToolbar > ul > li").removeClass("active");for(const t of["bold","italic","underline"]){e.hasAttributeOnSelectionOrCaretPosition(t)&&$(`#mobileToolbar > ul > li[data-action="${t}"]`).addClass("active")}}),250),{}))};exports.aceEditEvent=l,exports.aceEditorCSS=r,exports.collectContentPre=(e,t)=>{const n=t.tname;return"i, b, u".includes(n)&&(t.state.author=clientVars.author=clientVars.userId),[]},exports.postAceInit=(e,t)=>{if(!clientVars.userAgent.isMobile)return!1;t.ace.callWithAce((e=>{e.ace_setEditable(!1)}),"disableContentEditable",!0),$(document).on("touchstart","#openLeftSideMenue",(()=>{$("#tableOfContentsModal").ndModal()})),$(document).on("touchstart","#mainHeader #pad_title .padName, body > header .shortMenue .btnChat",(e=>{e.stopPropagation(),e.preventDefault(),$(".ndModal.active").each((function(){$(this).removeClass("active")})),$("#chatModal").ndModal().find(".btnCloseNdModal").attr({id:"header_chat_room_close"}),setTimeout((()=>{const e=$(document).find("#headerContainer");$("#chatModal .header .title").html(e.text()),e.trigger("click")}),400)})),d(t),o(t),s(t)};//# sourceMappingURL=bundle.js.map
