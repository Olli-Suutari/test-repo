$(document).ready(function($) {
    var widgets = $('.libdir_widget');
    widgets.each(function(){
        var widget = $(this);
        var lib_id = widget.attr("data-library");
        var lang = widget.attr("data-lang");
        // Generic details
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=extra";
        console.log(jsonp_url);
        $.getJSON(jsonp_url, function(data) { 
            console.log(data.address.zipcode)
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
            console.log(data.schedules[0].opens)
            moment.locale("fi")
            var date = moment(),
                begin = moment(date).startOf('week').isoWeekday(1);
            var str = "";
            for (var i=0; i<7; i++) {
                if (data.schedules[i].opens != null) {
                    str += '<tr><td>' + begin.format('dddd D.M.Y') + '</td><td>Aukioloaika: '  + data.schedules[i].opens + ' - ' + data.schedules[i].closes + '<br>' + data.schedules[i].info + '</tr></td><br>';
                }
                else {
                    str += '<tr><td>' + begin.format('dddd D.M.Y') + '</td><td>Suljettu</tr></td><br>'; 
                }

                begin.add(1, 'd');
            }
            $( "#weekSchelude" ).append( str );
            $( "#weekNumber" ).append( "Viikko " + moment().format('W') );
        });
        // Images
        jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=pictures";
        $.getJSON(jsonp_url, function(data) { 
            console.log(data.pictures.length)
            console.log(data.pictures[0].files.medium);
            $( ".photoQuantity" ).append( data.pictures.length + " kuvaa" );
            $("#coverPhoto").attr("src", data.pictures[0].files.medium);
        });
    });
});
