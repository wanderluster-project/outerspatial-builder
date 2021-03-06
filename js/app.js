/* globals $, tinycolor */

var outerspatialJsVersion = '4.0.2';
var alertify;
var Builder;
var mapId;
var moment;
var OuterSpatial;

function ready () {
  Builder = (function () {
    var $activeChangeStyleButton = null;
    var $buttonAddAnotherLayer = $('#button-addAnotherLayer');
    var $buttonCreateDatasetAgain = $('#button-createDatasetAgain');
    var $buttonEditBaseMapsAgain = $('#button-editBaseMapsAgain');
    var $buttonExport = $('#button-export');
    var $buttonSave = $('#button-save');
    var $iframe = $('#iframe-map');
    var $lat = $('#set-center-and-zoom .lat');
    var $lng = $('#set-center-and-zoom .lng');
    var $layers = $('#layers');
    var $modalConfirm = $('#modal-confirm');
    var $modalSignIn = $('#modal-signin');
    var $stepSection = $('section .step');
    var $ul = $('#layers');
    var $zoom = $('#set-center-and-zoom .zoom');
    var abcs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var $activeConfigureInteractivityButton;
    var colors = [];
    var description = null;
    var descriptionSet = false;
    var descriptionZ = null;
    var firstLoad = false;
    var optionsLettersAll = [];
    var optionsLettersFiltered = [];
    var optionsMaki = [];
    var optionsNpmapSymbolLibraryAll = [];
    var optionsNpmapSymbolLibraryFiltered = [];
    var optionsNumbersAll = [];
    var optionsNumbersFiltered = [];
    var settingsSet = false;
    var settingsZ = null;
    var stepLis = $('#steps li');
    var title = null;
    var titleSet = false;
    var titleZ = null;
    var $modalAddLayer;
    var $modalEditBaseMaps;
    var $modalExport;

    function disableSave () {
      $buttonSave.prop('disabled', true);
      $buttonExport.text('Export Map');
    }
    function enableSave () {
      $buttonSave.prop('disabled', false);
      $buttonExport.text('Save & Export Map');
    }
    function escapeHtml (unsafe) {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
        // .replace(/'/g, '&#039;');
    }
    function generateLayerChangeStyle (name, overlay) {
      var activePanelSet = false;
      var activeTabSet = false;
      var geometryTypes = overlay.L._geometryTypes || overlay.L.L._geometryTypes;
      var sortable;

      function getName (fieldName, geometryType) {
        if (overlay.type === 'cartodb') {
          return name + '_' + fieldName;
        } else {
          return name + '_' + geometryType + '_' + fieldName;
        }
      }
      function createPanel (id) {
        var empty = geometryTypes.indexOf(id) === -1;

        if (empty) {
          return '';
        } else {
          var panel = '<div class="tab-pane';

          if (!empty && !activePanelSet) {
            panel += ' active in';
            activePanelSet = true;
          }

          panel += '"';

          if (!empty) {
            panel += ' id="' + id + '"';
          }

          panel += '>';

          switch (id) {
            case 'line':
              panel += '' +
                '<fieldset>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('stroke', 'line') + '">Color</label>' +
                    '<div class="col-sm-6">' +
                      '<input class="form-control colorpicker" id="' + getName('stroke', 'line') + '"></input>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('stroke-width', 'line') + '">Width</label>' +
                    '<div class="col-sm-6">' +
                      '<select class="form-control" id="' + getName('stroke-width', 'line') + '">' +
                        '<option value="1">1 pt</option>' +
                        '<option value="2">2 pt</option>' +
                        '<option value="3">3 pt</option>' +
                        '<option value="4">4 pt</option>' +
                        '<option value="5">5 pt</option>' +
                        '<option value="6">6 pt</option>' +
                        '<option value="7">7 pt</option>' +
                        '<option value="8">8 pt</option>' +
                        '<option value="9">9 pt</option>' +
                        '<option value="10">10 pt</option>' +
                      '</select>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('stroke-opacity', 'line') + '">Opacity</label>' +
                    '<div class="col-sm-6">' +
                      '<select class="form-control" id="' + getName('stroke-opacity', 'line') + '">' +
                        '<option value="0">0</option>' +
                        '<option value="0.1">0.1</option>' +
                        '<option value="0.2">0.2</option>' +
                        '<option value="0.3">0.3</option>' +
                        '<option value="0.4">0.4</option>' +
                        '<option value="0.5">0.5</option>' +
                        '<option value="0.6">0.6</option>' +
                        '<option value="0.7">0.7</option>' +
                        '<option value="0.8">0.8</option>' +
                        '<option value="0.9">0.9</option>' +
                        '<option value="1">1</option>' +
                      '</select>' +
                    '</div>' +
                  '</div>' +
                '</fieldset>' +
              '';
              break;
            case 'point':
              if (overlay.type === 'cartodb') {
                panel += '' +
                  '<fieldset>' +
                    '<div class="form-group">' +
                      '<label class="col-sm-6 control-label" for="' + getName('marker-color', 'point') + '">Color</label>' +
                      '<div class="col-sm-6">' +
                        '<input class="form-control colorpicker" id="' + getName('marker-color', 'point') + '"></input>' +
                      '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                      '<label class="col-sm-6 control-label" for="' + getName('marker-size', 'point') + '">Size</label>' +
                      '<div class="col-sm-6">' +
                        '<select class="form-control" id="' + getName('marker-size', 'point') + '"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select>' +
                      '</div>' +
                    '</div>' +
                  '</fieldset>' +
                '';
              } else {
                panel += '' +
                  '<fieldset>' +
                    '<div class="form-group">' +
                      '<label class="col-sm-6 control-label" for="' + getName('marker-library', 'point') + '">Library</label>' +
                      '<div class="col-sm-6">' +
                        '<select class="form-control marker-library" id="' + getName('marker-library', 'point') + '" onchange="Builder.ui.steps.addAndCustomizeData.handlers.changeMarkerLibrary(this);return false;">' +
                          '<option value="letters">Letters</option>' +
                          '<option value="maki">Maki</option>' +
                          '<option value="npmapsymbollibrary">NPMap Symbol Library</option>' +
                          '<option value="numbers">Numbers</option>' +
                        '</select>' +
                      '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                      '<label class="col-sm-6 control-label" for="' + getName('marker-symbol', 'point') + '">Symbol</label>' +
                      '<div class="col-sm-6">' +
                        '<select class="form-control marker-symbol" id="' + getName('marker-symbol', 'point') + '"></select>' +
                      '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                      '<label class="col-sm-6 control-label" for="' + getName('marker-color', 'point') + '">Color</label>' +
                      '<div class="col-sm-6">' +
                        '<input class="form-control colorpicker" id="' + getName('marker-color', 'point') + '"></input>' +
                      '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                      '<label class="col-sm-6 control-label" for="' + getName('marker-size', 'point') + '">Size</label>' +
                      '<div class="col-sm-6">' +
                        '<select class="form-control" id="' + getName('marker-size', 'point') + '">' +
                          '<option value="small">Small</option>' +
                          '<option value="medium">Medium</option>' +
                          '<option value="large">Large</option>' +
                        '</select>' +
                      '</div>' +
                    '</div>' +
                  '</fieldset>' +
                '';
              }

              break;
            case 'polygon':
              panel += '' +
                '<fieldset>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('fill', 'polygon') + '">Color</label>' +
                    '<div class="col-sm-6">' +
                      '<input class="form-control colorpicker" id="' + getName('fill', 'polygon') + '" ></input>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('fill-opacity', 'polygon') + '">Opacity</label>' +
                    '<div class="col-sm-6">' +
                      '<select class="form-control" id="' + getName('fill-opacity', 'polygon') + '">' +
                        '<option value="0">0</option>' +
                        '<option value="0.1">0.1</option>' +
                        '<option value="0.2">0.2</option>' +
                        '<option value="0.3">0.3</option>' +
                        '<option value="0.4">0.4</option>' +
                        '<option value="0.5">0.5</option>' +
                        '<option value="0.6">0.6</option>' +
                        '<option value="0.7">0.7</option>' +
                        '<option value="0.8">0.8</option>' +
                        '<option value="0.9">0.9</option>' +
                        '<option value="1">1</option>' +
                      '</select>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('stroke', 'polygon') + '">Outline Color</label>' +
                    '<div class="col-sm-6">' +
                      '<input class="form-control colorpicker" id="' + getName('stroke', 'polygon') + '"></input>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('stroke-width', 'polygon') + '">Outline Width</label>' +
                    '<div class="col-sm-6">' +
                      '<select class="form-control" id="' + getName('stroke-width', 'polygon') + '">' +
                        '<option value="1">1 pt</option>' +
                        '<option value="2">2 pt</option>' +
                        '<option value="3">3 pt</option>' +
                        '<option value="4">4 pt</option>' +
                        '<option value="5">5 pt</option>' +
                        '<option value="6">6 pt</option>' +
                        '<option value="7">7 pt</option>' +
                        '<option value="8">8 pt</option>' +
                        '<option value="9">9 pt</option>' +
                        '<option value="10">10 pt</option>' +
                      '</select>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label class="col-sm-6 control-label" for="' + getName('stroke-opacity', 'polygon') + '">Outline Opacity</label>' +
                    '<div class="col-sm-6">' +
                      '<select class="form-control" id="' + getName('stroke-opacity', 'polygon') + '">' +
                        '<option value="0">0</option>' +
                        '<option value="0.1">0.1</option>' +
                        '<option value="0.2">0.2</option>' +
                        '<option value="0.3">0.3</option>' +
                        '<option value="0.4">0.4</option>' +
                        '<option value="0.5">0.5</option>' +
                        '<option value="0.6">0.6</option>' +
                        '<option value="0.7">0.7</option>' +
                        '<option value="0.8">0.8</option>' +
                        '<option value="0.9">0.9</option>' +
                        '<option value="1">1</option>' +
                      '</select>' +
                    '</div>' +
                  '</div>' +
                '</fieldset>' +
              '';
              break;
          }

          return panel + '</div>';
        }
      }
      function createTab (id, text) {
        var disabled = geometryTypes.indexOf(id) === -1;
        var active = !disabled && !activeTabSet;
        var tab = '<li class="';

        if (active) {
          tab += 'active ';
          activeTabSet = true;
        }

        if (disabled) {
          tab += 'disabled';
        }

        tab += '"><a href="';

        if (disabled) {
          tab += 'javascript:void(0);';
        } else {
          tab += '#' + id;
        }

        tab += '"';

        if (!disabled) {
          tab += ' data-toggle="tab"';
        }

        tab += '>' + text + '</a></li>';

        return tab;
      }
      function sort (a, b) {
        if (a.name < b.name) {
          return -1;
        }

        if (a.name > b.name) {
          return 1;
        }

        return 0;
      }

      if (!colors.length) {
        $.each(document.getElementById('iframe-map').contentWindow.L.outerspatial.preset.colors, function (prop, value) {
          // TODO: Use prop too.
          colors.push(value.color);
        });
      }

      if (!optionsMaki.length) {
        sortable = [];
        $.each(document.getElementById('iframe-map').contentWindow.L.outerspatial.preset.maki, function (prop, value) {
          sortable.push({
            icon: value.icon,
            name: value.name
          });
        });
        sortable.sort(sort);
        $.each(sortable, function (i, icon) {
          optionsMaki.push('<option value="' + icon.icon + '">' + icon.name + '</option>');
        });
      }

      if (!optionsNpmapSymbolLibraryAll.length) {
        var letters = [];
        var numbers = [];

        sortable = [];
        $.each(document.getElementById('iframe-map').contentWindow.L.outerspatial.preset.npmapsymbollibrary, function (prop, value) {
          var lower = value.name.toLowerCase();
          var obj = {
            icon: value.icon,
            name: value.name
          };

          if (lower.indexOf('letter') > -1) {
            letters.push(obj);
          } else if (lower.indexOf('number') > -1) {
            numbers.push(obj);
          } else {
            sortable.push(obj);
          }
        });
        letters.sort(sort);
        $.each(letters, function (i, icon) {
          optionsLettersAll.push('<option value="' + icon.icon + '">' + icon.name + '</option>');
        });
        numbers.sort(sort);
        $.each(numbers, function (i, icon) {
          optionsNumbersAll.push('<option value="' + icon.icon + '">' + icon.name + '</option>');
        });
        sortable.sort(sort);
        $.each(sortable, function (i, icon) {
          optionsNpmapSymbolLibraryAll.push('<option value="' + icon.icon + '">' + icon.name + '</option>');
        });
      }

      // TODO: If the overlay is clustered, add a "Cluster" tab.
      return '' +
        '<form class="change-style form-horizontal" id="' + name + '_layer-change-style" role="form">' +
          '<ul class="nav nav-tabs" style="padding-left:5px;">' +
            createTab('point', 'Point') +
            createTab('line', 'Line') +
            createTab('polygon', 'Polygon') +
          '</ul>' +
          '<div class="tab-content">' +
            createPanel('point') +
            createPanel('line') +
            createPanel('polygon') +
          '</div>' +
        '</form>' +
      '';
    }
    function getLayerIndexFromButton (el) {
      return $.inArray($(el).parent().parent().parent().prev().text(), abcs);
    }
    function getLeafletMap () {
      return document.getElementById('iframe-map').contentWindow.OuterSpatial.config.L;
    }
    function goToStep (from, to) {
      $($stepSection[from]).hide();
      $($stepSection[to]).show();
      $(stepLis[from]).removeClass('active');
      $(stepLis[to]).addClass('active');
    }
    function loadModule (module, callback) {
      module = module.replace('Builder.', '').replace(/\./g, '/');

      $.ajax({
        dataType: 'html',
        success: function (html) {
          $('body').append(html);
          $('head').append($('<link rel="stylesheet">').attr('href', module + '.css'));
          $.getScript(module + '.js', function () {
            if (callback) {
              callback();
            }
          });
        },
        url: module + '.html'
      });
    }
    function saveMap (callback) {
      if (window.location.host.indexOf('insidemaps') > -1) {
        var $this = $(this);

        Builder.showLoading();
        $this.blur();
        $.ajax({
          data: {
            description: description,
            isPublic: true,
            isShared: true,
            json: JSON.stringify(OuterSpatial),
            mapId: mapId || null,
            // TODO: Change "name" to "title" for consistency. Need to make this change serverside.
            name: title
          },
          dataType: 'json',
          error: function () {
            Builder.hideLoading();
            alertify.error('Sorry, there was an unhandled error while saving your map. Please try again.');

            if (typeof callback === 'function') {
              callback(false);
            }
          },
          success: function (response) {
            var error = 'Sorry, there was an unhandled error while saving your map. Please try again.';
            var success = false;

            Builder.hideLoading();

            if (response) {
              if (response.success === true) {
                if (!mapId && window.history.replaceState) {
                  var location = window.location;
                  var url = location.protocol + '//' + location.host + location.pathname + '?mapId=' + response.mapId;

                  window.history.replaceState({
                    path: url
                  }, '', url);
                }

                mapId = OuterSpatial.meta.mapId = response.mapId;
                updateSaveStatus(response.modified);
                alertify.success('Your map was saved!');
                success = true;
              } else if (response.success === false && response.error) {
                if (response.type === 'login') {
                  $modalSignIn.modal('show');
                } else {
                  alertify.error(response.error);
                }
              } else {
                alertify.error(error);
              }
            } else {
              alertify.error(error);
            }

            if (typeof callback === 'function') {
              callback(success);
            }
          },
          type: 'POST',
          url: '/builder/save/'
        });
      } else {
        alertify.error('Maps cannot be saved while using the OuterSpatial Builder demonstration.');
      }
    }
    function unescapeHtml (unsafe) {
      return unsafe
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
        // .replace(/&#039;/g, '\'');
    }
    function updateInitialCenterAndZoom () {
      $lat.html(OuterSpatial.center.lat.toFixed(2));
      $lng.html(OuterSpatial.center.lng.toFixed(2));
      $zoom.html(OuterSpatial.zoom);
    }
    function updateSaveStatus (date) {
      $('.info-saved p').text('Saved ' + moment(date).format('MM/DD/YYYY') + ' at ' + moment(date).format('h:mm:ssa'));
      $('.info-saved').show();
      disableSave();
    }

    $(document).ready(function () {
      if (mapId) {
        descriptionSet = true;
        settingsSet = true;
        titleSet = true;
      } else {
        setTimeout(function () {
          $('#metadata .title a').editable('toggle');
        }, 200);
      }
    });

    return {
      _afterUpdateCallbacks: {},
      _defaultStyles: {
        line: {
          'stroke': '#d39800',
          'stroke-opacity': 0.8,
          'stroke-width': 3
        },
        point: {
          'marker-color': '#000000',
          'marker-library': 'maki',
          'marker-size': 'medium',
          'marker-symbol': null
        },
        polygon: {
          'fill': '#d39800',
          'fill-opacity': 0.2,
          'stroke': '#d39800',
          'stroke-opacity': 0.8,
          'stroke-width': 3
        }
      },
      _defaultStylesCollapsed: {
        'fill': '#d39800',
        'fill-opacity': 0.2,
        'marker-color': '#000000',
        'marker-size': 'small',
        'stroke': '#d39800',
        'stroke-opacity': 0.8,
        'stroke-width': 3
      },
      ui: {
        app: {
          init: function () {
            var backButtons = $('section .step .btn-link');
            var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
            var eventer = window[eventMethod];
            var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
            var stepButtons = $('section .step .btn-primary');

            eventer(messageEvent, function (e) {
              if (e.data === 'logged_in') {
                $modalSignIn.modal('hide');
                alertify.log('You are now logged in. Please try to save again.', 'success', 6000);
              }
            }, false);

            /*
            Dropzone.options.dropzone = {
              accept: function (file, done) {
                console.log(file);
                done();
              },
              clickable: false,
              createImageThumbnails: false,
              maxFilesize: 5,
              uploadMultiple: false
            };
            */
            $modalSignIn.modal({
              backdrop: 'static',
              keyboard: false,
              show: false
            })
              .on('hidden.bs.modal', function () {
                $($('#modal-signin .modal-body')[0]).html(null);
              })
              .on('shown.bs.modal', function () {
                $($('#modal-signin .modal-body')[0]).html('<iframe id="iframe" src="https://insidemaps.nps.gov/account/logon/?iframe=true" style="height:202px;"></iframe>');
              });
            $(backButtons[0]).on('click', function () {
              goToStep(1, 0);
            });
            $(backButtons[1]).on('click', function () {
              goToStep(2, 1);
            });
            $(stepButtons[0]).on('click', function () {
              goToStep(0, 1);
            });
            $(stepButtons[1]).on('click', function () {
              goToStep(1, 2);
            });
            $.each(stepLis, function (i, li) {
              $(li.childNodes[0]).on('click', function () {
                var currentIndex = -1;

                for (var j = 0; j < stepLis.length; j++) {
                  if ($(stepLis[j]).hasClass('active')) {
                    currentIndex = j;
                    break;
                  }
                }

                if (currentIndex !== i) {
                  goToStep(currentIndex, i);
                }
              });
            });
          }
        },
        metadata: {
          init: function () {
            description = OuterSpatial.meta.description;
            firstLoad = true;
            title = OuterSpatial.meta.title;

            $('#metadata .description a').text(description).editable({
              animation: false,
              container: '#metadata div.info',
              emptytext: 'Add a description to give your map context.',
              validate: function (value) {
                if ($.trim(value) === '') {
                  return 'Please enter a description for your map.';
                }
              }
            })
              .on('hidden', function () {
                var newDescription = $('#metadata .description a').text();
                var next = $(this).next();

                if (descriptionSet) {
                  if (newDescription !== description) {
                    enableSave();
                  }
                } else {
                  $($('#button-settings span')[2]).popover('show');

                  next.css({
                    'z-index': descriptionZ
                  });
                  $(next.find('button')[1]).css({
                    display: 'block'
                  });
                  descriptionSet = true;

                  if (!settingsSet) {
                    next = $('#metadata .buttons .popover');
                    settingsZ = next.css('z-index');
                    next.css({
                      'z-index': 1031
                    });
                    $('#metadata .buttons .popover button').focus();
                  }
                }

                description = newDescription;
                OuterSpatial.meta.description = description;
              })
              .on('shown', function () {
                var next = $(this).parent().next();

                if (!descriptionSet) {
                  descriptionZ = next.css('z-index');
                  next.css({
                    'z-index': 1031
                  });
                  $(next.find('button')[1]).css({
                    display: 'none'
                  });
                }

                next.find('textarea').css({
                  'resize': 'none'
                });
              });
            $('#metadata .title a').text(title).editable({
              animation: false,
              emptytext: 'Untitled Map',
              validate: function (value) {
                if ($.trim(value) === '') {
                  return 'Please enter a title for your map.';
                }
              }
            })
              .on('hidden', function () {
                var newDescription = $('#metadata .description a').text();
                var newTitle = $('#metadata .title a').text();
                var next = $(this).next();

                if (!newDescription || newDescription === 'Add a description to give your map context.') {
                  $('#metadata .description a').editable('toggle');
                } else {
                  if (newTitle !== title) {
                    enableSave();
                  }
                }

                if (!titleSet) {
                  next.css({
                    'z-index': titleZ
                  });
                  $(next.find('button')[1]).css({
                    display: 'block'
                  });
                  titleSet = true;
                }

                title = newTitle;
                OuterSpatial.meta.title = title;
              })
              .on('shown', function () {
                var next = $(this).next();

                if (!titleSet) {
                  titleZ = next.css('z-index');
                  next.css({
                    'z-index': 1031
                  });
                  $(next.find('button')[1]).css({
                    display: 'none'
                  });
                }

                next.find('.editable-clear-x').remove();
                next.find('input').css({
                  'padding-right': '10px'
                });
              });
          },
          load: function () {
            if (OuterSpatial.description) {
              $('#metadata .description a').text(OuterSpatial.description);
            }

            if (OuterSpatial.name) {
              $('#metadata .title a').text(OuterSpatial.name);
            }

            updateSaveStatus(OuterSpatial.modified);
          }
        },
        steps: {
          addAndCustomizeData: {
            handlers: {
              cancelApplyInteractivity: function () {
                $activeConfigureInteractivityButton.popover('toggle');
                $('#mask').hide();
              },
              cancelApplyStyles: function () {
                $activeChangeStyleButton.popover('toggle');
                $('#mask').hide();
              },
              changeCartoDbHasPoints: function (el) {
                var $el = $(el);
                var $next = $($el.parent().parent().next());
                var $popover = $next.parents('.popover');

                if ($el.prop('checked')) {
                  if ($next.is(':hidden')) {
                    $next.show();
                    $popover.css({
                      top: (parseInt($popover.css('top').replace('px', ''), 10) - $next.outerHeight() + 45) + 'px'
                    });
                  }
                } else {
                  if ($next.is(':visible')) {
                    $popover.css({
                      top: (parseInt($popover.css('top').replace('px', ''), 10) + $next.outerHeight() - 45) + 'px'
                    });
                    $next.hide();
                  }
                }
              },
              changeEnableTooltips: function (el) {
                var $el = $(el);
                var $tip = $($($el.parent().parent().next().children('input')[0])[0]);
                var checked = $el.prop('checked');

                $tip.prop('disabled', !checked);

                if (!checked) {
                  $tip.val('');
                }
              },
              changeMarkerLibrary: function (el) {
                var $el = $('#' + el.id.replace('_marker-library', '') + '_marker-symbol');
                var value = $(el).val();

                switch (value) {
                  case 'letters':
                    $el.html(optionsLettersFiltered.join(''));
                    break;
                  case 'maki':
                    $el.html(optionsMaki.join(''));
                    break;
                  case 'npmapsymbollibrary':
                    $el.html(optionsNpmapSymbolLibraryFiltered.join(''));
                    break;
                  case 'numbers':
                    $el.html(optionsNumbersFiltered.join(''));
                    break;
                }

                $el.val(null);
              },
              clickApplyInteractivity: function (elName) {
                var d = $('#' + elName + '_description').val();
                var index = parseInt(elName.replace('overlay-index-', ''), 10);
                var overlay = OuterSpatial.overlays[index];
                var popup = {};
                var t = $('#' + elName + '_title').val();
                var tooltip = $('#' + elName + '_tooltip').val();

                if (d) {
                  popup.description = escapeHtml(d);
                }

                if (t) {
                  popup.title = escapeHtml(t);
                }

                if (!popup.description && !popup.title && typeof popup.max !== 'number' && typeof popup.min !== 'number') {
                  delete overlay.popup;
                } else {
                  overlay.popup = popup;
                }

                if (tooltip) {
                  overlay.tooltip = escapeHtml(tooltip);
                } else {
                  delete overlay.tooltip;
                }

                $activeConfigureInteractivityButton.popover('toggle');
                $('#mask').hide();
                Builder.updateMap();
              },
              clickApplyStyles: function (elName) {
                var overlay = OuterSpatial.overlays[parseInt(elName.replace('overlay-index-', ''), 10)];
                var updated = {};

                $.each($('#' + elName + '_layer-change-style input, #' + elName + '_layer-change-style select'), function (i, el) {
                  var $field = $(el);
                  var split = $field.attr('id').split('_');
                  var property = split[split.length - 1];
                  var value = $field.val();

                  if (overlay.type === 'cartodb') {
                    updated[property] = value;
                  } else {
                    var type = split[split.length - 2];

                    if (property === 'marker-library' && (value === 'letters' || value === 'numbers')) {
                      value = 'npmapsymbollibrary';
                    }

                    if (!updated[type]) {
                      updated[type] = {};
                    }

                    updated[type][property] = value;
                  }
                });
                overlay.styles = updated;
                $activeChangeStyleButton.popover('toggle');
                $('#mask').hide();
                Builder.updateMap();
              },
              clickLayerChangeStyle: function (el) {
                var $el = $(el);

                if ($el.data('popover-created')) {
                  $el.popover('toggle');
                } else {
                  var index = getLayerIndexFromButton(el);
                  var layer = document.getElementById('iframe-map').contentWindow.OuterSpatial.config.overlays[index];
                  var name = 'overlay-index-' + index;
                  var overlay = OuterSpatial.overlays[index];

                  $el.popover({
                    animation: false,
                    container: 'body',
                    content: '' +
                      generateLayerChangeStyle(name, layer) +
                      '<div style="text-align:center;">' +
                        '<button class="btn btn-primary" onclick="Builder.ui.steps.addAndCustomizeData.handlers.clickApplyStyles(\'' + name + '\');" type="button">Apply</button>' +
                        '<button class="btn btn-default" onclick="Builder.ui.steps.addAndCustomizeData.handlers.cancelApplyStyles();" style="margin-left:5px;">Cancel</button>' +
                      '</div>' +
                    '',
                    html: true,
                    placement: 'right',
                    title: null,
                    trigger: 'manual'
                  })
                    .on('hide.bs.popover', function () {
                      $activeChangeStyleButton = null;
                    })
                    .on('shown.bs.popover', function () {
                      var styles = overlay.styles;
                      var $field, prop, style, type, value;

                      $activeChangeStyleButton = $el;
                      $('#mask').show();
                      $.each($('#' + name + '_layer-change-style .colorpicker'), function (i, el) {
                        var $el = $(el);
                        var obj = {
                          customswatches: false,
                          hsvpanel: true,
                          previewformat: 'hex',
                          size: 'sm',
                          sliders: false,
                          swatches: colors
                        };

                        if (overlay.type !== 'cartodb' && $el.attr('id').toLowerCase().indexOf('marker-color') > -1) {
                          obj.onchange = function (container, color) {
                            Builder.ui.steps.addAndCustomizeData.filterColors(color);
                          };
                        }

                        $(el).ColorPickerSliders(obj);
                      });

                      if (overlay.type === 'cartodb') {
                        for (prop in styles) {
                          $field = $('#' + name + '_' + prop);

                          if ($field) {
                            value = overlay.styles[prop];

                            if (prop === 'fill' || prop === 'marker-color' || prop === 'stroke') {
                              $field.trigger('colorpickersliders.updateColor', value);
                            } else {
                              $field.val(value);
                            }
                          }
                        }
                      } else {
                        for (type in styles) {
                          style = styles[type];

                          for (prop in style) {
                            $field = $('#' + name + '_' + type + '_' + prop);

                            if ($field) {
                              value = style[prop];

                              if (prop === 'fill' || prop === 'marker-color' || prop === 'stroke') {
                                $field.trigger('colorpickersliders.updateColor', value);
                              } else if (prop === 'marker-library') {
                                var symbol = style['marker-symbol'];

                                if (typeof symbol === 'string') {
                                  if (symbol.indexOf('letter') > -1) {
                                    $field.val('letters');
                                  } else if (symbol.indexOf('number') > -1) {
                                    $field.val('numbers');
                                  } else {
                                    $field.val(value);
                                  }
                                } else {
                                  $field.val(value);
                                }
                              } else {
                                if (prop === 'marker-symbol') {
                                  if (style['marker-library'] === 'maki') {
                                    $field.html(optionsMaki);
                                  } else {
                                    Builder.ui.steps.addAndCustomizeData.filterColors(style['marker-color']);

                                    if (typeof value === 'string') {
                                      if (value.indexOf('letter') > -1) {
                                        $field.html(optionsLettersFiltered.join(''));
                                      } else if (value.indexOf('number') > -1) {
                                        $field.html(optionsNumbersFiltered.join(''));
                                      } else {
                                        $field.html(optionsNpmapSymbolLibraryFiltered.join(''));
                                      }
                                    } else {
                                      $field.html(optionsNpmapSymbolLibraryFiltered.join(''));
                                    }
                                  }

                                  $field.val(value);
                                } else {
                                  $field.val(value);
                                }
                              }
                            }
                          }
                        }
                      }
                    });
                  $el.popover('show');
                  $('.popover.right.in').css({
                    'z-index': 1031
                  });
                  $el.data('popover-created', true);
                  $activeChangeStyleButton = $el;
                }
              },
              clickLayerConfigureInteractivity: function (el) {
                var $el = $(el);

                if ($el.data('popover-created')) {
                  $el.popover('toggle');
                } else {
                  var index = getLayerIndexFromButton(el);
                  var overlay = OuterSpatial.overlays[index];
                  var name = 'overlay-index-' + index;
                  var supportsTooltips = (overlay.type === 'cartodb' || overlay.type === 'csv' || overlay.type === 'geojson' || overlay.type === 'kml' || overlay.type === 'mapbox');
                  var html;

                  html = '' +
                    // Checkbox here "Display all fields in a table?" should be checked on by default.
                    '<form class="configure-interactivity" id="' + name + '_layer-configure-interactivity" role="form">' +
                      '<fieldset>' +
                        '<div class="form-group">' +
                          // '<span><label for="' + name + '_title">Title</label><a href="https://www.nps.gov/npmap/tools/npmap-builder/docs/popups-and-tooltips/" target="_blank"><img data-container="body" data-placement="bottom" rel="tooltip" src="img/help@2x.png" style="cursor:pointer;float:right;height:18px;" title="The title will display in bold at the top of the popup. HTML and Handlebars templates are allowed. Click for more info."></a></span>' +
                          '<input class="form-control" id="' + name + '_title" rows="3" type="text"></input>' +
                        '</div>' +
                        '<div class="form-group">' +
                          // '<span><label for="' + name + '_description">Description</label><a href="https://www.nps.gov/npmap/tools/npmap-builder/docs/popups-and-tooltips/" target="_blank"><img data-container="body" data-placement="bottom" rel="tooltip" src="img/help@2x.png" style="cursor:pointer;float:right;height:18px;" title="The description will display underneath the title. HTML and Handlebars templates are allowed. Click for more info."></a></span>' +
                          '<textarea class="form-control" id="' + name + '_description" rows="4"></textarea>' +
                        '</div>' +
                        (supportsTooltips ? '' +
                          '<div class="checkbox">' +
                            '<label>' +
                              '<input onchange="Builder.ui.steps.addAndCustomizeData.handlers.changeEnableTooltips(this);return false;" type="checkbox" value="tooltips"> Enable tooltips?' +
                            '</label>' +
                          '</div>' +
                          '<div class="form-group">' +
                            // '<span><label for="' + name + '_tooltip">Tooltip</label><a href="https://www.nps.gov/npmap/tools/npmap-builder/docs/popups-and-tooltips/" target="_blank"><img data-container="body" data-placement="bottom" rel="tooltip" src="img/help@2x.png" style="cursor:pointer;float:right;height:18px;" title="Tooltips display when the cursor moves over a shape. HTML and Handlebars templates are allowed. Click for more info."></a></span>' +
                            '<input class="form-control" id="' + name + '_tooltip" type="text" disabled></input>' +
                          '</div>' +
                        '' : '') +
                      '</fieldset>' +
                    '</form>' +
                    '<div style="text-align:center;">' +
                      '<button class="btn btn-primary" onclick="Builder.ui.steps.addAndCustomizeData.handlers.clickApplyInteractivity(\'' + name + '\');" type="button">Apply</button><button class="btn btn-default" onclick="Builder.ui.steps.addAndCustomizeData.handlers.cancelApplyInteractivity();" style="margin-left:5px;">Cancel</button>' +
                    '</div>' +
                  '';

                  $el.popover({
                    animation: false,
                    container: 'body',
                    content: html,
                    html: true,
                    placement: 'right',
                    title: null,
                    trigger: 'manual'
                  })
                    .on('hide.bs.popover', function () {
                      $activeConfigureInteractivityButton = null;
                    })
                    .on('shown.bs.popover', function () {
                      var config;

                      overlay = OuterSpatial.overlays[getLayerIndexFromButton(el)];
                      config = overlay.popup;
                      $activeConfigureInteractivityButton = $el;
                      $('#mask').show();

                      if (config) {
                        if (typeof config === 'object') {
                          if (typeof config.description === 'string') {
                            $('#' + name + '_description').val(unescapeHtml(config.description));
                          }

                          if (typeof config.title === 'string') {
                            $('#' + name + '_title').val(unescapeHtml(config.title));
                          }

                          if (typeof config.width === 'number') {
                            $('#' + name + '_autoWidth').prop('checked', false).trigger('change');
                            $('#' + name + '_fixedWidth').val(config.width);
                          }
                        } else if (typeof config === 'string') {
                          // TODO: Legacy. Can be taken out when all maps are using objects to configure popups.
                          var div = document.createElement('div');
                          var t;

                          div.innerHTML = unescapeHtml(config);

                          for (var i = 0; i < div.childNodes.length; i++) {
                            var $childNode = $(div.childNodes[i]);

                            if ($childNode.hasClass('title')) {
                              t = $childNode.html();
                            }
                          }

                          if (t) {
                            $('#' + name + '_title').val(t);
                          }
                        }

                        config = overlay.tooltip;

                        if (config) {
                          $($('#' + name + '_layer-configure-interactivity .checkbox input')[0]).prop('checked', true).trigger('change');
                          $('#' + name + '_tooltip').val(unescapeHtml(config));
                        }
                      }

                      Builder.buildTooltips();
                    });
                  $el.popover('show');
                  $('.popover.right.in').css({
                    'z-index': 1031
                  });
                  $el.data('popover-created', true);
                  $activeConfigureInteractivityButton = $el;
                }
              },
              clickLayerEdit: function (el) {
                var index = getLayerIndexFromButton(el);

                function callback () {
                  Builder.ui.modal.addLayer._load(OuterSpatial.overlays[index]);
                  Builder.ui.modal.addLayer._editingIndex = index;
                  $modalAddLayer.off('shown.bs.modal', callback);
                }

                if ($modalAddLayer) {
                  $modalAddLayer
                    .on('shown.bs.modal', callback)
                    .modal('show');
                } else {
                  Builder._pendingLayerEditIndex = index;
                  loadModule('Builder.ui.modal.addLayer', function () {
                    $modalAddLayer = $('#modal-addLayer');
                    callback();
                  });
                }
              },
              clickLayerRemove: function (el) {
                Builder.showConfirm('Yes, remove the overlay', 'Once the overlay is removed, you cannot get it back.', 'Are you sure?', function () {
                  Builder.ui.steps.addAndCustomizeData.removeLi(el);
                  Builder.removeOverlay(getLayerIndexFromButton(el));
                });
              }
            },
            filterColors: function (color) {
              var $icon = $('.marker-symbol');
              var keep = (tinycolor(color).isDark() ? 'White' : 'Black');
              var remove = keep === 'White' ? 'black' : 'white';
              var value = $icon.val();

              optionsLettersFiltered = [];
              optionsNpmapSymbolLibraryFiltered = [];
              optionsNumbersFiltered = [];

              $.each(optionsLettersAll, function (i, option) {
                if (option.indexOf(keep) > -1) {
                  optionsLettersFiltered.push(option.replace('Letter \'', '').replace('\' (' + keep + ')', ''));
                }
              });
              $.each(optionsNpmapSymbolLibraryAll, function (i, option) {
                if (option.indexOf(keep) > -1) {
                  optionsNpmapSymbolLibraryFiltered.push(option.replace(' (' + keep + ')', ''));
                }
              });
              $.each(optionsNumbersAll, function (i, option) {
                if (option.indexOf(keep) > -1) {
                  optionsNumbersFiltered.push(option.replace('Number \'', '').replace('\' (' + keep + ')', ''));
                }
              });

              switch ($('.marker-library').val().toLowerCase()) {
                case 'letters':
                  $icon.html(optionsLettersFiltered.join(''));
                  break;
                case 'npmapsymbollibrary':
                  $icon.html(optionsNpmapSymbolLibraryFiltered.join(''));
                  break;
                case 'numbers':
                  $icon.html(optionsNumbersFiltered.join(''));
                  break;
              }

              if (value) {
                $icon.val(value.replace(remove, keep.toLowerCase()));
              }
            },
            init: function () {
              $('.dd').nestable({
                handleClass: 'letter',
                listNodeName: 'ul'
              })
                .on('change', function () {
                  var children = $ul.children();
                  var overlays = [];

                  if (children.length > 1) {
                    $.each(children, function (i, li) {
                      var from = $.inArray($($(li).children('.letter')[0]).text(), abcs);

                      if (from !== i) {
                        overlays.splice(i, 0, OuterSpatial.overlays[from]);
                      } else {
                        overlays.push(OuterSpatial.overlays[from]);
                      }
                    });

                    if (overlays.length) {
                      OuterSpatial.overlays = overlays;
                      Builder.updateMap();
                    }

                    Builder.ui.steps.addAndCustomizeData.refreshUl();
                  }
                });
              $('#button-addAnotherLayer, #button-addLayer').on('click', function () {
                if ($modalAddLayer) {
                  $modalAddLayer.modal('show');
                } else {
                  loadModule('Builder.ui.modal.addLayer', function () {
                    $modalAddLayer = $('#modal-addLayer');
                  });
                }
              });
              $('#button-createDataset, #button-createDatasetAgain').on('click', function () {
                alertify.log('The create dataset functionality is not quite ready. Please check back soon.', 'info', 15000);
              });
              $('#button-editBaseMaps, #button-editBaseMapsAgain').on('click', function () {
                if ($modalEditBaseMaps) {
                  $modalEditBaseMaps.modal('show');
                } else {
                  loadModule('Builder.ui.modal.editBaseMaps', function () {
                    $modalEditBaseMaps = $('#modal-editBaseMaps');
                  });
                }
              });
            },
            load: function () {
              if ($.isArray(OuterSpatial.overlays)) {
                $.each(OuterSpatial.overlays, function (i, overlay) {
                  Builder.ui.steps.addAndCustomizeData.overlayToLi(overlay);
                });
              }
            },
            overlayToLi: function (overlay) {
              var interactive = (overlay.type !== 'tiled' && (typeof overlay.clickable === 'undefined' || overlay.clickable === true));
              var styleable = (overlay.type === 'cartodb' || overlay.type === 'csv' || overlay.type === 'geojson' || overlay.type === 'kml' || overlay.type === 'spot');
              var index;

              if (!$layers.is(':visible')) {
                $layers.prev().hide();
                $('#customize .content').css({
                  padding: 0
                });
                $layers.show();
              }

              index = $layers.children().length;
              $layers.append($('<li class="dd-item">').html('' +
                '<div class="letter">' + abcs[index] + '</div>' +
                '<div class="details">' +
                  '<span class="name">' + overlay.name + '</span>' +
                  '<span class="description">' + (overlay.description || '') + '</span>' +
                  '<div class="actions">' +
                    '<div style="float:left;">' +
                      '<button class="btn btn-default btn-xs" data-container="section" onclick="Builder.ui.steps.addAndCustomizeData.handlers.clickLayerEdit(this);" type="button">' +
                        '<span class="fa fa-edit"> Edit</span>' +
                      '</button>' +
                    '</div>' +
                    '<div style="float:right;">' +
                      '<button class="btn btn-default btn-xs interactivity" data-container="section" data-placement="bottom" onclick="Builder.ui.steps.addAndCustomizeData.handlers.clickLayerConfigureInteractivity(this);" rel="tooltip" style="' + (interactive ? '' : 'display:none;') + 'margin-right:5px;" title="Configure Interactivity" type="button">' +
                        '<span class="fa fa-comment"></span>' +
                      '</button>' +
                      '<button class="btn btn-default btn-xs" data-container="section" data-placement="bottom" onclick="Builder.ui.steps.addAndCustomizeData.handlers.clickLayerChangeStyle(this);" rel="tooltip" style="' + (styleable ? '' : 'display:none;') + 'margin-right:5px;" title="Change Style" type="button">' +
                        '<span class="fa fa-map-marker"></span>' +
                      '</button>' +
                      '<button class="btn btn-default btn-xs" data-container="section" data-placement="bottom" onclick="Builder.ui.steps.addAndCustomizeData.handlers.clickLayerRemove(this);" rel="tooltip" title="Delete Overlay" type="button">' +
                        '<span class="fa fa-trash-o"></span>' +
                      '</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              ''));
              Builder.ui.steps.addAndCustomizeData.refreshUl();
            },
            refreshUl: function () {
              var children = $ul.children();
              var previous = $ul.parent().prev();

              if (children.length === 0) {
                $buttonAddAnotherLayer.hide();
                $buttonCreateDatasetAgain.hide();
                $buttonEditBaseMapsAgain.hide();
                previous.show();
              } else {
                $buttonAddAnotherLayer.show();
                $buttonCreateDatasetAgain.show();
                $buttonEditBaseMapsAgain.show();
                previous.hide();
                $.each(children, function (i, li) {
                  $($(li).children('.letter')[0]).text(abcs[i]);
                });
              }
            },
            removeLi: function (el) {
              $($(el).parents('li')[0]).remove();
              Builder.ui.steps.addAndCustomizeData.refreshUl();
            },
            updateOverlayLetters: function () {}
          },
          setCenterAndZoom: {
            init: function () {
              var buttonBlocks = $('#set-center-and-zoom .btn-block');

              $(buttonBlocks[0]).on('click', function () {
                var center = getLeafletMap().getCenter();

                OuterSpatial.center = {
                  lat: center.lat,
                  lng: center.lng
                };
                updateInitialCenterAndZoom();
                Builder.updateMap();
              });
              $(buttonBlocks[1]).on('click', function () {
                OuterSpatial.zoom = getLeafletMap().getZoom();
                updateInitialCenterAndZoom();
                Builder.updateMap();
              });
              $(buttonBlocks[2]).on('click', function () {
                var map = getLeafletMap();
                var center = map.getCenter();

                OuterSpatial.center = {
                  lat: center.lat,
                  lng: center.lng
                };
                OuterSpatial.zoom = map.getZoom();

                updateInitialCenterAndZoom();
                Builder.updateMap();
              });
              $(buttonBlocks[3]).on('click', function () {
                var $this = $(this);

                if ($this.hasClass('active')) {
                  delete OuterSpatial.maxBounds;
                  $this.removeClass('active').text('Restrict Bounds');
                  $this.next().hide();
                } else {
                  var bounds = getLeafletMap().getBounds();
                  var northEast = bounds.getNorthEast();
                  var southWest = bounds.getSouthWest();

                  OuterSpatial.maxBounds = [
                    [southWest.lat, southWest.lng],
                    [northEast.lat, northEast.lng]
                  ];

                  $(this).addClass('active').text('Remove Bounds Restriction');
                  $this.next().show();
                }

                Builder.updateMap();
              });
              $('#set-zoom').slider({
                // center: 4,
                max: 19,
                min: 0,
                value: [typeof OuterSpatial.minZoom === 'number' ? OuterSpatial.minZoom : 0, typeof OuterSpatial.maxZoom === 'number' ? OuterSpatial.maxZoom : 19]
              })
                .on('slideStop', function (e) {
                  OuterSpatial.maxZoom = e.value[1];
                  OuterSpatial.minZoom = e.value[0];
                  Builder.updateMap();
                });
            },
            load: function () {
              updateInitialCenterAndZoom();

              if (typeof OuterSpatial.maxBounds === 'object') {
                var $bounds = $($('#set-center-and-zoom .btn-block')[3]);

                $bounds.addClass('active').text('Remove Bounds Restriction');
                $bounds.next().show();
              }
            }
          },
          toolsAndSettings: {
            init: function () {
              $.each($('#tools-and-settings form'), function (i, form) {
                $.each($(form).find('input'), function (j, input) {
                  $(input).on('change', function () {
                    var checked = $(this).prop('checked');
                    var value = this.value;

                    if (value === 'overviewControl') {
                      if (checked) {
                        OuterSpatial[value] = {
                          layer: (function () {
                            for (var i = 0; i < OuterSpatial.baseLayers.length; i++) {
                              var baseLayer = OuterSpatial.baseLayers[0];

                              if (typeof baseLayer.visible === 'undefined' || baseLayer.visible === true) {
                                return baseLayer;
                              }
                            }
                          })()
                        };
                      } else {
                        OuterSpatial[value] = false;
                      }
                    } else {
                      OuterSpatial[value] = checked;
                    }

                    Builder.updateMap();
                  });
                });
              });
            },
            load: function () {
              $.each($('#tools-and-settings form'), function (i, form) {
                $.each($(form).find('input'), function (j, input) {
                  var $input = $(input);
                  var name = $input.attr('value');
                  var property = OuterSpatial[name];

                  if (typeof property !== 'undefined') {
                    $input.attr('checked', property);
                  }
                });
              });
            }
          }
        },
        toolbar: {
          handlers: {
            clickSettings: function (el) {
              $(el).parents('.popover').css({
                'z-index': settingsZ
              });
              $('#mask').hide();
              $($('#button-settings span')[2]).popover('hide');
              settingsSet = true;
            }
          },
          init: function () {
            $buttonExport.on('click', function () {
              function openExport () {
                if ($modalExport) {
                  $modalExport.modal('show');
                } else {
                  loadModule('Builder.ui.modal.export', function () {
                    $modalExport = $('#modal-export');
                  });
                }
              }

              if ($(this).text().indexOf('Save') === -1) {
                openExport();
              } else {
                saveMap(function (success) {
                  if (mapId) {
                    if (!success) {
                      alertify.log('Because your map couldn\'t be saved, but was successfully saved at one point, any exports you do here will not include any changes made to the map since the last time it was saved.', 'error', 15000);
                    }

                    openExport();
                  } else {
                    alertify.log('The map cannot be exported until it is saved. Please try again. If this error persists, please report an issue by clicking on "Submit Feedback" below.', 'error', 15000);
                  }
                });
              }
            });
            $('#button-config').on('click', function () {
              loadModule('Builder.ui.modal.viewConfig', function () {});
            });
            $('#button-refresh').on('click', function () {
              Builder.updateMap(null, true);
            });
            $('#button-save').on('click', saveMap);
            $('#button-settings').on('click', function () {
              var $this = $(this);
              var $span = $($this.children('span')[2]);

              if ($this.hasClass('active')) {
                $span.popover('hide');
                $this.removeClass('active');
              } else {
                $span.popover('show');
                $this.addClass('active');
              }
            });
            $($('#button-settings span')[2]).popover({
              animation: false,
              container: '#metadata .buttons',
              content: '<div class="checkbox"><label><input type="checkbox" value="public" checked="checked" disabled>Is this map public?</label></div><div class="checkbox"><label><input type="checkbox" value="shared" checked="checked" disabled>Share this map with others?</label></div><div style="text-align:center;"><button type="button" class="btn btn-primary" onclick="Builder.ui.toolbar.handlers.clickSettings(this);">Acknowledge</button></div>',
              html: true,
              placement: 'bottom',
              trigger: 'manual'
            })
              .on('shown.bs.popover', function () {
                if (settingsSet) {
                  $('#metadata .buttons .popover .btn-primary').hide();
                }
              });
          }
        }
      },
      addOverlay: function (overlay) {
        OuterSpatial.overlays.push(overlay);
        Builder.ui.steps.addAndCustomizeData.overlayToLi(overlay);
      },
      buildTooltips: function () {
        $('[rel=tooltip]').tooltip({
          animation: false
        });
      },
      // TODO: Preserving private method for now, should migrate all calls to this global method though.
      enableSave: enableSave,
      hideLoading: function () {
        $('#loading').hide();
        document.body.removeChild(document.getElementById('loading-backdrop'));
      },
      removeOverlay: function (index) {
        OuterSpatial.overlays.splice(index, 1);
        this.updateMap();
      },
      showConfirm: function (button, content, t, callback) {
        $($modalConfirm.find('.btn-primary')[0]).html(button).on('click', function () {
          $modalConfirm.modal('hide');
          callback();
        });
        $($modalConfirm.find('.modal-body')[0]).html(content);
        $($modalConfirm.find('h4')[0]).html(t);
        $modalConfirm.modal('show');
      },
      showLoading: function () {
        var div = document.createElement('div');
        div.className = 'modal-backdrop in';
        div.id = 'loading-backdrop';
        document.body.appendChild(div);
        $('#loading').show();
      },
      updateMap: function (callback, manualRefresh) {
        var interval;

        $iframe.attr('src', 'iframe.html?v=' + outerspatialJsVersion);

        interval = setInterval(function () {
          var outerspatial = document.getElementById('iframe-map').contentWindow.OuterSpatial;

          if (outerspatial && outerspatial.config && outerspatial.config.L) {
            clearInterval(interval);

            if (typeof callback === 'function') {
              callback(outerspatial.config);
            }

            if (!manualRefresh) {
              if (firstLoad) {
                firstLoad = false;
              } else {
                enableSave();
              }
            }
          }
        }, 0);
      }
    };
  })();

  Builder.ui.app.init();
  Builder.ui.metadata.init();
  Builder.ui.steps.addAndCustomizeData.init();
  Builder.ui.steps.setCenterAndZoom.init();
  Builder.ui.steps.toolsAndSettings.init();
  Builder.ui.toolbar.init();

  if (mapId) {
    Builder.ui.metadata.load();
    Builder.ui.steps.addAndCustomizeData.load();
    Builder.ui.steps.toolsAndSettings.load();
    Builder.ui.steps.setCenterAndZoom.load();
    delete OuterSpatial.created;
    delete OuterSpatial.isPublic;
    delete OuterSpatial.isShared;
    delete OuterSpatial.modified;
    delete OuterSpatial.tags;
  }

  Builder.buildTooltips();
  Builder.updateMap();
}

mapId = (function () {
  var search = document.location.search.replace('&?', '');
  var id = null;

  if (search.indexOf('?') === 0) {
    search = search.slice(1, search.length);
  }

  search = search.split('&');

  for (var i = 0; i < search.length; i++) {
    var param = search[i].split('=');

    if (param[0].toLowerCase() === 'mapid') {
      id = param[1];
      break;
    }
  }

  return id;
})();

if (mapId) {
  var msg = 'The specified map could not be loaded. Please refresh the page.';

  $.ajax({
    dataType: 'jsonp',
    error: function () {
      window.alert(msg);
    },
    jsonpCallback: 'callback',
    success: function (response) {
      if (response) {
        var version = '2.0.1';

        OuterSpatial = response;

        if (OuterSpatial.meta) {
          if (OuterSpatial.meta.outerspatialJsVersion) {
            version = OuterSpatial.meta.outerspatialJsVersion;
          }
        } else {
          OuterSpatial.meta = {};
        }

        if (parseInt(version.charAt(0), 10) < parseInt(outerspatialJsVersion.charAt(0), 10)) {
          // Migrate from OuterSpatial.js 2.x to 3.x
          if (OuterSpatial.overlays) {
            $.each(OuterSpatial.overlays, function (i, overlay) {
              if (overlay.styles && overlay.styles.point && overlay.styles.point['marker-library'] && overlay.styles.point['marker-library'] === 'npmaki') {
                overlay.styles.point['marker-library'] = 'npmapsymbollibrary';
              }
            });
          }

          if (OuterSpatial.description) {
            OuterSpatial.meta.description = OuterSpatial.description;
            delete OuterSpatial.description;
          }

          if (OuterSpatial.mapId) {
            OuterSpatial.meta.mapId = OuterSpatial.mapId;
            delete OuterSpatial.mapId;
          }

          if (OuterSpatial.name) {
            OuterSpatial.meta.title = OuterSpatial.name;
            delete OuterSpatial.name;
          }

          $('body').append('' +
            '<div class="modal" id="modal-upgrade" tabindex="-1" role="dialog" aria-hidden="true">' +
              '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                  '<div class="modal-body">' +
                    '<p>Builder has upgraded your map to the latest version of OuterSpatial.js, ' + outerspatialJsVersion + '. Most automated upgrades work perfectly. We ask, however, that you test your map\'s functionality before saving to ensure that everything has been migrated properly.</p><p>If everything looks good, go ahead and save the map. If, on the other hand, you run into issues, click the "Submit Feedback" link at the bottom of the window and the NPMap team will manually upgrade your map.</p><p>When testing your map, focus on the following functionality:</p><ul><li>Verify that any point symbology you setup on your map\'s overlay(s) is still working properly</li></ul>' +
                  '</div>' +
                  '<div class="modal-footer">' +
                    '<button class="btn btn-primary" data-dismiss="modal" type="button">OK</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '');
          $('#modal-upgrade').modal({
            backdrop: 'static',
            keyboard: false
          }).on('hide.bs.modal', function () {
            $('#modal-upgrade').remove();
            Builder.enableSave();
          });
        }

        OuterSpatial.meta.outerspatialJsVersion = outerspatialJsVersion;
        ready();
      } else {
        window.alert(msg);
      }
    },
    timeout: 3000,
    url: 'https://www.nps.gov/maps/builder/configs/' + mapId + '.jsonp'
  });
} else {
  $('#mask').show();

  OuterSpatial = {
    baseLayers: [
      'mapbox-outdoors'
    ],
    center: {
      lat: 39.06,
      lng: -96.02
    },
    div: 'map',
    homeControl: true,
    meta: {
      description: null,
      mapId: null,
      outerspatialJsVersion: outerspatialJsVersion,
      title: null
    },
    smallzoomControl: true,
    zoom: 4
  };
  ready();
}
