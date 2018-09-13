
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
      element = $('#map-container').get(0);
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

$(document).ready(function($) {
    var widgets = $('.libdir_widget');
    widgets.each(function(){
        var widget = $(this);
        var lib_id = widget.attr("data-library");
        var lang = widget.attr("data-lang");
        // Generic details
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=mail_address";
        $.getJSON(jsonp_url, function(data) {
            console.log(data.address.zipcode)
            $( "#streetAddress" ).append( data.name  + '<br>' + data.address.street + '<br>' + data.address.zipcode + ' ' + data.address.city);
            $( "#postalAddress" ).append( data.name  + '<br>PL ' + data.mail_address.box_number + '<br>' + data.mail_address.zipcode + ' ' + data.mail_address.area);
            $( "#email" ).append( data.email );

            // Map coordinates (marker)
            var lon = data.address.coordinates.lon;
            var lat = data.address.coordinates.lat;
            // Position, 5 decimal degrees
            var lonDecimal = parseFloat(lon.match(/[\d][\d][^\d][\d][\d][\d][\d][\d]/));
            var latDecimal = parseFloat(lat.match(/[\d][\d][^\d][\d][\d][\d][\d][\d]/));

            // Generate the box around the marker by +- 0.0018 lat/long
            var lonBoxStart = lonDecimal - 0.0018;
            var lonBoxEnd = lonDecimal + 0.0018;
            var latBoxStart = latDecimal - 0.0018;
            var latBoxEnd = latDecimal + 0.0018;

            // Append the map to the container
            $("#map-container").append('<iframe id="map-frame" width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=' + lonBoxStart + '%2C' + latBoxStart + '%2C' + lonBoxEnd + '%2C' + latBoxEnd + '&amp;layer=mapnik&amp;marker=' + lat + '%2C' + lon + '" style="border: 1px solid black"></iframe>')


        });
        // Phone numbers.
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=phone_numbers";
        $.getJSON(jsonp_url, function(data) {
            for (var i=0; i<data.phone_numbers.length; i++) {
                $( "#phoneNumbers" ).append( '<tr>' + 
                '<td>' + data.phone_numbers[i].name + '</td>' +
                '<td>' + data.phone_numbers[i].number + '</td>' +
                '</tr>' );
            }
        });
        // Staff list
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=persons";
        $.getJSON(jsonp_url, function(data) {
            for (var i=0; i<data.persons.length; i++) {
                $( "#staffMembers" ).append( '<tr>' + 
                '<td>' + data.persons[i].first_name + ' ' + data.persons[i].first_name + '</td>' +
                '<td>' + data.persons[i].job_title + '</td>' +
                '<td>' + data.persons[i].email + '</td>' +
                '</tr>' );
            }
        });
    });
});
