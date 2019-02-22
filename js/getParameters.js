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

// Generate lessVariables.
primary = "@primary: " + primary + "; ";
links = "@links: " + links + "; ";
linksHover = "@linksHover: " + linksHover + "; ";
linksExternal = "@linksExternal: " + linksExternal + "; ";
var lessVariables = primary + links + linksHover + linksExternal;

var styleCssXml = new XMLHttpRequest();
styleCssXml.open('GET', '../style/style.less');
styleCssXml.onreadystatechange = function() {
    //console.log(styleCssXml.responseText);
    less.render(lessVariables + styleCssXml.responseText)
        .then(function(output) {
            //console.log(output.css)
            //console.log(output.css);
            addCssToDocument(output.css);
        });
};
styleCssXml.send();

// TO DO: This is still included in stand-alone schedules that are not large...
if(!largeSchedules && !homePage) {
    var libraryCssXml = new XMLHttpRequest();
    libraryCssXml.open('GET', '../style/library.less');
    libraryCssXml.onreadystatechange = function() {
        //console.log(libraryCssXml.responseText);
        less.render(lessVariables + libraryCssXml.responseText)
            .then(function(output) {
                //console.log(output.css)
                addCssToDocument(output.css);
            });
    };
    libraryCssXml.send();  
}

if(homePage) {
    var homePageCssXml = new XMLHttpRequest();
    homePageCssXml.open('GET', '../style/homepage.less');
    homePageCssXml.onreadystatechange = function() {
        //console.log(homePageCssXml.responseText);
        less.render(lessVariables + homePageCssXml.responseText)
            .then(function(output) {
                //console.log(output.css)
                addCssToDocument(output.css);
            });
    };
    homePageCssXml.send();
}
