
// Get global library/lang parameters from the script.
var library = '';
var lang = '';

function getSyncScriptParams() {
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length-1];
    var scriptName = lastScript;
    library = scriptName.getAttribute('data-library'),
    lang = scriptName.getAttribute('data-lang')
}
getSyncScriptParams();

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

// jsonp_url base
var jsonp_url = "https://api.kirjastot.fi/v3/library/" + library + "?lang=" + lang
var weekCounter = 0;
function getWeekSchelude(direction) {
    // +1 or -1;
    weekCounter = weekCounter + direction;
    // Do not allow going past current week.
    if(weekCounter < 0) {
        weekCounter = 0;
        return;
    }
    $.getJSON(jsonp_url + "&with=schedules&period.start=" + weekCounter + "w&period.end=" + weekCounter + "w", function(data) {
        //  Week adjustment
        moment.locale("fi");
        var format = 'hh:mm'
        moment().add(weekCounter, 'weeks');
        var date = moment().add(weekCounter, 'weeks');
            begin = moment(date).startOf('week').isoWeekday(1);
        var str = '';
        for (var i=0; i<7; i++) {
                // If today, add some colourfull classes!
                var isTodayClass = '';

                // If today, add some colourfull classes!
                if(moment(begin).isSame(moment(), 'day')) {
                    var isTodayClass =  "is-closed";
                    var format = 'hh:mm'
                    // var time = moment() gives you current time. no format required.
                    var time = moment(moment(), format),
                    openingTime = moment(data.schedules[i].opens, format),
                    closingTime = moment(data.schedules[i].closes, format);
                    // If lib is open.
                    if (time.isBetween(openingTime, closingTime)) {
                        isTodayClass = "is-open";
                    }
                }
                var dayInfo = '';
                var rowspanCount = 1;
                // Scheludes for: combined, selfServiceBefore, MagazinesBefore,  staffToday, selfServiceAfter & magazinesAfter
                var isClosed = true;
                var dayStart = '';
                var dayEnd = '';
                var selfServiceBefore = '';
                var magazinesBefore = '';
                var staffToday = '';
                var selfServiceAfter = '';
                var magazinesAfter = '';
                // ScheludeRow will be used to bring things together
                var scheludeRow = '';

                // Variables for schelude times.
                var staffPresentStart
                var staffPresentEnd;
                var selfServiceStart;
                var selfServiceEnd;
                var magazinesStart;
                var magazinesEnd;
                // Capitalize 1st letter of dayname.
                var dayName = begin.format("dddd");
                dayName = dayName[0].toUpperCase() + dayName.substr(1);
                // If main schelude is not null
                if (data.schedules[i].opens != null) {
                    // Increase rowspanCount to be used with DD.M. for each open section.
                    rowspanCount = rowspanCount + 1;
                    staffPresentStart = data.schedules[i].opens;
                    staffPresentEnd = data.schedules[i].closes;
                    dayStart = staffPresentStart;
                    dayEnd = staffPresentEnd;
                    // Store the row as a variable.
                    staffToday = '<tr class="time--sub time ' + isTodayClass + ' time--with-staff">' +
                    '<td><i class="fa fa-long-arrow-right"></i> Henkilökunta paikalla</td>' +
                    '<td>' + staffPresentStart + ' – ' + staffPresentEnd + '</td>' +
                    '</tr>';
                    // Set isClosed to false.
                    isClosed = false;
                }
                
                // Self service times.
                if(data.schedules[i].sections.selfservice != null) {
                    rowspanCount = rowspanCount +1;
                    // Get scheludes and check if starts before or at the same time staff is present.
                    selfServiceStart = data.schedules[i].sections.selfservice.times[0].opens;
                    selfServiceEnd = data.schedules[i].sections.selfservice.times[0].closes;
                    if (moment(selfServiceStart, format).isBefore(moment(staffPresentStart, format)) || (moment(selfServiceStart, format).isSame(moment(staffPresentStart, format)))) {
                        selfServiceBefore = '<tr class="time--sub time ' + isTodayClass + ' time--no-staff">' +
                        '<td><i class="fa fa-long-arrow-right"></i> Omatoimiaika</td>' +
                        '<td>' + selfServiceStart + ' – ' + selfServiceEnd + '</td>' +
                        '</tr>';
                        // Set dayStart to match selfServiceStart, if dayEnd is '', set it too.
                        dayStart = selfServiceStart;
                        if(dayEnd === '') {
                            dayEnd = selfServiceEnd;
                        }
                        isClosed = false;
                    }

                    if (data.schedules[i].sections.selfservice.times[1] != null) {
                        rowspanCount = rowspanCount +1;
                        selfServiceStart = data.schedules[i].sections.selfservice.times[1].opens;
                        selfServiceEnd = data.schedules[i].sections.selfservice.times[1].closes;
                        selfServiceAfter = '<tr class="time--sub time ' + isTodayClass + ' time--no-staff">' +
                        '<td><i class="fa fa-long-arrow-right"></i> Omatoimiaika</td>' +
                        '<td>' + selfServiceStart + ' – ' + selfServiceEnd + '</td>' +
                        '</tr>';
                        dayEnd = selfServiceEnd;
                    }


                }
                // Magazines dep
                if(data.schedules[i].sections.magazines.times[0] != null) {
                   // Get scheludes and check if starts before staff is present.
                    magazinesStart = data.schedules[i].sections.magazines.times[0].opens;
                    magazinesEnd = data.schedules[i].sections.magazines.times[0].closes;
                    if (moment(magazinesStart, format).isBefore(moment(staffPresentStart, format)) || (moment(magazinesStart, format).isSame(moment(staffPresentStart, format)))) {
                        rowspanCount = rowspanCount +1;
                        isClosed = false;
                        magazinesBefore = '<tr class="time--sub time ' + isTodayClass + ' time--no-staff">' +
                        '<td><i class="fa fa-long-arrow-right"></i> Lehtilukusali</td>' +
                        '<td>' + magazinesStart + ' – ' + magazinesEnd + '</td>' +
                        '</tr>';
                        dayStart = magazinesStart;
                        if(dayEnd === '') {
                            dayEnd = magazinesEnd;
                        }
                    } else {
                        rowspanCount = rowspanCount +1;
                        isClosed = false;
                        magazinesAfter = '<tr class="time--sub time ' + isTodayClass + ' time--no-staff">' +
                        '<td><i class="fa fa-long-arrow-right"></i> Lehtilukusali</td>' +
                        '<td>' + magazinesStart + ' – ' + magazinesEnd + '</td>' +
                        '</tr>';
                        dayStart = magazinesStart;
                        if(dayEnd === '') {
                            dayEnd = magazinesEnd;
                        }
                    }
                    if (data.schedules[i].sections.magazines.times[1] != null) {
                        rowspanCount = rowspanCount +1;
                        magazinesStart = data.schedules[i].sections.magazines.times[1].opens;
                        magazinesStart = data.schedules[i].sections.magazines.times[1].closes;
                        magazinesAfter = '<tr class="time--sub time ' + isTodayClass + ' time--no-staff">' +
                        '<td><i class="fa fa-long-arrow-right"></i> Lehtilukusali</td>' +
                        '<td>' + selfServiceStart + ' – ' + magazinesEnd + '</td>' +
                        '</tr>';
                        dayEnd = magazinesEnd;
                    }
                }
                // Info row.
                if (data.schedules[i].info != null) {
                    rowspanCount = rowspanCount +1;
                    dayInfo = '<tr class="time--sub ' + isTodayClass + '">' +
                    '<td colspan="2"><i style="float: left" class="fa fa-info-circle" > </i><span style="float: left; margin-left: 10px;"> ' +  data.schedules[i].info + '</span></td>' +
                    '</tr>';
                }
                if (isClosed) {
                    scheludeRow = '<tr class="time ' + isTodayClass + '">' +
                    '<th scope="row" rowspan="2">' +
                        '<time datetime="' + begin.format('YYYY-MM-DD') + '">' + begin.format('D.M.') + '</time>' +
                    '</th>' +
                        '<td>' + dayName + '</td>' +
                        '<td>Suljettu</td>' +
                    '</tr>'
                } else {
                    scheludeRow = '<tr class="time ' + isTodayClass + '">' +
                    '<th scope="row" rowspan="' + rowspanCount + '">' +
                        '<time datetime="' + begin.format('YYYY-MM-DD') + '">' + begin.format('D.M.') + '</time>' +
                    '</th>' +
                        '<td>' + dayName + '</td>' +
                        '<td><time datetime="' + dayStart + '">' + dayStart + '</time> – <time datetime="' + dayEnd + '">' + dayEnd + '</time></td>' +
                    '</tr>' + selfServiceBefore + magazinesBefore + staffToday + selfServiceAfter + magazinesAfter + dayInfo;
                }
            str += scheludeRow;
            begin.add(1, 'd');
        }
        $( "#weekNumber" ).html( 'Viikko ' + moment().add(weekCounter, 'weeks').format('W'));
        $( "#weekSchelude" ).html( str );
    });
}

