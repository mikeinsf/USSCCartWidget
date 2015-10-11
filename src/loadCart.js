
(function() {

    function loadJS (URI, success) {

        function loadResource(url, success) {
            var script = document.createElement('script');
            script.src = url;
            script.setAttribute('data-main', __CartParams.baseUrl + 'main.js');
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

    loadJS(__CartParams.baseUrl + 'require.js', null);

})();
