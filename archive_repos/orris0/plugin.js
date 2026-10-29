// window scroller

  /*!
   * windows: a handy, loosely-coupled jQuery plugin for full-screen scrolling windows.
   * Version: 0.0.1
   * Original author: @nick-jonas
   * Website: http://www.workofjonas.com
   * Licensed under the MIT license
   */

  ;
  (function($, window, document, undefined) {


    var that = this,
      pluginName = 'windows',
      defaults = {
        snapping: true,
        snapSpeed: 500,
        snapInterval: 1100,
        onScroll: function() {},
        onSnapComplete: function() {},
        onWindowEnter: function() {}
      },
      options = {},
      $w = $(window),
      s = 0,
      // scroll amount
      t = null,
      // timeout
      $windows = [];

    /**
     * Constructor
     * @param {jQuery Object} element       main jQuery object
     * @param {Object} customOptions        options to override defaults
     */
    function windows(element, customOptions) {

      this.element = element;
      options = options = $.extend({}, defaults, customOptions);
      this._defaults = defaults;
      this._name = pluginName;
      $windows.push(element);
      var isOnScreen = $(element).isOnScreen();
      $(element).data('onScreen', isOnScreen);
      if (isOnScreen) options.onWindowEnter($(element));

    }

    /**
     * Get ratio of element's visibility on screen
     * @return {Number} ratio 0-1
     */
    $.fn.ratioVisible = function() {
      var s = $w.scrollTop();
      if (!this.isOnScreen()) return 0;
      var curPos = this.offset();
      var curTop = curPos.top - s;
      var screenHeight = $w.height();
      var ratio = (curTop + screenHeight) / screenHeight;
      if (ratio > 1) ratio = 1 - (ratio - 1);
      return ratio;
    };

    /**
     * Is section currently on screen?
     * @return {Boolean}
     */
    $.fn.isOnScreen = function() {
      var s = $w.scrollTop(),
        screenHeight = $w.height(),
        curPos = this.offset(),
        curTop = curPos.top - s;
      return (curTop >= screenHeight || curTop <= -screenHeight) ? false : true;
    };

    /**
     * Get section that is mostly visible on screen
     * @return {jQuery el}
     */
    var _getCurrentWindow = $.fn.getCurrentWindow = function() {
        var maxPerc = 0,
          maxElem = $windows[0];
        $.each($windows, function(i) {
          var perc = $(this).ratioVisible();
          if (Math.abs(perc) > Math.abs(maxPerc)) {
            maxElem = $(this);
            maxPerc = perc;
          }
        });
        return $(maxElem);
      };


    // PRIVATE API ----------------------------------------------------------
    /**
     * Window scroll event handler
     * @return null
     */
    var _onScroll = function() {
        s = $w.scrollTop();

        _snapWindow();

        options.onScroll(s);

        // notify on new window entering
        $.each($windows, function(i) {
          var $this = $(this),
            isOnScreen = $this.isOnScreen();
          if (isOnScreen) {
            if (!$this.data('onScreen')) options.onWindowEnter($this);
          }
          $this.data('onScreen', isOnScreen);
        });
      };

    var _onResize = function() {
        _snapWindow();
      };

    var _snapWindow = function() {
        // clear timeout if exists
        if (t) {
          clearTimeout(t);
        }
        // check for when user has stopped scrolling, & do stuff
        if (options.snapping) {
          t = setTimeout(function() {
            var $visibleWindow = _getCurrentWindow(),
              // visible window
              scrollTo = $visibleWindow.offset().top,
              // top of visible window
              completeCalled = false;
            // animate to top of visible window
            $('html:not(:animated),body:not(:animated)').animate({
              scrollTop: scrollTo
            }, options.snapSpeed, function() {
              if (!completeCalled) {
                if (t) {
                  clearTimeout(t);
                }
                t = null;
                completeCalled = true;
                options.onSnapComplete($visibleWindow);
              }
            });
          }, options.snapInterval);
        }
      };


    /**
       * A really lightweight plugin wrapper around the constructor,
          preventing against multiple instantiations
       * @param  {Object} options
       * @return {jQuery Object}
       */
    $.fn[pluginName] = function(options) {

      $w.scroll(_onScroll);
      $w.resize(_onResize);

      return this.each(function(i) {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new windows(this, options));
        }
      });
    };

  })(jQuery, window, document);

