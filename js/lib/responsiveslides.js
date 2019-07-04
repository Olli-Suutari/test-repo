/*! ResponsiveSlides.js v1.55
 * http://responsiveslides.com
 * http://viljamis.com
 *
 * Copyright (c) 2011-2012 @viljamis
 * Available under the MIT license
 */

/*jslint browser: true, sloppy: true, vars: true, plusplus: true, indent: 2 */

/* Modifications by Olli Suutari
- Custom styling for prev/next buttons.
- Current slide is displayed in top left corner
- Added clickevent preventation for selected image (close fullscreen when clicking background)
- Added right/left navigation events for slider in fullscreen
- Navigation now always resets the slider timeout/automatic advancing.
- Modified default settings:
  - speed: 0
  - timeout: 6000
  - nav: true
  - pause: true
  - prevText: <
  - nextText: >
*/

function rebindClickPreventation() {
    // Ignore clicks on selected image.
    $(".rslides1_on").click(function(event){
      event.stopPropagation();
      $("#sliderBox").addClass('hovering');
    });
}

// Global variable, this will be set to true when changing the selected library.
var sliderNeedsToRestart = false;
function resetSliderAfterLibChange() {
  sliderNeedsToRestart = true;
  sliderHasStopped = false;
  index = 0;
  setTimeout(function() {
    sliderNeedsToRestart = false;
  }, 6490 );
}


// Once the slider is stopped, don't resume automatically.
var sliderHasStopped = false;
var index = 0;
var length = 1;
var isRotating = false;

