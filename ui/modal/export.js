/* globals $, Builder, mapId */

Builder.ui = Builder.ui || {};
Builder.ui.modal = Builder.ui.modal || {};
Builder.ui.modal.export = (function () {
  var $cmsId = $('#cms-id');
  var $iframeCode = $('#iframe-code');

  function setHeight () {
    $('#modal-export .tab-content').css({
      height: $(document).height() - 310
    });
  }

  $cmsId.on('click', function () {
    $(this).select();
  });
  $iframeCode.on('click', function () {
    $(this).select();
  });
  Builder.buildTooltips();
  $cmsId.val(mapId);
  $iframeCode.val('<iframe height="500px" frameBorder="0" width="100%" src="https://www.nps.gov/maps/embed.html?mapId=' + mapId + '"></iframe>');
  $('#modal-export-template img.template').click(function () {
    window.open('https://www.nps.gov/maps/' + this.id.replace('template-', '') + '.html?mapId=' + mapId, '_blank');
  });
  setHeight();
  $(window).resize(setHeight);
  $('#modal-export').modal({
    backdrop: 'static',
    keyboard: false
  });

  return {};
})();
