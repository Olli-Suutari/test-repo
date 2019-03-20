// This file is linked to the parent page, it adds functionality to libFrames.
var container = document.getElementById('libFrame');
// Add transition style for smooth height adjustments.
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = '#libFrame { transition: height 800ms; }';
document.head.appendChild(css);
// Event listener for messages from the iframe.
var libList;
window.addEventListener('message', function(event) {
    var data = event.data;
    if(data.type === "libList") {
        console.log(data);
        libList = data.value;
        console.log(libList);
        var currentLib = data.selectedLib;
        var lang = data.lang;
        var referrer = document.referrer;
        var currentUrl = window.location.toString();
        console.log("REFERRER: " + referrer + " URL: " + currentUrl);
        if(lang === "fi") {
            for (var i = 0; i < libList.length; i++) {
                if (referrer.indexOf(libList[i].nameEn) > -1 && libList[i].id != currentLib) {
                    var name = "?" + libList[i].nameFi;
                    currentUrl = currentUrl.replace(/\?(.*)/g, name);
                    console.log("URLRET FI: " + currentUrl);
                    //window.location.href = currentUrl;
                }
            }
        }
        else if(lang === "en") {
            for (var i = 0; i < libList.length; i++) {
                if (referrer.indexOf(libList[i].nameFi) > -1 && libList[i].id != currentLib) {
                    var name = "?" + libList[i].nameEn;
                    currentUrl = currentUrl.replace(/\?(.*)/g, name);
                    console.log("URLRET EN: " + currentUrl);
                    //window.location.href = currentUrl;
                }
            }
        }
    }
    // Scroll to position
    else if(data.type === "scroll") {
        var rect = container.getBoundingClientRect();
        var scrollToPos = rect.top + data.value;
        if(data.scrollParameter === "under") {
            // Scroll if under the scroll position
            if(window.pageYOffset > scrollToPos) {
                window.scrollTo({ top: scrollToPos, behavior: 'smooth' })
            }
        }
        else if(data.scrollParameter === "center") {
            // Scroll to position.
            window.scrollTo({ top: scrollToPos, behavior: 'smooth' })
        }
        else {
            // Scroll if above the scroll position.
            if(window.pageYOffset < scrollToPos) {
                window.scrollTo({ top: scrollToPos, behavior: 'smooth' })
            }
        }
    }
    // Resize the window.
    else if(data.type === "resize") {
        // Arena makes elements smaller in width if their height  is less than 900 something pixels...
        if(window.location.href.indexOf('keskikirjastot') > -1 && window.innerWidth > 900) {
            if(data.value < 1000) {
                data.value = 1000;
            }
        }
        container.style.height = (data.value) + "px";
    }
    // Update the url
    else if(data.type === "url") {
        try {
            history.pushState("", "", data.value);
        }
        catch (e) {
            console.log("Url failed to update: " + e);
        }
    }
});
// Hide liferay portlet title for keskikirjastot.
if(window.location.href.indexOf('keskikirjastot') > -1) {
    $( ".portlet-title" ).each(function() {
        if ($(this).context.innerText.length === 0) {
            $(this).hide();
        }
    });
}
