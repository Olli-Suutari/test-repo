$(document).ready(function($) {
    var widgets = $('.libdir_widget');
    widgets.each(function(){
        var widget = $(this);
        var lib_id = widget.attr("data-library");
        var lang = widget.attr("data-lang");
        // Generic details
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=extra";
        $.getJSON(jsonp_url, function(data) { 
            $( ".library-slogan" ).append( data.extra.slogan );
            $( "#transit_directions" ).append( data.extra.transit.transit_directions );
            $( "#parking_instructions" ).append( data.extra.transit.parking_instructions );
            $( "#libDetails" ).append( '<h2>Osoite</h2>' +
            '<p>' + data.address.street + ', ' + data.address.zipcode + ', ' +data.address.city + '</p>' );
            $( "#founded" ).append( data.extra.founded );
            $( "#building_name" ).append( data.extra.building.building_name );
            $( "#construction_year" ).append( data.extra.building.construction_year );
            $( "#building_architect" ).append( data.extra.building.building_architect );
            $( "#interior_designer" ).append( data.extra.building.interior_designer );
        });

        // Scheludes
        jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=schedules";
        $.getJSON(jsonp_url, function(data) { 
            moment.locale("fi")
            var date = moment(),
                begin = moment(date).startOf('week').isoWeekday(1);
            var str = "";
            for (var i=0; i<7; i++) {
                if (data.schedules[i].opens != null) {
                    str += '<tr><td>' + begin.format('ddd D.M.Y') + '</td><td>Aukioloaika: '  + data.schedules[i].opens + ' - ' + data.schedules[i].closes + '<br>' + data.schedules[i].info + '</tr></td><br>';
                }
                else {
                    str += '<tr><td>' + begin.format('ddd D.M.Y') + '</td><td>Suljettu</tr></td><br>'; 
                }

                begin.add(1, 'd');
            }
            $( "#weekSchelude" ).append( str );
            $( "#weekNumber" ).append( "Viikko " + moment().format('W') );
        });
        // Images
        jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=pictures";
        $.getJSON(jsonp_url, function(data) { 
            for (var i=0; i<data.pictures.length; i++) {
                var altCount = i + 1;
                var altText = 'Kuva kirjastolta (' + altCount  + '/' + data.pictures.length + ')';
                $( ".rslides" ).append( '<li><img src="'+ data.pictures[i].files.large + '" alt="' + altText + '"></li>');
            }
            //$( ".photoQuantity" ).append( data.pictures.length + " kuvaa" );
            
            $(".rslides").responsiveSlides({
                auto: true,             // Boolean: Animate automatically, true or false
                speed: 500,            // Integer: Speed of the transition, in milliseconds
                timeout: 8000,          // Integer: Time between slide transitions, in milliseconds
                pager: false,           // Boolean: Show pager, true or false
                nav: true,             // Boolean: Show navigation, true or false
                random: false,          // Boolean: Randomize the order of the slides, true or false
                pause: true,           // Boolean: Pause on hover, true or false
                pauseControls: true,    // Boolean: Pause when hovering controls, true or false
                prevText: "<",   // String: Text for the "previous" button
                nextText: ">",       // String: Text for the "next" button
                maxwidth: "",           // Integer: Max-width of the slideshow, in pixels
                navContainer: "#sliderBox",       // Selector: Where controls should be appended to, default is after the 'ul'
                manualControls: "",     // Selector: Declare custom pager navigation
                namespace: "rslides",   // String: Change the default namespace used
                before: function(){},   // Function: Before callback
                after: function(){}     // Function: After callback
              });


        });
    
    });
});


function toggleFullScreen() {
        // if already full screen; exit
        // else go fullscreen
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          element = $('#sliderBox').get(0);
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        }
}

var weekCounter = 0;
function getWeekSchelude(direction) {

        // +1 or -1;
        weekCounter = weekCounter + direction;
        // Do not allow going past current week.
        if(weekCounter < 0) {
            weekCounter = 0;
            return;
        }        
        var lang = "fi";
        var lib_id = "85159";
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=schedules&period.start=" + weekCounter + "w&period.end=" + weekCounter + "w";

        $.getJSON(jsonp_url, function(data) { 
            moment.locale("fi");
            moment().add(weekCounter, 'weeks');
            var date = moment().add(weekCounter, 'weeks');
                begin = moment(date).startOf('week').isoWeekday(1);
            var str = '<tr class="thead-light">' +
                        '<th id="weekNumber" colspan="3">Viikko ' + moment().add(weekCounter, 'weeks').format('W') + '</th>' +
                        '</tr>';
            for (var i=0; i<7; i++) {
                if (data.schedules[i].opens != null) {
                    str += '<tr><td>' + begin.format('ddd D.M.Y') + '</td><td>Aukioloaika: '  + data.schedules[i].opens + ' - ' + data.schedules[i].closes + '<br>' + data.schedules[i].info + '</tr></td><br>';
                }
                else {
                    str += '<tr><td>' + begin.format('ddd D.M.Y') + '</td><td>Suljettu</tr></td><br>'; 
                }

                begin.add(1, 'd');
            }
            $( "#weekSchelude" ).html( str );
        });
}