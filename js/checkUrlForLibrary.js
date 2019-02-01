/* We use ? to navigate right to library X, # is not passed in refUrl.
  Check the libraries of JKL, by default the main library is used. (lib param from iframe) */
function asyncCheckUrlForKeskiLibrary() {
    var urlDeferred = jQuery.Deferred();
    setTimeout(function() {
        // Custom names used for libraries of Jyväskylä.
        if(refUrl.indexOf("halssila") > -1) {
            library = 85305;
        }
        else if(refUrl.indexOf("huhtasuo") > -1) {
            library = 85533;
        }
        else if(refUrl.indexOf("keljo") > -1) {
            library = 85516;
        }
        else if(refUrl.indexOf("keltin") > -1) {
            library = 85754;
        }
        else if(refUrl.indexOf("korpi") > -1) {
            library = 85116;
        }
        else if(refUrl.indexOf("korte") > -1) {
            library = 85160;
        }
        else if(refUrl.indexOf("kuokka") > -1) {
            library = 86583;
        }
        else if(refUrl.indexOf("lohi") > -1) {
            library = 85909;
        }
        else if(refUrl.indexOf("palok") > -1) {
            library = 85732;
        }
        else if(refUrl.indexOf("saynat") > -1 || refUrl.indexOf("s%c3%a4yn%c3%a4t") > -1 ||
            refUrl.indexOf("s%C3%A4yn%C3%A4tsalo") > -1 || refUrl.indexOf("säynät") > -1) {
            library = 85117;
        }
        else if(refUrl.indexOf("tikka") > -1) {
            library = 85111;
        }
        else if(refUrl.indexOf("vaaja") > -1) {
            library = 85573;
        }
        else if(refUrl.indexOf("vesan") > -1) {
            library = 85306;
        }

        // Loop libraries and check if refUrl contains one of them and click if so.
        for (var i = 0; i < libraryList.length; i++) {
            var urlUnescapeSpaces = refUrl.replace(/%20/g, " ");
            urlUnescapeSpaces = refUrl.replace(/_/g, " ");
            var escapedName = libraryList[i].text.toLowerCase();
            escapedName = escapedName.replace(/ä/g, "a");
            escapedName = escapedName.replace(/ö/g, "o");
            if(urlUnescapeSpaces.indexOf(escapedName) > -1) {
                library = libraryList[i].id;
            }
        }
        // If no library parameter was provided.
        if(library === undefined || library === null || library === '') {
            library = 85159;
        }
        urlDeferred.resolve();
        adjustParentUrl('', 'library');

    }, 1 );
    // Return the Promise so caller can't change the Deferred
    return urlDeferred.promise();
}