$(document).ready(function($) {
        // Generic details
        $.getJSON(jsonp_url + "&with=extra", function(data) { 
            $( ".library-slogan" ).append( data.extra.slogan );
            var description = data.extra.description;
            if (description != null) {
                // Turn bolded Ajankohtaista/Tervetuloa to <h2>
                description = description.replace("<strong>Ajankohtaista</strong>", "<h2>Ajankohtaista</h2>");
                description = description.replace("<strong>Tervetuloa kirjastoon!</strong>", "<h2>Tervetuloa kirjastoon!</h2>");
                $( "#intro-content" ).append( description );
            }
            if (data.extra.transit.transit_directions != null) {
                $('.transit-details').css('display', 'block');
                $('.transit-details').append('<h4>Julkinen liikenne</h4><p>' + data.extra.transit.transit_directions + '</p>')
            }
            // Replace row splits with <br>
            if (data.extra.transit.parking_instructions != null){
                var parking_instructions = data.extra.transit.parking_instructions.replace(/\r\n/g, "<br>");
                $('.transit-details').css('display', 'block');
                $('.transit-details').append('<h4>Pysäköinti</h4><p>' + parking_instructions + '</p>')
            }

            // Table "Rakennuksen tiedot".
            if (data.address.street != null) {
                $( "#buildingDetails" ).append('<tr><td><strong>Osoite: </strong></td>' +
                '<td>'  + data.address.street + ', ' + data.address.zipcode + ', ' + data.address.city + '</td></tr>');
            }
            if (data.extra.founded != null) {
                $( "#buildingDetails" ).append('<tr><td><strong>Perustamisvuosi: </strong></td>' +
                '<td>'  + data.extra.founded + '</td></tr>');
            }
            if (data.extra.building.building_name != null) {
                $( "#buildingDetails" ).append('<tr><td><strong>Rakennus: </strong></td>' +
                '<td>'  + data.extra.building.building_name + '</td></tr>');
            }
            if (data.extra.building.construction_year != null) {
                $( "#buildingDetails" ).append('<tr><td><strong>Rakennettu: </strong></td>' +
                '<td>'  + data.extra.building.construction_year + '</td></tr>');
            }
            if (data.extra.building.building_architect != null) {
                $( "#buildingDetails" ).append('<tr><td><strong>Arkkitehti: </strong></td>' +
                '<td>'  + data.extra.building.building_architect + '</td></tr>');
            }
            if (data.extra.building.interior_designer != null) {
                $( "#buildingDetails" ).append('<tr><td><strong>Sisustus: </strong></td>' +
                '<td>'  + data.extra.building.interior_designer + '</td></tr>');
            }
            // Accessibility details from extras.
            data.extra.data.forEach(function(element) {
                if(element.id == "saavutettavuus-info") {
                    $( ".accessibility-details" ).css('display', 'block');
                    $( ".accessibility-details" ).append( '<p>' + element.value + '</p>');
                }
                if(element.id == "saavutettavuus-palvelut") {
                    var splittedValues = element.value.split("\r\n");
                    $.each(splittedValues, function(index, value) { 
                        if (value == "Esteetön sisäänpääsy") {
                            $( ".accessibility-images" ).append( ' <img alt="Esteetön sisäänpääsy" src="images/accessibility/Esteetön_kulku_saavutettavuus.png" /> ');
                        }
                        else if (value == "Invapysäköinti") {
                            $( ".accessibility-images" ).append( ' <img alt="Invapysäköinti" src="images/accessibility/Esteetön_pysakointi_saavutettavuus.png" /> ');
                        }
                        $( "#accessibility-list" ).append( '<li>' + value + '</li>');
                      });
                    }
            });
        });
        // Images
        $.getJSON(jsonp_url + "&with=pictures", function(data) { 
            for (var i=0; i<data.pictures.length; i++) {
                var altCount = i + 1;
                var altText = 'Kuva kirjastolta (' + altCount  + '/' + data.pictures.length + ')';
                $( ".rslides" ).append( '<li><img src="'+ data.pictures[i].files.large + '" alt="' + altText + '"></li>');
            }
            $('#currentSlide').html(1)
            $('.top-left').append('/' + data.pictures.length);
            $(".rslides").responsiveSlides({
                navContainer: "#sliderBox"  // Selector: Where controls should be appended to, default is after the 'ul'
              });
        });
        // Social media links
        $.getJSON(jsonp_url + "&with=link_groups", function(data) { 
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
        // Scheludes
        getWeekSchelude(0);
    });

