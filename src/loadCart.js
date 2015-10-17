
(function() {

    var scriptPath = __CartParams.path[0] + __CartParams.path[1];

    function loadJS (URI, success) {

        function loadResource(url, success) {
            var script = document.createElement('script');
            script.src = url;
            script.setAttribute('data-main', scriptPath + '/main.js');
            var head = document.getElementsByTagName('head')[0],
            done = false;
            
            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function() {
                if (!done || (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    done = true;
                    console.log('successfully loaded ' + URI);
                    if(success) {
                        success();
                    }
                    script.onload = script.onreadystatechange = null;
                    head.removeChild(script);
                };
            };
            head.appendChild(script);
        };

        console.log('loading ' + URI);

        loadResource(URI, success);

    }

    // opted for jquery method of loading requirejs because IE (surprise surprise) does not like dynamic setting of non-standard tag attributes like "data-main"
    // this requires that jquery library MUST BE LOADED FIRST
    $(document).ready(function(){
        $('head').append('<script src="' + scriptPath + '/require.js" data-main="' + scriptPath + '/main.js"></script>');
    });

    // this is commented out bc IE is terrible
    // loadJS(__CartParams.baseUrl + '/cart-widget/require.js', null);

})();

