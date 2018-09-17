// Function for adding a new item.
function addItem(item, listElement) {
    var name = item.name;
    // Use "custom_name", where available.
    if (item.custom_name != null) {
        name = item.custom_name;
    }
    // Add popup link if additional details are available.
    if(item.short_description != null) {
        var description = item.short_description;
        var websiteLink = item.website;
        // Add "long" description where available.
        if (item.description != null) {
            // Replace row splits with <br>
            var longDescription = item.description.replace(/\r\n/g, "<br>");
            description = description + '<br><br>' + longDescription;
        }
        // Add price where available.
        if (item.price != null) {
            description = description + '<br><br>Hintatiedot: ' +  item.price;
        }
        // Add the item to a desired element.
        $( listElement ).append('<li> ' + 
        '<a class="index-item" data-message="' + description + '" data-website="' + websiteLink + '" tabindex="0" href="#"' +
        'role="button" aria-expanded="false" aria-controls="' + name + '"' +
        'title="' + name + '">' + name + '</a></li>');
    // If no description found, don't create the link
    } else {
        $( listElement ).append('<li> ' + 
        name + '</li>');
    }
}


$(document).ready(function($) {
    var widgets = $('.libdir_widget');
    widgets.each(function(){
        var widget = $(this);
        var lib_id = widget.attr("data-library");
        var lang = widget.attr("data-lang");
        // Generic details
        var jsonp_url = "https://api.kirjastot.fi/v3/library/" + lib_id + "?lang=" + lang + "&with=services";
        $.getJSON(jsonp_url, function(data) {
            var collectionCount = 0;
            var hardwareCount = 0;
            var roomCount = 0;
            var serviceCount = 0;
            for (var i=0; i<data.services.length; i++) {
                 // Collections
                if (data.services[i].type == "collection") {
                    collectionCount = collectionCount +1;
                    addItem(data.services[i], '#collectionItems');
                }
                // Hardware
                else if (data.services[i].type == "hardware") {
                    hardwareCount = hardwareCount +1;
                    addItem(data.services[i], '#hardwareItems');
                }
                // Rooms
                else if (data.services[i].type == "room") {
                    roomCount = roomCount +1;
                    addItem(data.services[i], '#roomItems'); 
                }
                // Services
                else if (data.services[i].type == "service") {
                    serviceCount = serviceCount +1;
                    addItem(data.services[i], '#serviceItems');  
                }
            }
            // Show titles & counts if found.
            if (collectionCount != 0) {
                $( "#collection" ).css('display', 'block');
                $( "#collectionBadge" ).append('(' + collectionCount + ')');
            }
            if (hardwareCount != 0) {
                $( "#hardware" ).css('display', 'block');
                $( "#hardwareBadge" ).append('(' + hardwareCount + ')');
            }
            if (roomCount != 0) {
                $( "#room" ).css('display', 'block');
                $( "#roomBadge" ).append('(' + roomCount + ')');
            }
            if (serviceCount != 0) {
                $( "#service" ).css('display', 'block');
                $( "#serviceBadge" ).append('(' + serviceCount + ')');
            }
            
            // When item link is clicked.
            $( ".index-item" ).on('click', function () {
                // If infobox already visible, hide it instantly to avoid wonky animations.
                if(isInfoBoxVisible) {
                    toggleInfoBox(0);
                }
                // Get element position
                var posX = $(this).offset().left,
                // Set top to be slightly under the element
                posY = $(this).offset().top + 20;
                // Set popup position & content, toggle visibility.
                $( "#infoPopup" ).css ('transform', 'translate3d(' + posX + 'px,' + posY + 'px, 0px')
                $( "#popover-content" ).html( '<p id="popover-content">' + $(this).data('message') + '</p>');
                // If website is not null and contains stuff. Sometimes empty website is shown unless lenght is checked.
                if ($(this).data('website') != null && $(this).data('website').length > 5) {
                    $( "#link-to-info" ).html( '<p id="link-to-info"><a href="' + $(this).data('website') + 
                    '" class="external-link">Lisätietoja</a></p>');
                } else {
                    $( "#link-to-info" ).html( '<p id="link-to-info"></p>');
                }
                toggleInfoBox(100);
             });
        });
    });
});