$(document).ready(function($) {
    var widgets = $('.libdir_widget');
    widgets.each(function(){
        var widget = $(this);
        var lib_id = widget.attr("data-library");
        var lang = widget.attr("data-lang");
        // Generic details
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=mail_address";
        console.log(jsonp_url);
        $.getJSON(jsonp_url, function(data) { 
            console.log(data.address.zipcode)
            $( "#streetAddress" ).append( data.name  + '<br>' + data.address.street + '<br>' + data.address.zipcode + ' ' + data.address.city);
            $( "#postalAddress" ).append( data.name  + '<br>PL ' + data.mail_address.box_number + '<br>' + data.mail_address.zipcode + ' ' + data.mail_address.area);
            $( "#email" ).append( data.email );

            $( ".map-view" ).attr( "data-map", "12.23846200,15.74279600" )
            /*
            $( ".map-container" ).append( '<div class="map-scroll-block" id="block-85159">' +
            '<div class="ol-full-screen ol-unselectable ol-control ">' +
            '</div>' +
          '</div>' +
          '<div class="map-view" data-map="62.23846200,25.74279600" data-scroll-block="block-85159"> ' +
            '<div class="ol-viewport" data-view="5" style="position: relatic; overflow: hidden; width: 100%; height: 100%; touch-action: none;">' +
            '<canvas class="ol-unselectable" width="350" height="208" style="width: 100%; height: 100%; display: block;">' +
              '</canvas>' +
              '<div class="ol-overlaycontainer"></div>' +
              '<div class="ol-overlaycontainer-stopevent">' +
              '<div class="ol-full-screen ol-unselectable ol-control ">' +
                '<button class="ol-full-screen-false" type="button" title="Toggle full-screen">⤢</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' )*/

            $('head').append($('<script>').attr('type', 'text/javascript').attr('src', 'hakemisto.js'));
        });
    });
});
