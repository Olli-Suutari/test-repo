
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
        var str = '';
        for (var i=0; i<7; i++) {
            if (data.schedules[i].opens != null) {
                str += '<tr><td>' + begin.format('ddd D.M.Y') + '</td><td>Aukioloaika: '  + data.schedules[i].opens + ' - ' + data.schedules[i].closes + '<br>' + data.schedules[i].info + '</tr></td><br>';
            }
            else {
                str += '<tr><td>' + begin.format('ddd D.M.Y') + '</td><td>Suljettu</tr></td><br>'; 
            }

            begin.add(1, 'd');
        }
        $( "#weekNumber" ).html( '<span class="week-number">Viikko ' + moment().add(weekCounter, 'weeks').format('W') + '</span>');
        $( "#weekSchelude" ).html( str );
    });
}

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
            var description = data.extra.description;
            // Turn bolded Ajankohtaista/Tervetuloa to <h2>
            description = description.replace("<strong>Ajankohtaista</strong>", "<h2>Ajankohtaista</h2>");
            description = description.replace("<strong>Tervetuloa kirjastoon!</strong>", "<h2>Tervetuloa kirjastoon!</h2>");
            $( "#intro-content" ).append( description );
            $( "#transit_directions" ).append( data.extra.transit.transit_directions );
            // Replace row splits with <br>
            var parking_instructions = data.extra.transit.parking_instructions.replace(/\r\n/g, "<br>");
            $( "#parking_instructions" ).append( parking_instructions );
            // Table "Rakennuksen tiedot".
            $( "#lib_address" ).append( data.address.street + ', ' + data.address.zipcode + ', ' + data.address.city );
            $( "#founded" ).append( data.extra.founded );
            $( "#building_name" ).append( data.extra.building.building_name );
            $( "#construction_year" ).append( data.extra.building.construction_year );
            $( "#building_architect" ).append( data.extra.building.building_architect );
            $( "#interior_designer" ).append( data.extra.building.interior_designer );
            // Accessibility details from extras.
            data.extra.data.forEach(function(element) {
                if(element.id == "saavutettavuus-info") {
                    $( ".accessibility-details" ).append( '<p>' + element.value + '</p>');
                }
                if(element.id == "saavutettavuus-palvelut") {
                    var splittedValues = element.value.split("\r\n");
                    $.each(splittedValues, function(index, value) { 
                        if (value == "Esteetön sisäänpääsy") {
                            $( ".accessibility-images" ).append( '<img alt="Esteetön sisäänpääsy" src="images/accessibility/Esteetön_kulku_saavutettavuus.png" />');
                        }
                        else if (value == "Invapysäköinti") {
                            $( ".accessibility-images" ).append( '<img alt="Invapysäköinti" src="images/accessibility/Esteetön_pysakointi_saavutettavuus.png" />');
                        }
                        $( "#accessibility-list" ).append( '<li>' + value + '</li>');
                      });
                    }
            });
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
            $( "#weekNumber" ).append( '<span class="week-number">Viikko ' + moment().format('W') + '</span>');
        });
        // Images
        jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=pictures";
        $.getJSON(jsonp_url, function(data) { 
            for (var i=0; i<data.pictures.length; i++) {
                var altCount = i + 1;
                var altText = 'Kuva kirjastolta (' + altCount  + '/' + data.pictures.length + ')';
                $( ".rslides" ).append( '<li><img src="'+ data.pictures[i].files.large + '" alt="' + altText + '"></li>');
            }
            $('#currentSlide').html(1)
            $('.top-left').append('/' + data.pictures.length);
            //$( ".photoQuantity" ).append( data.pictures.length + " kuvaa" );
            
            $(".rslides").responsiveSlides({
                navContainer: "#sliderBox"  // Selector: Where controls should be appended to, default is after the 'ul'
              });
        });
        // Social media links
        jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=link_groups";
        $.getJSON(jsonp_url, function(data) {
            // Loop the links of group category [0].
            data.link_groups[0].links.forEach(function(element) {
                // Get url.
                var url = element.url;
                if (url.indexOf("facebook") !== -1) {
                    $( ".some-links" ).append('<a target="_blank" ' + 
                    'href="' + url +'" title="' + element.name + '"> <img src="images/icons/facebook.svg" alt="Kirjaston Facebook"/>' +
                    '</a>');
                }
                else if (url.indexOf("instagram") !== -1) {
                    $( ".some-links" ).append('<a target="_blank" ' + 
                    'href="' + url +'" title="' + element.name + '"> <img src="images/icons/instagram.svg" alt="Kirjaston Instagram"/>' +
                    '</a>');
                }
              });
        });
    });
});

