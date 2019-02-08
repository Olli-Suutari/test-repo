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

$(document).ready(function() {

    $("#btnOpenLibryPage").append(i18n.get("Open library page"));

    $("#btnOpenLibryPage").on('click', function () {
        moveParentToLibraryUrl(libName);
    });
});

