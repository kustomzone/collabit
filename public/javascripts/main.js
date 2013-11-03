var usernames = [];

$(function() {
  // Cache element selectors
  // ===============
  $chat = $("#chat");
  $editor = $("#editor");
  $img_load = $("#img-load").remove();
  $btn_submit = $("#btn_submit");
  $messages = $("#messages");
  $overlay = $("#overlay");
  $selectMode = $("select#mode");
  $selectTheme = $("select#theme");

  blockui($img_load);

  // ACE Editor
  // =========================================================
  var editor = ace.edit("editor");
  editor.getSession().setUseWorker(false);
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");

  // Chosen
  // =========================================================
  $selectMode.chosen({
    width: "180px",
    search_contains: true
  })
  .on('change', function () {
    editor.getSession().setMode("ace/mode/" + this.value);
    socket.emit('changelang', this.value);
  });

  // Socket.IO
  // ========================================================
  var socket = io.connect("http://" + document.domain + "/chat");

  // [SOCKET] CONNECT
  socket.on("connect", function() {
    console.log("SOCKET: Connection detected.");

    blockui($overlay);
    
    $("#btn_submit").click(function () {
      var name = validate_name($("#input_uname").val());

      if (name !== false) {
        socket.emit("adduser", name, document.URL.substr(-6));
        blockui($img_load);
      }
      else {
        $.gritter.add({
          title: "Error",
          text: "Empty, duplicate, or invalid username.  Please try again.",
          time: 6000,
          sticky: false
        });
      }
      return false;
    });

    $("#btn_cancel").click(function () {
      $messages.prop("disabled", "true");
      socket.disconnect();
      $.unblockUI();
      $.gritter.add({
        title: "Collaboration Disabled",
        text: "To enable collaboration refresh the page and enter your name.",
        sticky: true

      });
    });
  });

  // [SOCKET] UPDATE CHAT
  socket.on("updatechat", function(username, message) {
    console.log("SOCKET: 'updatechat' emission detected.");
    write_chat_message(username, tokenize(message));
  });

  // [SOCKET] UPDATE USERS
  socket.on("updateusers", function(new_usernames) {
    console.log("SOCKET: updateusers [" + new_usernames.join(", ") + "]");
    usernames = new_usernames;
  });

  // [SOCKET] UPDATE LANG
  socket.on("updatelang", function(lang, username) {
    console.log("SOCKET: updatelang detected. Language changed to " + lang + " by " + username);
    // TODO: Should probably do some validation on this
    $("select#mode").val(lang).trigger("chosen:updated");
    write_chat_message("SERVER", username + " changed the language to " + lang);
  });

  // [SOCKET] ADD USER SUCCESS
  socket.on("addusersuccess", function () {
    console.log("SOCKET: 'addusersuccess' emission detected.");
    $.unblockUI();

    // Share.JS
    // ========================================================
    sharejs.open("#{room}", 'text', function(error, doc) {
      doc.attach_ace(editor);
    });
  });

  // [SOCKET] ADD USER FAIL
  socket.on("adduserfail", function (message) {
    blockui($overlay);

    $.gritter.add({
      title: "Error",
      text: message,
      time: 6000,
      sticky: false
    });
  });

  // [SOCKET] EXCEPTION
  socket.on("exception", function(message) {
    console.log('ERROR: ' + message.type);

    $.gritter.add({
      title: "Error",
      text: message.type,
      sticky: true
    });
  });

  // [SOCKET] ERROR
  socket.on("error", function(message) {
    console.log('INTERNAL SOCKET ERROR: ' + message);
  });

  // Event handlers
  // ========================================================
  $("#message").keypress(function (e) {
    if (e.which == 13) {
      send_chat();
      return false;
    }
  });

  $("#input_uname").keypress(function (e) {
    if (e.which == 13) {
      $btn_submit.click();
      return false;
    }
  });

  window.onbeforeunload = function () {
    console.log("SOCKET: Leaving Collabit. Emitting 'userleft'");
    socket.emit("userleft");
  };

  function write_chat_message(username, message) {
    $messages.append('<b>' + username + ':</b> ' + message + '<br>');
    $messages.scrollTop = $messages.scrollHeight;
  }
  
  function send_chat() {
    var messageBox = $('textarea#message')
    var message = messageBox.val();
    if (message !== "") {
      messageBox.val('');
      console.log("SOCKET: Send chat command detected.  Emitting 'sendchat'");
      socket.emit('sendchat', message);
    }
  }

  function validate_name(name) {
    if (typeof name !== "undefined"
        && name !== "" 
        && name !== null 
        && !name.match(/server/i)
        && usernames.indexOf(name) === -1) {
      
      return name;
    }
    else {
      return false;
    }
  }

  function tokenize(message) {
    // Links
    var pat_link = /((((http(s)?|ftp):\/\/)|www\.)\S+\.\S{2,})/ig;
    var rep_link = '<a href="$1">$1</a>';
    message = message.replace(pat_link, rep_link);

    return message;
  }

  function blockui(content) {
    $.blockUI.defaults.baseZ = 1030;
    
    $.blockUI({
      message: content,
      css: {
        border: '',
        backgroundColor: '',
        cursor: 'default',
        textAlign: ''
      }
    });
  }
});