// anystretch

  /*
   * jQuery Anystretch
   * Version 1.2 (@jbrooksuk / me.itslimetime.com)
   * https://github.com/jbrooksuk/jquery-anystretch
   * Based on Dan Millar's Port
   * https://github.com/danmillar/jquery-anystretch
   *
   * Add a dynamically-resized background image to the body
   * of a page or any other block level element within it
   *
   * Copyright (c) 2012 Dan Millar (@danmillar / decode.uk.com)
   * Dual licensed under the MIT and GPL licenses.
   *
   * This is a fork of jQuery Backstretch (v1.2)
   * Copyright (c) 2011 Scott Robbin (srobbin.com)
   */ (function(a) {
    a.fn.anystretch = function(d, c, e) {
      var b = this.selector.length ? false : true;
      return this.each(function(q) {
        var s = {
          positionX: "center",
          positionY: "center",
          speed: 0,
          elPosition: "relative",
          dataName: "stretch"
        },
          h = a(this),
          g = b ? a(".anystretch") : h.children(".anystretch"),
          l = g.data("settings") || s,
          m = g.data("settings"),
          j, f, r, p, v, u;
        if (c && typeof c == "object") {
          a.extend(l, c)
        }
        if (c && typeof c == "function") {
          e = c
        }
        a(document).ready(t);
        return this;

        function t() {
          if (d || h.length >= 1) {
            var i;
            if (!b) {
              h.css({
                position: l.elPosition,
                background: "none"
              })
            }
            if (g.length == 0) {
              g = a("<div />").attr("class", "anystretch").css({
                left: 0,
                top: 0,
                position: (b ? "fixed" : "absolute"),
                overflow: "hidden",
                zIndex: (b ? -999999 : -999998),
                margin: 0,
                padding: 0,
                height: "100%",
                width: "100%"
              })
            } else {
              g.find("img").addClass("deleteable")
            }
            i = a("<img />").css({
              position: "absolute",
              display: "none",
              margin: 0,
              padding: 0,
              border: "none",
              zIndex: -999999
            }).bind("load", function(A) {
              var z = a(this),
                y, x;
              z.css({
                width: "auto",
                height: "auto"
              });
              y = this.width || a(A.target).width();
              x = this.height || a(A.target).height();
              j = y / x;
              o(function() {
                z.fadeIn(l.speed, function() {
                  g.find(".deleteable").remove();
                  if (typeof e == "function") {
                    e()
                  }
                })
              })
            }).appendTo(g);
            if (h.children(".anystretch").length == 0) {
              if (b) {
                a("body").append(g)
              } else {
                h.append(g)
              }
            }
            g.data("settings", l);
            var w = "";
            if (d) {
              w = d
            } else {
              if (h.data(l.dataName)) {
                w = h.data(l.dataName)
              } else {
                return
              }
            }
            i.attr("src", w);
            a(window).resize(o)
          }
        }
        function o(i) {
          try {
            u = {
              left: 0,
              top: 0
            };
            r = k();
            p = r / j;
            if (p >= n()) {
              v = (p - n()) / 2;
              if (l.positionY == "center" || l.centeredY) {
                a.extend(u, {
                  top: "-" + v + "px"
                })
              } else {
                if (l.positionY == "bottom") {
                  a.extend(u, {
                    top: "auto",
                    bottom: "0px"
                  })
                }
              }
            } else {
              p = n();
              r = p * j;
              v = (r - k()) / 2;
              if (l.positionX == "center" || l.centeredX) {
                a.extend(u, {
                  left: "-" + v + "px"
                })
              } else {
                if (l.positionX == "right") {
                  a.extend(u, {
                    left: "auto",
                    right: "0px"
                  })
                }
              }
            }
            g.children("img:not(.deleteable)").width(r).height(p).filter("img").css(u)
          } catch (w) {}
          if (typeof i == "function") {
            i()
          }
        }
        function k() {
          return b ? h.width() : h.innerWidth()
        }
        function n() {
          return b ? h.height() : h.innerHeight()
        }
      })
    };
    a.anystretch = function(d, b, e) {
      var c = ("onorientationchange" in window) ? a(document) : a(window);
      c.anystretch(d, b, e)
    }
  })(jQuery);




  // orientation bug
    /*! A fix for the iOS orientationchange zoom bug. Script by @scottjehl, rebound by @wilto.MIT / GPLv2 License.*/(function(a){function m(){d.setAttribute("content",g),h=!0}function n(){d.setAttribute("content",f),h=!1}function o(b){l=b.accelerationIncludingGravity,i=Math.abs(l.x),j=Math.abs(l.y),k=Math.abs(l.z),(!a.orientation||a.orientation===180)&&(i>7||(k>6&&j<8||k<8&&j>6)&&i>5)?h&&n():h||m()}var b=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-5]_[0-9_]* like Mac OS X/i.test(b)&&b.indexOf("AppleWebKit")>-1))return;var c=a.document;if(!c.querySelector)return;var d=c.querySelector("meta[name=viewport]"),e=d&&d.getAttribute("content"),f=e+",maximum-scale=1",g=e+",maximum-scale=10",h=!0,i,j,k,l;if(!d)return;a.addEventListener("orientationchange",m,!1),a.addEventListener("devicemotion",o,!1)})(this);




    /*! http://mths.be/placeholder v2.0.7 by @mathias */
    ;
    (function(window, document, $) {

      var isInputSupported = 'placeholder' in document.createElement('input');
      var isTextareaSupported = 'placeholder' in document.createElement('textarea');
      var prototype = $.fn;
      var valHooks = $.valHooks;
      var propHooks = $.propHooks;
      var hooks;
      var placeholder;

      if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
          return this;
        };

        placeholder.input = placeholder.textarea = true;

      } else {

        placeholder = prototype.placeholder = function() {
          var $this = this;
          $this.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]').not('.placeholder').bind({
            'focus.placeholder': clearPlaceholder,
            'blur.placeholder': setPlaceholder
          }).data('placeholder-enabled', true).trigger('blur.placeholder');
          return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
          'get': function(element) {
            var $element = $(element);

            var $passwordInput = $element.data('placeholder-password');
            if ($passwordInput) {
              return $passwordInput[0].value;
            }

            return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
          },
          'set': function(element, value) {
            var $element = $(element);

            var $passwordInput = $element.data('placeholder-password');
            if ($passwordInput) {
              return $passwordInput[0].value = value;
            }

            if (!$element.data('placeholder-enabled')) {
              return element.value = value;
            }
            if (value == '') {
              element.value = value;
              // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
              if (element != document.activeElement) {
                // We can't use `triggerHandler` here because of dummy text/password inputs :(
                setPlaceholder.call(element);
              }
            } else if ($element.hasClass('placeholder')) {
              clearPlaceholder.call(element, true, value) || (element.value = value);
            } else {
              element.value = value;
            }
            // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
            return $element;
          }
        };

        if (!isInputSupported) {
          valHooks.input = hooks;
          propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
          valHooks.textarea = hooks;
          propHooks.value = hooks;
        }

        $(function() {
          // Look for forms
          $(document).delegate('form', 'submit.placeholder', function() {
            // Clear the placeholder values so they don't get submitted
            var $inputs = $('.placeholder', this).each(clearPlaceholder);
            setTimeout(function() {
              $inputs.each(setPlaceholder);
            }, 10);
          });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
          $('.placeholder').each(function() {
            this.value = '';
          });
        });

      }

      function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
          if (attr.specified && !rinlinejQuery.test(attr.name)) {
            newAttrs[attr.name] = attr.value;
          }
        });
        return newAttrs;
      }

      function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
          if ($input.data('placeholder-password')) {
            $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
            // If `clearPlaceholder` was called from `$.valHooks.input.set`
            if (event === true) {
              return $input[0].value = value;
            }
            $input.focus();
          } else {
            input.value = '';
            $input.removeClass('placeholder');
            input == document.activeElement && input.select();
          }
        }
      }

      function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value == '') {
          if (input.type == 'password') {
            if (!$input.data('placeholder-textinput')) {
              try {
                $replacement = $input.clone().attr({
                  'type': 'text'
                });
              } catch (e) {
                $replacement = $('<input>').attr($.extend(args(this), {
                  'type': 'text'
                }));
              }
              $replacement.removeAttr('name').data({
                'placeholder-password': $input,
                'placeholder-id': id
              }).bind('focus.placeholder', clearPlaceholder);
              $input.data({
                'placeholder-textinput': $replacement,
                'placeholder-id': id
              }).before($replacement);
            }
            $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
            // Note: `$input[0] != input` now!
          }
          $input.addClass('placeholder');
          $input[0].value = $input.attr('placeholder');
        } else {
          $input.removeClass('placeholder');
        }
      }

    }(this, document, jQuery));





