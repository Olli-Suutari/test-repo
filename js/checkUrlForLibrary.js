/* We use ? to navigate right to library X, # is not passed in refUrl.
  Check the libraries of JKL, by default the main library is used. (lib param from iframe) */

// Function to replace short library names of Jyvaskyla with longer variants.
// TO DO: Add english or remove.
function replaceJyvaskylaLibName(replaceWith) {
    refUrl = refUrl.replace(/\?.*/g, "");
    adjustParentUrl(replaceWith, 'library');
}

function asyncCheckUrlForKeskiLibrary() {
    var urlDeferred = jQuery.Deferred();
    setTimeout(function() {
        var matchFound = false;
        // Loop libraries and check if refUrl contains one of them and click if so.
        for (var i = 0; i < libraryList.length; i++) {
            var urlUnescapeSpaces = refUrl.replace(/%20/g, " ");
            urlUnescapeSpaces = refUrl.replace(/_/g, " ");
            var escapedName = libraryList[i].text.toLowerCase();
            escapedName = escapedName.replace(/ä/g, "a");
            escapedName = escapedName.replace(/ö/g, "o");
            if(urlUnescapeSpaces.indexOf(escapedName) > -1) {
                library = libraryList[i].id;
                matchFound = true;
            }
        }
        // Custom names used for libraries of Jyväskylä.
        if(!matchFound) {
            if(refUrl.indexOf("halssila") > -1) {
                library = 85305;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("halssilan_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("halssila_library");
                }

            }
            else if(refUrl.indexOf("huhtasuo") > -1) {
                library = 85533;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("huhtasuon_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("huhtasuo_library");
                }
            }
            else if(refUrl.indexOf("keljo") > -1) {
                library = 85516;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("keljonkankaan_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("keljonkangas_library");
                }
            }
            else if(refUrl.indexOf("keltin") > -1) {
                library = 85754;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("keltinmaen_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("keltinmaki_library");
                }
            }
            else if(refUrl.indexOf("korpi") > -1) {
                library = 85116;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("korpilahden_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("korpilahti_library");
                }
            }
            else if(refUrl.indexOf("korte") > -1) {
                library = 85160;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("kortepohjan_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("kortepohja_library");
                }
            }
            else if(refUrl.indexOf("kuokka") > -1) {
                library = 86583;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("kuokkalan_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("kuokkala_library");
                }
            }
            else if(refUrl.indexOf("lohi") > -1) {
                library = 85909;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("lohikosken_pienkirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("lohikoski_library");
                }
            }
            else if(refUrl.indexOf("palok") > -1) {
                library = 85732;

                if(lang === "fi") {
                    replaceJyvaskylaLibName("palokan_aluekirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("palokka_library");
                }
            }
            else if(refUrl.indexOf("saynat") > -1 || refUrl.indexOf("s%c3%a4yn%c3%a4t") > -1 ||
                refUrl.indexOf("s%C3%A4yn%C3%A4tsalo") > -1 || refUrl.indexOf("säynät") > -1) {
                library = 85117;
                if(lang === "fi") {
                    replaceJyvaskylaLibName("saynatsalon_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("saynatsalo_library");
                }
            }
            else if(refUrl.indexOf("tikka") > -1) {
                library = 85111;
                if(lang === "fi") {
                    replaceJyvaskylaLibName("tikkakosken_lahikirjasto");
                }
                else if(lang === "en") {
                    replaceJyvaskylaLibName("tikkakoski_library");
                }
            }
            else if(refUrl.indexOf("vaaja") > -1) {
                library = 85573;

                if(lang === "fi") {
                    adjustParentUrl('vaajakosken_aluekirjasto', 'library');
                }
                else if(lang === "en") {
                    adjustParentUrl('vaajakoski_library', 'library');
                }
            }
            else if(refUrl.indexOf("vesan") > -1) {
                library = 85306;

                if(lang === "fi") {
                    adjustParentUrl('vesangan_lahikirjasto', 'library');
                }
                else if(lang === "en") {
                    adjustParentUrl('vesanka_library', 'library');
                }
            }
        }
        // If no library parameter was provided.
        if(library === undefined || library === null || library === '' || library === 85159) {
            library = 85159;
            if(lang === "fi") {
                adjustParentUrl('jyvaskylan_paakirjasto', 'library');
            }
            else if(lang === "en") {
                adjustParentUrl('main_library_(jyvaskyla)', 'library');
            }
        }
        urlDeferred.resolve();
    }, 1 );
    // Return the Promise so caller can't change the Deferred
    return urlDeferred.promise();
}


