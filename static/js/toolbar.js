const commands = {};

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

export default (context) => {
  const triggerCommand = (cmd, item) => {
    if (commands[cmd]) {
      commands[cmd](cmd, context.ace, item);
    }
    if (context.ace) context.ace.focus();
  };

  // prevent close keyboard
  $(document).on('touchend touchstart', '#mobileToolbar, #headings', (e) => {
    e.preventDefault();
  });

  $('#mobileToolbar [data-action]').each((i, elt) => {
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
};
