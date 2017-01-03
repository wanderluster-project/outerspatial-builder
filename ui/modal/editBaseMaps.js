/* globals $, Builder, NPMap */

// TODO: Need to hook up "load" for baseLayer objects saved to server.
// TODO: Hitting radio button doesn't trigger change function for checkbox.
// TODO: "Canceling" out of modal doesn't revert changes made but not saved.

Builder.ui = Builder.ui || {};
Builder.ui.modal = Builder.ui.modal || {};
Builder.ui.modal.editBaseMaps = (function () {
  var $checkbox = $('#modal-editBaseMaps input');
  var $modal = $('#modal-editBaseMaps');
  var presets = document.getElementById('iframe-map').contentWindow.L.npmap.preset;
  var baseLayers = presets.baselayers;
  var html = [];
  // var overlays = presets.overlays;
  var providers = {
    bing: 'Bing',
    cartodb: 'CartoDB',
    esri: 'Esri',
    mapbox: 'Mapbox',
    nps: 'National Park Service',
    stamen: 'Stamen'
  };
  var activeLink;

  function createThumbnail (map, provider, providerPretty, parkTiles) {
    var id = provider + '-' + map;
    var pretty = maps[map].name.replace(provider.toUpperCase() + ' ', '').replace(providerPretty + ' ', '');

    return '' +
      '<div id="' + id + '" class="basemap col-xs-4 col-sm-4 col-md-4 col-lg-4">' +
        '<div class="thumbnail">' +
          '<p>' + pretty + '</p>' +
          /*
          (parkTiles ? '' +
            '<div class="text-center" style="background-color:#fff;position:absolute;top:133px;width:139px;">' +
              '<a class="parktiles-overlays-link" href="#" id="parktiles-overlays-link-' + overlays.nps[map].pointsOfInterest.id + '">No overlays selected</a>' +
            '</div>' +
          '' : '') +
          */
          '<img alt="Screenshot of ' + pretty + ' basemap." src="img/base-maps/' + id + '.png" style="height:152px;width:152px;">' +
          '<div class="caption">' +
            '<div class="checkbox-inline">' +
              '<label style="font-weight:normal;margin-bottom:0;">' +
                '<input type="checkbox">' +
                ' Add to map?' +
              '</label>' +
            '</div>' +
            '<div class="radio-inline">' +
              '<label style="font-weight:normal;margin-bottom:0;">' +
                '<input type="radio" name="default-basemap" onclick="Builder.ui.modal.editBaseMaps.handleRadio(this);">' +
                  ' Make default?' +
              '</label>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '';
  }
  function setHeight () {
    $('#modal-editBaseMaps .modal-body').css({
      height: $(document).height() - 180
    });
  }
  function submit () {
    var layers = [];

    if (!$checkbox.is(':checked')) {
      $.each($('#modal-editBaseMaps div.basemap'), function (i, div) {
        var id = div.id;
        var inputs = $(div).find('input');

        if ($(inputs[0]).prop('checked')) {
          var link = $(div).find('a');

          if (link.length) {
            var $link = $(link[0]);

            if ($link.html().indexOf('No') === -1) {
              var clone = $.extend({}, baseLayers.nps[id.replace('nps-', '')]);

              clone.id += ',' + $link.attr('id').replace('parktiles-overlays-link-', '');
              clone.popup = {
                title: '{{name}}'
              };

              if ($(inputs[1]).prop('checked')) {
                layers.unshift(clone);
              } else {
                layers.push(clone);
              }
            } else {
              if ($(inputs[1]).prop('checked')) {
                layers.unshift(id);
              } else {
                layers.push(id);
              }
            }
          } else {
            if ($(inputs[1]).prop('checked')) {
              layers.unshift(id);
            } else {
              layers.push(id);
            }
          }
        }
      });
    }

    NPMap.baseLayers = layers;
    Builder.updateMap();
    $modal.modal('hide');
  }
  function update () {
    $.each($('#modal-editBaseMaps div.basemap'), function (i, div) {
      var checked = false;
      var id = div.id;
      var link = $(div).find('.parktiles-overlays-link');

      // TODO: Maybe you should store the overlays in the baselayers preset in NPMap.js?

      // Rather than iterating through divs, should you iterate through NPMap.baseLayers?
      if (typeof id === 'string') {
        if ($.inArray(id, NPMap.baseLayers) !== -1) {
          checked = true;
        }
      }

      /*
      if (!checked) {
        // Now iterate through three Park Tiles basemaps, using the mapbox id, and check NPMap.baseLayers to see if they are objects
        $.each(NPMap.baseLayers, function(i, baseLayer) {
          if (typeof baseLayer === 'object') {
            console.log(baseLayer);
          }
        });
      }
      */

      $($(div).find('input')[0]).prop('checked', checked);

      if (link.length) {
        var $link = $(link[0]);

        if (checked) {
          $link.css('display', 'block');
        } else {
          $link.css('display', 'none');
        }
      }
    });

    if (!NPMap.baseLayers || NPMap.baseLayers.length === 0) {
      $checkbox
        .prop('checked', true)
        .trigger('change');
    } else {
      var active;

      for (var i = 0; i < NPMap.baseLayers.length; i++) {
        var baseLayer = NPMap.baseLayers[i];

        if (typeof baseLayer.visible === 'undefined' || baseLayer.visible === true) {
          active = baseLayer;
          break;
        }
      }

      $($('#' + active).find('input')[0]).prop('disabled', true);
      $($('#' + active).find('input')[1]).prop('checked', true);
    }
  }

  for (var provider in baseLayers) {
    if (provider !== 'openstreetmap') {
      var content = '';
      var maps = baseLayers[provider];
      var providerPretty = providers[provider] || provider;
      var map;

      content += '<div class="well"><h5>' + providerPretty + '</h5><div class="row">';

      if (provider === 'nps') {
        for (map in maps) {
          if (map === 'parkTiles') {
            content += createThumbnail(map, provider, providerPretty, true);
            break;
          }
        }

        for (map in maps) {
          if (map === 'parkTilesImagery') {
            content += createThumbnail(map, provider, providerPretty, true);
            break;
          }
        }

        for (map in maps) {
          if (map === 'parkTilesSlate') {
            content += createThumbnail(map, provider, providerPretty, true);
            break;
          }
        }

        for (map in maps) {
          if (map === 'parkTiles3') {
            content += createThumbnail(map, provider, providerPretty, true);
            break;
          }
        }

        for (map in maps) {
          if (map === 'parkTiles3Imagery') {
            content += createThumbnail(map, provider, providerPretty, true);
            break;
          }
        }

        for (map in maps) {
          if (map === 'parkTiles3Light') {
            content += createThumbnail(map, provider, providerPretty, true);
            break;
          }
        }

        for (map in maps) {
          if (map === 'parkTiles3Slate') {
            content += createThumbnail(map, provider, providerPretty, true);
            break;
          }
        }

        for (map in maps) {
          if (map !== 'darkStreets' && map.indexOf('parkTiles') === -1) {
            content += createThumbnail(map, provider, providerPretty);
          }
        }
      } else {
        for (map in maps) {
          content += createThumbnail(map, provider, providerPretty);
        }
      }

      content += '</div></div>';

      if (provider === 'nps') {
        html.unshift(content);
      } else {
        html.push(content);
      }
    }
  }

  $('#modal-editBaseMaps .btn-primary').on('click', submit);
  $('#modal-editBaseMaps .modal-body').append(html.join(''));
  $('#modal-editBaseMaps .parktiles-overlays-link')
    .click(function () {
      activeLink = $(this);
      $(this).popover('show');
    })
    .popover({
      container: 'body',
      content: '' +
        '<form id="parktiles-overlays-form" role="form" style="width:150px;">' +
          '<div class="checkbox">' +
            '<label><input type="checkbox">Points of Interest</label>' +
          '</div>' +
          '<div class="text-center">' +
            '<button class="btn btn-default" style="margin-right:5px;">Cancel</button>' +
            '<button class="btn btn-primary">Save</button>' +
          '</div>' +
        '</form>' +
      '',
      html: true,
      trigger: 'manual'
    })
    .on('hide.bs.popover', function () {
      $('#modal-editBaseMaps').css('z-index', 1050);
    })
    .on('show.bs.popover', function () {
      $('#modal-editBaseMaps').css('z-index', 1);
    })
    .on('shown.bs.popover', function () {
      if (activeLink.html().indexOf('No') === -1) {
        $('#parktiles-overlays-form input').prop('checked', true);
      }

      $('#parktiles-overlays-form .btn').click(function () {
        activeLink.popover('hide');
        return false;
      });
      $('#parktiles-overlays-form .btn-primary').click(function () {
        if ($('#parktiles-overlays-form input').prop('checked')) {
          activeLink.html('1 overlay selected');
        } else {
          activeLink.html('No overlays selected');
        }
      });
    });
  $('#modal-editBaseMaps .checkbox-inline input').change(function () {
    var link = $(this).parent().parent().parent().parent().find('.parktiles-overlays-link');

    if (link) {
      if ($(this).is(':checked')) {
        $(link[0]).show();
      } else {
        $(link[0]).hide();
      }
    }
  });
  $checkbox.change(function () {
    var checked = $(this).is(':checked');

    $('#modal-editBaseMaps .well').each(function () {
      var $this = $(this);

      if (checked) {
        $this.hide();
      } else {
        $this.show();
      }
    });

    if (!checked) {
      NPMap.baseLayers = [
        'nps-parkTiles'
      ];
      update();
    }
  });
  $modal
    .modal({
      backdrop: 'static',
      keyboard: false
    })
    .on('hide.bs.modal', function () {
      $('#modal-editBaseMaps .modal-body').scrollTop(0);
    });
  Builder.buildTooltips();
  setHeight();
  update();
  $(window).resize(setHeight);

  return {
    handleRadio: function (el) {
      var $checkbox = $($(el).parent().parent().prev().children().children()[0]);

      $.each($('#modal-editBaseMaps :checkbox'), function (i, checkbox) {
        $(checkbox).prop('disabled', false);
      });

      $checkbox.prop('checked', true).prop('disabled', true);
    }
  };
})();
