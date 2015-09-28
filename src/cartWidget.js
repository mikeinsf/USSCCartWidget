
var __CartWidget = {

    ready: false,

    errors: [],

    defaultSettings: {
        DOMId: 'DIV__CART',
        pxWidth: 300,
        sessionId: null,
        host: null,
    },

    settings: null,

    CSSURI: {type: 'CSS', URI: '/style.css'},
    
    getSettings: function(u) {

        function isInt(n){
            return Number(n) === n && n % 1 === 0;
        }
     
        var d = this.defaultSettings;
        var s = {};

        if (typeof(u) == 'object') {
            if (!u.hasOwnProperty('host')) 
                this.errors.push('Settings object __CartParams must have a value for "host".');
            if (!u.hasOwnProperty('sessionId')) 
                this.errors.push('Settings object __CartParams must have a value for "sessionId".');
            if (u.length < 5) 
                this.errors.push('The sessionId must be a GUID.');
            if (u.hasOwnProperty('DOMId')) {
                if (document.getElementById(u.DOMId) == null) {
                    this.errors.push('There is no element in your DOM with id="' + u.DOMId + '".');
                } else {
                    s.DOMId = u.DOMId;
                }
            } else {
                s.DOMId = d.DOMId;
            }
            if (u.hasOwnProperty('pxWidth')) {
                if (isInt(u.pxWidth)) {
                    if (parseInt(u.pxWidth) > 0) {
                        s.pxWidth = u.pxWidth;
                    } else {
                        this.errors.push('Bad setting for pxWidth (' + u.pxWidth + '). Reverting to default value (' + d.pxWidth + ')');
                        s.pxWidth = d.pxWidth;
                    };
                } else {
                    this.errors.push('Bad setting for pxWidth (' + u.pxWidth + '). Reverting to default value (' + d.pxWidth + ')');
                }
            } else {
                s.pxWidth = d.pxWidth;
            }
        } else {
            this.errors.push('Failed to load settings for the cart. Create an object named __CartParams.');
        }
        if (this.errors.length == 0) {
            s.sessionId = u.sessionId;
            s.host = u.host;
            this.settings = s;
            this.ready = true;
        } else {
            for(var i = 0; i < this.errors.length; i++) {
                console.log('error', this.errors[i]);
            }
        }
        return this.ready;
    },

    setupPage: function () {
        var DOMId = this.settings.DOMId;
        // append the container div to the DOM
        if (document.getElementById(DOMId) == null) {
            var div = document.createElement('div');
            div.setAttribute('id', DOMId);
            document.getElementsByTagName('body')[0].appendChild(div);
        }
        // add inline CSS class to allow for variable cart widths
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        styleString = '.--cart-container .cart-box.visible { width: ' + this.settings.pxWidth + 'px; } ';
        style.innerHTML = styleString;
        head.appendChild(style);
        // load the cart CSS
        this.loadCSS(this.CSSURI);
    },

    renderCart: function () {
        // append web component to DOM
        var cartContainer = document.createElement('cart-container');
        cartContainer.setAttribute('id', 'cartContainer');
        cartContainer.className = '--cart-container';
        document.getElementById(this.settings.DOMId).appendChild(cartContainer);
        cartContainer.forceUpdate();
    },

    initCart: function (c) {
        this.getSettings(c);
        if (this.ready) {
            this.setupPage();
            this.renderCart();
        } else {
            console.error('Unable to load cart.');
        }
    },

    loadCSS: function (fileDef) {

        function loadResource(url, success) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', url);
            var head = document.getElementsByTagName('head')[0],
            done = false;
            
            // Attach handlers for all browsers
            link.onload = link.onreadystatechange = function() {
                if (!done || (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    done = true;
                    console.log('successfully loaded ' + fileDef.URI);
                    success();
                    link.onload = link.onreadystatechange = null;
                };
            };
            head.appendChild(link);
        };

        var URI = fileDef.URI;
        
        console.log('loading ' + fileDef.type + ': ' + URI);

        loadResource(URI, function() {
            // console.log('callback for ' + URI);
        });

    },

    doIt: function () {
        alert("it's done!");
    },

    showCart: function() {
        // CartUI_Drawer.toggleVisibility(true);
        document.getElementById('cartContainer').toggleVisibility(true);
        console.log('show cart for user ' + this.settings.sessionId);
    },
    
    hideCart: function() {
        document.getElementById('cartContainer').toggleVisibility(false);
        console.log('hide cart for user ' + this.settings.sessionId);
    },

}
