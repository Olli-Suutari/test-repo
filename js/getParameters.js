// Get global library/lang parameters from the script.
var library;
var lang;
var city;
var consortium;
var largeSchedules = false;
var homePage = false;
var libPageUrl;
var refUrl;
// Get parameters from iframe url.
function getParamValue(paramName) {
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++)
    {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName)
            return pArr[1]; //return value
    }
}
library = getParamValue('lib');
lang = getParamValue('lang');
city = getParamValue('city');
consortium = getParamValue('consortium');
/* Large schedules are used in iDiD info screens. */
if(getParamValue('large') === 'true') {
    largeSchedules = true;
}
// HomePage & libPageUrl are used in lite versions functions.
libPageUrl = getParamValue('libPageUrl');
if(libPageUrl !== undefined) {
    homePage = true;
}

/* Old method, to be removed */
if(getParamValue('font') == 'l' || getParamValue('font') == 'xl') {
    largeSchedules = true;
}
/* Alternative:   <script data-library="85111" data-lang="fi" src="../../js/main.js" type="text/javascript"></script>*/
// If lang and lib are undefined (not used in iframe)
if(lang == undefined && library == undefined){
    var scripts = document.getElementsByTagName('script');
    var scriptName = scripts[scripts.length-1];
    library = scriptName.getAttribute('data-library'),
        lang = scriptName.getAttribute('data-lang')
}

// Setup the translations.
var i18n = $('body').translate({lang: lang, t: dict}); // Use the correct language
$("html").attr("lang", lang);

// Get referrer url (Iframe parent). If Library name is set, use that as the default (checkUrlForLibrary.js).
// This is also used for navigating to service x by default.
refUrl = (window.location != window.parent.location)
    ? document.referrer
    : document.location.href;
refUrl = refUrl.toLocaleLowerCase();
if(refUrl.length === 0) {
    refUrl = window.location.href;
}
// Navigate to contacts or services, if parameter is in the url.
// Active tab: 0 = info, 1 = contact details, 3 = services.
var activeTab = 0;
if(refUrl.indexOf("yhteys") > -1 || refUrl.indexOf("contact") > -1) {
    activeTab = 1;
}
// https://stackoverflow.com/questions/3922139/add-css-to-head-with-javascript
function addCssToDocument(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
}

// Generate colors for less.
var primary = getParamValue('primary');
var links = getParamValue('links');
var linksHover = getParamValue('linksHover');
var linksExternal = getParamValue('linksExternal');

console.log(primary);

if(primary === undefined){
    primary = "#026FCF";
}
else {
    primary = "#" + primary;
}

if(links === undefined){
    links = "#0b62c1";
}
else {
    links = "#" + links;
}

if(linksHover === undefined){
    linksHover = "#0050a8";
}
else {
    linksHover = "#" + linksHover;
}

if(linksExternal === undefined){
    linksExternal = "#026FCF";
}
else {
    linksExternal = "#" + linksExternal;
}

primary = "@primary: " + primary + "; ";
links = "@links: " + links + "; ";
linksHover = "@linksHover: " + linksHover + "; ";
linksExternal = "@linksExternal: " + linksExternal + "; ";

var lessVariables = primary + links + linksHover + linksExternal;

/*
    less.modifyVars({
    '@primary': primary,
    '@links': links,
    '@linksHover': linksHover,
    '@linksExternal': linksExternal
});

less.registerStylesheets().then(
    function () {
        console.log("HAHFH");

        less.refreshStyles();
    }
);
*/


var client = new XMLHttpRequest();
client.open('GET', '../style/style.less');
console.log("HEHHAHA");
client.onreadystatechange = function() {
    //console.log(client.responseText);
    less.render(lessVariables + client.responseText)
        .then(function(output) {
            //console.log(output.css)
            //console.log(output.css);
            addCssToDocument(output.css);
        });
};
client.send();

var clientTwo = new XMLHttpRequest();
clientTwo.open('GET', '../style/library.less');
clientTwo.onreadystatechange = function() {
    //console.log(clientTwo.responseText);
    less.render(lessVariables + clientTwo.responseText)
        .then(function(output) {
            //console.log(output.css)
            addCssToDocument(output.css);
        });
};
clientTwo.send();

var clientThree = new XMLHttpRequest();
clientThree.open('GET', '../style/homepage.less');
clientThree.onreadystatechange = function() {
    //console.log(clientThree.responseText);
    less.render(lessVariables + clientThree.responseText)
        .then(function(output) {
            //console.log(output.css)
            addCssToDocument(output.css);
        });
};
clientThree.send();