(function ($, window, i) {
  $.fn.responsiveSlides = function (options) {

    // Default settings
    var settings = $.extend({
      "lazy": true,             // Boolean: Lazy Load Mode https://github.com/viljamis/ResponsiveSlides.js/pull/382/files
      "auto": true,             // Boolean: Animate automatically, true or false
      "speed": 0,               // Integer: Speed of the transition, in milliseconds
      "timeout": 6500,          // Integer: Time between slide transitions, in milliseconds
      "pager": false,           // Boolean: Show pager, true or false
      "nav": true,              // Boolean: Show navigation, true or false
      "random": false,          // Boolean: Randomize the order of the slides, true or false
      "pause": false,            // Boolean: Pause on hover, true or false
      "pauseControls": false,    // Boolean: Pause when hovering controls, true or false
      "prevText": "<",          // String: Text for the "previous" button
      "nextText": ">",          // String: Text for the "next" button
      "maxwidth": "",           // Integer: Max-width of the slideshow, in pixels
      "navContainer": "",       // Selector: Where auto generated controls should be appended to, default is after the <ul>
      "manualControls": "",     // Selector: Declare custom pager navigation
      "namespace": "rslides",   // String: change the default namespace used
      "before": $.noop,         // Function: Before callback
      "after": $.noop           // Function: After callback
    }, options);

    return this.each(function () {
      clearInterval(rotate);


      // Index for namespacing
      i++;

      var $this = $(this),

        // Local variables
        vendor,
        selectTab,
        startCycle,
        restartCycle,
        toggleAuto,
        rotate,
        $tabs,

        // Helpers
        $slide = $this.children(),
        fadeTime = parseFloat(settings.speed),
        waitTime = parseFloat(settings.timeout),
        maxw = parseFloat(settings.maxwidth),

          // Namespacing
        namespace = settings.namespace,
        namespaceIdx = namespace + i,

        // Classes
        navClass = namespace + "_nav " + namespaceIdx + "_nav",
        activeClass = namespace + "_here",
        visibleClass = namespaceIdx + "_on",
        slideClassPrefix = namespaceIdx + "_s",

        // Pager
        $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),

        // Styles for visible and hidden slides
        visible = {"float": "left", "position": "relative", "opacity": 1, "zIndex": 2},
        hidden = {"float": "none", "position": "absolute", "opacity": 0, "zIndex": 1},

        // Detect transition support
        supportsTransitions = (function () {
          var docBody = document.body || document.documentElement;
          var styles = docBody.style;
          var prop = "transition";
          if (typeof styles[prop] === "string") {
            return true;
          }
          // Tests for vendor specific prop
          vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
          prop = prop.charAt(0).toUpperCase() + prop.substr(1);
          var i;
          for (i = 0; i < vendor.length; i++) {
            if (typeof styles[vendor[i] + prop] === "string") {
              return true;
            }
          }
          return false;
        })(),
        slideToHelper = function(idx) {
          if(isRotating) {
          console.log("IS ROTATING; RETURN")
          return;
        }
        isRotating = true;
          // If CSS3 transitions are supported
          if (supportsTransitions) {
            $slide
                .removeClass(visibleClass)
                .css(hidden)
                .eq(idx)
                .addClass(visibleClass)
                .css(visible);
            index = idx;
            setTimeout(function () {
              settings.after(idx);
            }, fadeTime);
            // If not, use jQuery fallback
          } else {
            $slide
                .stop()
                .fadeOut(fadeTime, function () {
                  $(this)
                      .removeClass(visibleClass)
                      .css(hidden)
                      .css("opacity", 1);
                })
                .eq(idx)
                .fadeIn(fadeTime, function () {
                  $(this)
                      .addClass(visibleClass)
                      .css(visible);
                  settings.after(idx);
                  index = idx;
                });
          }
        isRotating = false;
        };

      slideTo = function (idx) {
        console.log("TRIGGEER HELPER: " + idx + " "  + length);
        settings.before(idx);
        // Lazy loading crashes the slider for iOS...
        if (settings.lazy && !isIOS) {
          try {
            var imgSlide = $($($slide).find('img')[idx]);
            var dataSrc = imgSlide.attr('src');
            imgSlide.attr('src', dataSrc);
            imgSlide.on('load', function() {
              slideToHelper(idx);
            })
          }
          catch (e) {
            console.log("LOADING OF IMG FAILED.");
            slideToHelper(idx);
          }
        } else {
          slideToHelper(idx);
        }
      };

      // Random order
      if (settings.random) {
        $slide.sort(function () {
          return (Math.round(Math.random()) - 0.5);
        });
        $this
          .empty()
          .append($slide);
      }

      // Add ID's to each slide
      $slide.each(function (i) {
        this.id = slideClassPrefix + i;
      });

      // Add max-width and classes
      $this.addClass(namespace + " " + namespaceIdx);
      if (options && options.maxwidth) {
        $this.css("max-width", maxw);
      }

      // Hide all slides, then show first one
      $slide
        .hide()
        .css(hidden)
        .eq(0)
        .addClass(visibleClass)
        .css(visible)
        .show();

      // CSS transitions
      if (supportsTransitions) {
        $slide
          .show()
          .css({
            // -ms prefix isn't needed as IE10 uses prefix free version
            "-webkit-transition": "opacity " + fadeTime + "ms ease-in-out",
            "-moz-transition": "opacity " + fadeTime + "ms ease-in-out",
            "-o-transition": "opacity " + fadeTime + "ms ease-in-out",
            "transition": "opacity " + fadeTime + "ms ease-in-out"
          });
      }

      // Only run if there's more than one slide
      if ($slide.length > 1) {

        // Make sure the timeout is at least 100ms longer than the fade
        if (waitTime < fadeTime + 100) {
          return;
        }

        // Pager
        if (settings.pager && !settings.manualControls) {
          var tabMarkup = [];
          $slide.each(function (i) {
            var n = i + 1;
            tabMarkup +=
              "<li>" +
              "<a href='#' class='" + slideClassPrefix + n + "'>" + n + "</a>" +
              "</li>";
          });
          $pager.append(tabMarkup);

          // Inject pager
          if (options.navContainer) {
            $(settings.navContainer).append($pager);
          } else {
            $this.after($pager);
          }
        }

        // Manual pager controls
        if (settings.manualControls) {
          $pager = $(settings.manualControls);
          $pager.addClass(namespace + "_tabs " + namespaceIdx + "_tabs");
        }

        // Add pager slide class prefixes
        if (settings.pager || settings.manualControls) {
          $pager.find('li').each(function (i) {
            $(this).addClass(slideClassPrefix + (i + 1));
          });
        }

        // If we have a pager, we need to set up the selectTab function
        if (settings.pager || settings.manualControls) {
          $tabs = $pager.find('a');

          // Select pager item
          selectTab = function (idx) {
            $tabs
              .closest("li")
              .removeClass(activeClass)
              .eq(idx)
              .addClass(activeClass);
          };
        }

        // Auto cycle, do-not re-init when changing the library.
        if (settings.auto) {
          startCycle = function () {
            console.log("sliderNeedsToRestart is: " + sliderNeedsToRestart);
            if(sliderNeedsToRestart) {
              console.log("CLEAR INTERVAL CUZ LIB CHANGED?")
              $slide.stop(true, true);
              clearInterval(rotate);
              return;
            }
            if(sliderHasStopped) {
              return;
            }
            rotate = setInterval(function () {
              console.log("sliderNeedsToRestart in rotate is: " + sliderNeedsToRestart);
              if(sliderNeedsToRestart || sliderHasStopped) {
                return;
              }
              // Clear the event queue
              $slide.stop(true, true);
              var idx = index + 1 < length ? index + 1 : 0;
              // Remove active state and set new if pager is set
              if (settings.pager || settings.manualControls) {
                selectTab(idx);
              }
              if($('.rslides li').length >= 2) {
                resetSliderAfterLibChange();
                console.log("TRIGGER MOVE TO " + idx + " LEN: " + length);
                if(idx > length) {
                  idx = length;
                }
                $(".rslides1_on").off("click");
                slideTo(idx);
                $('#currentSlide').html(idx + 1);
                rebindClickPreventation();
                //console.log("NAVIGATE AUTO")
                $('#sliderPlay').removeClass("progress");
                setTimeout(function(){
                  $('#sliderPlay').addClass("progress");
                }, 75);
                adjustParentHeight(50);
              }
            }, waitTime);
          };
          // Init cycle
          startCycle();
        }

        // Restarting cycle
        restartCycle = function () {
          //console.log("DO RESTART " + sliderHasStopped);
          // Do not restart the cycle if it has been stopped.
          if(sliderHasStopped) {
            return
          }
          if (settings.auto) {
            $slide.stop(true, true);
            // Stop
            clearInterval(rotate);
            // Restart
            startCycle();
          }
        };

         toggleAuto = function (stop) {
           //console.log("IS: " + $("#sliderPlay i").hasClass("fa-play") + " " + stop);
           if(stop === true) {
             console.log("STOP CALLED!")

             sliderHasStopped = true;
             restartCycle();
             $('#sliderPlay').removeClass("progress");
             $('.fa-stop').addClass('fa-play').removeClass('fa-stop');
           }
           else if (sliderHasStopped){
             sliderHasStopped = false;
             sliderNeedsToRestart = false;
             restartCycle();
             $('#sliderPlay').addClass("progress");
             $('.fa-play').addClass('fa-stop').removeClass('fa-play');

           }
        };

       var hoverHasTriggered = false;
        // Pause on hover
        if (settings.pause) {
          $this.hover(function () {
            if(hoverHasTriggered) {
              return;
            }
            if(!sliderHasStopped) {
              hoverHasTriggered = true;
              toggleAuto(true);
            }
            else {
              return;
            }
            clearInterval(rotate);
          }, function () {
            restartCycle();
          });
        }

        // Pager click event handler
        if (settings.pager || settings.manualControls) {
          $tabs.bind("click", function (e) {
            e.preventDefault();

            if (!settings.pauseControls) {
              restartCycle();
            }

            // Get index of clicked tab
            var idx = $tabs.index(this);

            // Break if element is already active or currently animated
            if (index === idx || $("." + visibleClass).queue('fx').length) {
              return;
            }

            // Remove active state from old tab and set new one
            selectTab(idx);

            // Do the animation
            slideTo(idx);
          })
            .eq(0)
            .closest("li")
            .addClass(activeClass);

          // Pause when hovering pager
          if (settings.pauseControls) {
            $tabs.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

        // Navigation
        if (settings.nav) {
          var progressBar = '<div class="slider-play-container"> <button id="sliderPlay" class="slider-btn progress blue">' +
              '<span class="progress-left">' +
              '<span class="progress-bar"></span>' +
              '</span>' +
              '<span class="progress-right">' +
              '<span class="progress-bar"></span>' +
              '</span>' +
              '<div class="progress-value"><i class="fa fa-stop"></i></div>' +
              '</button></div>';

              //              "<button id='sliderPlay' class='slider-btn'> <i class='fa fa-stop title='" + i18n.get("Toggle full-screen") +
          //               "'></i></button>" +

          var navMarkup =
            "<div class='slider-navigation slider-counter-container'><button id='sliderPrevious' " +
              "class='slider-btn " + navClass + " prev'>" + settings.prevText + "</button>" +
              "<i class='slider-counter'><span id='currentSlide'>1</span></i>" +
            "<button id='sliderForward' class='slider-btn " + navClass + " next'>" + settings.nextText + "</button></div>" +
              "<div class='slider-navigation slider-play-expand-container'> " + progressBar +
          "<button id='expandSlider' class='slider-btn'> " +
              "<i class='fa fa-expand' title='" + i18n.get("Toggle full-screen") +
              "'></i></button></div>";
          // Inject navigation
          if (options.navContainer) {
            $(settings.navContainer).append(navMarkup);

            if(isIOS || isIE) {
              $('#expandSlider').css('display', 'none');
              $('.slider-play-container').css('margin-left', '-10px');
            }
            $('#sliderPlay').click(function() {
              if($('#sliderPlay i').hasClass('fa-play')) {
                toggleAuto();
              }
              else {
                toggleAuto(true);
              }
          });
          } else {
            $this.after(navMarkup);
          }

          var $trigger = $("." + namespaceIdx + "_nav"),
            $prev = $trigger.filter(".prev");

          // Click event handler
          $trigger.bind("click", function (e) {
            e.preventDefault();

            var $visibleClass = $("." + visibleClass);

            // Prevent clicking if currently animated
            if ($visibleClass.queue('fx').length) {
              return;
            }

            //  Adds active class during slide animation
            //  $(this)
            //    .addClass(namespace + "_active")
            //    .delay(fadeTime)
            //    .queue(function (next) {
            //      $(this).removeClass(namespace + "_active");
            //      next();
            //  });

            // Determine where to slide
            var idx = $slide.index($visibleClass),
              prevIdx = idx - 1 < 0 ? length - 1 : idx - 1, // Fix for prevIdx going < 0 https://github.com/viljamis/ResponsiveSlides.js/pull/212/files
              nextIdx = idx + 1 < length ? index + 1 : 0;

            // Go to slide
            if ($(this)[0] === $prev[0]) {
              $(".rslides1_on").off("click");
              slideTo(prevIdx);
              if(prevIdx == -1) {
                // If we move from 0 to previous (last slide), ui text would be -1.
                // $slide.length is the amount of slides.
                $('#currentSlide').html($slide.length);
                rebindClickPreventation();
              }
              else {
                $('#currentSlide').html(prevIdx + 1);
                rebindClickPreventation();
              }
            }
            else {
              $(".rslides1_on").off("click");
              slideTo(nextIdx);
              $('#currentSlide').html(nextIdx + 1);
              rebindClickPreventation();
            }
            adjustParentHeight(750, 300);
            console.log("MANUAL N")
            toggleAuto(true);
            if (settings.pager || settings.manualControls) {
              selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            }

            if (!settings.pauseControls) {
              restartCycle();
            }
            // Restart the timer.
            // Stop
            clearInterval(rotate);
            // Restart
            startCycle();
          });

          // Pause when hovering navigation
          if (settings.pauseControls) {
            $trigger.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }
      }
      $( ".ig-caption" ).mouseover(function() {
        toggleAuto(true);
      });
      // Max-width fallback
      if (typeof document.body.style.maxWidth === "undefined" && options.maxwidth) {
        var widthSupport = function () {
          $this.css("width", "100%");
          if ($this.width() > maxw) {
            $this.css("width", maxw);
          }
        };

        // Init fallback
        widthSupport();
        $(window).bind("resize", function () {
          widthSupport();
        });
      }
    });
  };
})(jQuery, this, 0);
