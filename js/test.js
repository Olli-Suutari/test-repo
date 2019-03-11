
// divClone & active tab are used with consortium.js
var divClone = '';
var map;

    //$('#mainContainer').append('<p id="test">awafr</p>');





        function getScript(source, callback) {
            var script = document.createElement('script');
            var prior = document.getElementsByTagName('script')[0];
            script.async = 1;

            script.onload = script.onreadystatechange = function( _, isAbort ) {
                if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                    script.onload = script.onreadystatechange = null;
                    script = undefined;

                    if(!isAbort) { if(callback) callback(); }
                }
            };

            script.src = source;
            prior.parentNode.insertBefore(script, prior);
        }



var scripts = document.getElementsByTagName("script"),
    src = scripts[scripts.length-1].src;

console.log("src "  + src);

        src = src.replace("test.js", "");

console.log("src "  + src);

getScript(src + "/lib/jquery-3.3.1.min.js", foo());

        //$( "#mainContainer" ).load( "homePage.html" );
        // script is now loaded and executed.
        // put your dependent JS here.
        //foo();

        function foo() {
            setTimeout(function(){
                $.get(src + "../pages/homePageNew.html")
                    .done((data) => {
                        //console.info(data); // output the content of the html file
                        var head = data.match(/<head[^>]*>[\s\S]*<\/head>/gi);
                        var body = data.match(/<body[^>]*>[\s\S]*<\/body>/gi);
                        console.log(head);
                        $("head").append(head);
                        $("#mainContainer").replaceWith(body);

                        /*
                        $.getScript('../js/test-two.js', function()
                        {
                            //$( "#mainContainer" ).load( "homePage.html" );
                            // script is now loaded and executed.
                            // put your dependent JS here.
                            //foo();
                        });
                        */


                    });
            }, 200);


        }



