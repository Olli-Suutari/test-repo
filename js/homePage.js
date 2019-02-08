function moveParentToLibraryUrl(toAdd) {
    toAdd = toAdd.toLowerCase();
    toAdd = toAdd.replace(/ /g, "-");
    toAdd = toAdd.replace(/ä/g, "a");
    toAdd = toAdd.replace(/ö/g, "o");
    toAdd = toAdd.replace(/\(/g, "");
    toAdd = toAdd.replace(/\)/g, "");
    toAdd =  libPageUrl + "?" + toAdd;
    try {
        parent.postMessage({value: toAdd, type: 'redirect'}, '*');
    }
    catch (e) {
        console.log("Parent redirect failed: " + e);
    }
}

// Timer  is used to stop onresize event from firing after adjustment is done by triggering the function manually.
var isAdjustingHeight = false;
var clearTimer;
function setAdjustingToFalse() {
    clearTimer = setTimeout(function(){
        isAdjustingHeight = false;
    }, 1200);
}

function adjustHomePageHeight(delay) {
    clearTimeout(clearTimer);
    isAdjustingHeight = true;
    delay = delay + 150;
    setTimeout(function(){
        try {
            var newHeight = 15;
            newHeight = newHeight + document.getElementById("homePageWidget").scrollHeight;
            if(newHeight !== height) {
                parent.postMessage({value: newHeight, type: 'resize'}, '*');
            }
            height = newHeight;
            setAdjustingToFalse();

        }
        catch (e) {
            console.log("iframe size adjustment failed: " + e);
        }
    }, delay);
}

$(document).ready(function() {

    $("#btnOpenLibryPage").append(i18n.get("Open library page"));

    adjustHomePageHeight(150);

    $("#btnOpenLibryPage").on('click', function () {
        moveParentToLibraryUrl(libName);
    });
});

