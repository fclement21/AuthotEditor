var save_process;
var SaveButton;
var AuthotAPI = "CHANGE_ME";
var AccessToken = "CHANGE_ME"
function SaveApiCall(align) {
  var text = $(".summernote").summernote("code")
  var params = {};
  params.access_token = AccessToken;
  params.document = text;
  params.align = align;
  $.ajax({
    url : AuthotAPI + "/sounds/" + id + "/save",
    type : 'POST',
    dataType: 'json',
    data: params,
    success: function(data, status){
      if (align){
        $(".summernote").summernote("code", data.document);
      }
      $('#ExportModal').modal('hide');
    },
    error: function(data, status, error){
      $('#ExportModal').modal('hide');
      alert("Erreur ! Merci de nous contacter");
    }
  });
}
function LoadXml() {
  $('.modal-title-export').hide();
  $('.modal-title-align').hide();
  $('.modal-title-load').show();
  $('.align_body').hide();
  $('.export_body').hide();
  $('.export').hide();
  $('.load_xml').show();
  $('#ExportModal').modal('show');
  var params = {};
  params.access_token = AccessToken;
  params.export_format = 'xml';
  $.ajax({
    url : AuthotAPI + "/sounds/" + id,
    type : 'GET',
    data: params,
    success: function(data, status, xhr){
      $(".summernote").summernote("code", data);
    },
    error: function(data, status, error){
      alert("Erreur lors du chargement de votre transcription, veuillez réésayer ou recharger la page.");
    }
  });
  $('#ExportModal').modal('hide');
}

function ExportApiCall(format){
  var params = {};
  params.access_token = AccessToken;
  params.export_format = format;
  $.ajax({
    url : AuthotAPI + "/sounds/" + id,
    type : 'GET',
    data: params,
    success: function(response, status, xhr){
      var filename = "test." + params.export_format;
      var disposition = xhr.getResponseHeader('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
      }
      var type = xhr.getResponseHeader('Content-Type');
      var blob = new Blob([response], { type: type });
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        if (filename) {
          var a = document.createElement("a");
          if (typeof a.download === 'undefined') {
            window.location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        } else {
          window.location = downloadUrl;
        }
        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
      }
      $('#ExportModal').modal('hide');
    },
    error: function(data, status, error){
      $('#ExportModal').modal('hide');
      alert("Erreur lors de l'export. Merci de nous contacter");
    }
  });
}
function SaveProcess() {
  SaveApiCall(false);
};

function ExportProcess(format) {
  SaveProcess(false);
  ExportApiCall(format);
};

function ExportModal() {
  $('.modal-title-export').show();
  $('.modal-title-align').hide();
  $('.modal-title-load').hide();
  $('.align_body').hide();
  $('.export_body').show();
  $('.load_xml').hide();
  $('.export').show();
  $('#ExportModal').modal('show');
}
function AlignProcess(){
  $('.modal-title-export').hide();
  $('.modal-title-align').show();
  $('.modal-title-load').hide();
  $('.align_body').show();
  $('.export_body').hide();
  $('.load_xml').hide();
  $('.export').hide();
  $('#ExportModal').modal('show');
  SaveApiCall(true);
};

function karaoke() {
  var lastWord;
  if ($('#player').length > 0) {
    lastWord = null;
    audio.addEventListener('timeupdate', function() {
      var i, len, ref, results, word;
      ref = $.parseHTML($('.summernote').summernote('code'))[2].getElementsByTagName('word');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        word = ref[i];
        if (audio.currentTime >= parseFloat(word.getAttribute('start')) && audio.currentTime < parseFloat(word.getAttribute('end'))) {
          $('word[start="' + word.getAttribute('start') + '"]').attr("style", "background-color: #FF983B;");
          if (lastWord !== word) {
            $(lastWord).attr("style", " ");
          }
          results.push(lastWord = $('word[start="' + word.getAttribute('start') + '"]'));
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
  }
};


SaveButton = function(context) {
  var button, ui;
  ui = $.summernote.ui;
  button = ui.button({
    contents: '<img src="images/save.png" alt="Save Button"></img>',
    className: 'save_button',
    click: function() {
      SaveProcess();
    }
  });
  return button.render();
};

ExportButton = function(context) {
  var button, ui;
  ui = $.summernote.ui;
  button = ui.button({
    contents: '<div> Exporter <img src="images/export_icon.png" alt="Export Button"></img></div>',
    className: 'summernote_button export_button',
    click: function() {
      ExportModal();
    }
  });
  return button.render();
};

AlignButton = function(context) {
  var button, ui;
  ui = $.summernote.ui;
  button = ui.button({
    contents: '<div> Aligner<img src="images/align_icon.png" alt="Align Button"></img></div>',
    className: 'summernote_button align_button',
    click: function(){
      AlignProcess();
    }
  });
  return button.render();
};

$(document).ready(function() {
  audio = $("#player")[0];
  id = $("#player").data('id');
  $('.summernote').summernote({
    height: 300,
    minHeight: null,
    maxHeight: null,
    focus: true,
    disableDragAndDrop: true,
    lang: 'fr-FR',
    toolbar: [['save', ['save']], ['align', ['align']], ['export', ['export']]],
    buttons: {
      "align": AlignButton,
      "export": ExportButton,
      "save": SaveButton,
    },
    callbacks: {
      onInit: function() {
        LoadXml();
        karaoke();
      }
    }
  });

  $('.note-editable').on('click', function(e) {
    var end_time, start_time;
    if ($('#player').length && e.target.tagName === 'WORD') {
      start_time = e.target.getAttribute('start');
      end_time = e.target.getAttribute('end');
      audio.currentTime = parseFloat(start_time);
      $('word[start="' + e.target.getAttribute('start') + '"]').attr("style", "background-color: #FF983B;");
      if (audio.apaused) {
        return audio.pause();
      }
    }
  });

  $(".export").click(function () {
    format = $('select[name=list_formats]').val();
    ExportProcess(format);
  });
});