/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT / GPLv2 License.
*/
(function(w) {

  // This fix addresses an iOS bug, so return early if the UA claims it's something else.
  var ua = navigator.userAgent;
  if (!(/iPhone|iPad|iPod/.test(navigator.platform) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf("AppleWebKit") > -1)) {
    return;
  }

  var doc = w.document;

  if (!doc.querySelector) {
    return;
  }

  var meta = doc.querySelector("meta[name=viewport]"),
    initialContent = meta && meta.getAttribute("content"),
    disabledZoom = initialContent + ",maximum-scale=1",
    enabledZoom = initialContent + ",maximum-scale=10",
    enabled = true,
    x, y, z, aig;

  if (!meta) {
    return;
  }

  function restoreZoom() {
    meta.setAttribute("content", enabledZoom);
    enabled = true;
  }

  function disableZoom() {
    meta.setAttribute("content", disabledZoom);
    enabled = false;
  }

  function checkTilt(e) {
    aig = e.accelerationIncludingGravity;
    x = Math.abs(aig.x);
    y = Math.abs(aig.y);
    z = Math.abs(aig.z);

    // If portrait orientation and in one of the danger zones
    if ((!w.orientation || w.orientation === 180) && (x > 7 || ((z > 6 && y < 8 || z < 8 && y > 6) && x > 5))) {
      if (enabled) {
        disableZoom();
      }
    } else if (!enabled) {
      restoreZoom();
    }
  }

  w.addEventListener("orientationchange", restoreZoom, false);
  w.addEventListener("devicemotion", checkTilt, false);

})(this);
