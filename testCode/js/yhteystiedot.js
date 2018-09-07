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
            //$( ".map-view" ).attr( "data-map", "12.23846200,15.74279600" )
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


<<<<<<< HEAD
=======
            $('head').append($('<script>').attr('type', 'text/javascript').attr('src', 'hakemisto.js'));
        });
>>>>>>> aba89c5736c98e4948cbf94a505d086f828e9fe1
    });
});
