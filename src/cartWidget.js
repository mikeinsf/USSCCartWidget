var __CartWidget = {

    ready: false,

    errors: [],

    settings: {
        insertDomId: 'DIV__CART',
        cartWidgetFolder: '/cart-widget',
        webServiceEndpoint: '/ws.asmx',
        cartEndpoint: '/step1',
    },
    


    ////////////////////////
    // cart initialization functions
    ////////////////////////

    initSettings: function(u) {

        function isInt(str){
            var n = ~~Number(str);
            return String(n) === str && n >= 0;
        }
     
        var s = this.settings;

        if (typeof(u) == 'object') {
            if (!u.hasOwnProperty('baseUrl')) 
                this.errors.push('Settings object __CartParams must have a value for "baseUrl".');
            if (!u.hasOwnProperty('hostSiteGuid')) 
                this.errors.push('Settings object __CartParams must have a value for "hostSiteGuid".');
            if (!u.hasOwnProperty('targetSiteGuid')) 
                this.errors.push('Settings object __CartParams must have a value for "targetSiteGuid".');
            if (u.hasOwnProperty('insertDomId')) {
                if (document.getElementById(u.insertDomId) == null) {
                    console.log('Cannot find user-specified DOM element id="' + u.insertDomId + '". Fix or omit setting for __CartParams.insertDomId to eliminate this warning. Using default DOM element id="' + d.insertDomId + '".');
                } else {
                    s.insertDomId = u.insertDomId;
                }
            }
            if (u.hasOwnProperty('pxWidth')) {
                if (isInt(u.pxWidth)) {
                    s.pxWidth = u.pxWidth;
                } else {
                    this.errors.push('Bad setting for pxWidth (' + u.pxWidth + '). Value must be a positive integer, or leave it blank for default width.');
                }
            }
        } else {
            this.errors.push('Failed to load settings for the cart. Create an object named __CartParams.');
        }
        if (this.errors.length == 0) {
            s.baseUrl = u.baseUrl;
            s.hostSiteGuid = u.hostSiteGuid;
            s.targetSiteGuid = u.targetSiteGuid;
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
        var s = this.settings;
        var DOMId = s.DOMId;

        // append the container div to the DOM
        if (document.getElementById(DOMId) == null) {
            var div = document.createElement('div');
            div.setAttribute('id', DOMId);
            document.getElementsByTagName('body')[0].appendChild(div);
        }
        
        // load the cart CSS
        var cssUrl = s.baseUrl + s.cartWidgetFolder + '/style.css';
        this.loadCSS(cssUrl);
    },

    renderCart: function () {
        // append web component to DOM
        var cartContainer = document.createElement('cart-container');
        cartContainer.setAttribute('id', 'cartContainer');
        cartContainer.className = '--cart-container';
        document.getElementById(this.settings.DOMId).appendChild(cartContainer);
        this.setReactState();
        cartContainer.forceUpdate();
    },

    initCart: function (c) {
        this.initSettings(c);
        if (this.ready) {
            this.setupPage();
            this.renderCart();
        } else {
            console.error('Unable to load cart.');
        }
    },

    loadCSS: function (URI) {

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
                    console.log('successfully loaded ' + URI);
                    success();
                    link.onload = link.onreadystatechange = null;
                };
            };
            head.appendChild(link);
        };

        loadResource(URI, function() {
            // console.log('callback for ' + URI);
        });

    },



    ////////////////////////
    // interactions with reactComponents methods
    ////////////////////////

    setReactState: function () {
        var s = this.settings;
        var initialState = {};
        if (s.pxWidth) { 
             initialState.pxWidth = s.pxWidth;
        }
        initialState.baseUrl = s.baseUrl;
        document.getElementById('cartContainer').setState(initialState);
    },

    showCart: function() {
        this.list();
    },
    
    hideCart: function() {
        document.getElementById('cartContainer').toggleVis(false);
    },

    listCamps: function (camps) {
        // camps is an array of camp objects
        document.getElementById('cartContainer').listCamps(camps);
    },



    ////////////////////////
    // navigate to cart
    ////////////////////////

    goToCart: function () {
        window.location.href = this.settings.baseUrl + this.settings.cartEndpoint;
    },



    ////////////////////////
    // ajax methods that modify cart data
    ////////////////////////

    list: function () {
        var s = this.settings;
        var cartGuid = this.getCartGuid();
        if (!cartGuid) {
            alert('Error listing cart. Missing cartGuid cookie.');
            return;
        }

        var data = {
            m_cartguid : cartGuid,
            m_hostsiteguid : s.hostSiteGuid,
            m_targetsiteguid : s.targetSiteGuid,
        };
        var ajaxOpts = $.extend(ajaxDefaults.json, {
            url: s.baseUrl + s.webServiceEndpoint + '/List',
            data: data,
            success: function (msg) {
                if (msg.success) {
                    __CartWidget.listSuccess(msg);
                } else {
                    alert(msg.message);
                }
            },
        });
        $.ajax(ajaxOpts);
    },

    listSuccess: function (msg) {
        console.log('listing camps');
        this.setCartGuid(msg.cartGuid);
        this.listCamps(msg.camps);
    },

    add: function (classNo) {
        var s = this.settings;
        var cartGuid = this.getCartGuid();
        if (!cartGuid) cartGuid = '';

        var data = {
            m_cartguid : cartGuid,
            m_classno : classNo,
            m_hostsiteguid : s.hostSiteGuid,
            m_targetsiteguid : s.targetSiteGuid,
        };
        var ajaxOpts = $.extend(ajaxDefaults.json, {
            url: s.baseUrl + s.webServiceEndpoint + '/Add',
            data: data,
            success: function (msg) {
                if (msg.success) {
                    __CartWidget.addSuccess(msg);
                } else {
                    alert(msg.message);
                }
            },
        });
        $.ajax(ajaxOpts);
    },

    addSuccess: function (msg) {
        console.log('adding camp successful');
        this.setCartGuid(msg.cartGuid);
        this.listCamps(msg.camps);
    },

    delete: function (classNo) {
        var s = this.settings;
        var cartGuid = this.getCartGuid();
        if (!cartGuid) {
            alert('Error deleting from cart. Missing cartGuid cookie.');
            return;
        }

        var data = {
            m_cartguid : cartGuid,
            m_classno : classNo,
            m_hostsiteguid : s.hostSiteGuid,
            m_targetsiteguid : s.targetSiteGuid,
        };
        var ajaxOpts = $.extend(ajaxDefaults.json, {
            url: s.baseUrl + s.webServiceEndpoint + '/Delete',
            data: data,
            success: function (msg) {
                if (msg.success) {
                    __CartWidget.deleteSuccess(msg);
                } else {
                    alert(msg.message);
                }
            },
        });
        $.ajax(ajaxOpts);
    },

    deleteSuccess: function (msg) {
        console.log('deleting camp successful');
        this.setCartGuid(msg.cartGuid);
        this.listCamps(msg.camps);
    },

    clear: function () {
        var s = this.settings;
        var cartGuid = this.getCartGuid();
        if (!cartGuid) {
            alert('Error clearing cart. Missing cartGuid cookie.');
            return;
        }

        var data = {
            m_cartguid : cartGuid,
            m_hostsiteguid : s.hostSiteGuid,
            m_targetsiteguid : s.targetSiteGuid,
        };
        var ajaxOpts = $.extend(ajaxDefaults.json, {
            url: s.baseUrl + s.webServiceEndpoint + '/Clear',
            data: data,
            success: function (msg) {
                if (msg.success) {
                    __CartWidget.clearSuccess(msg);
                } else {
                    alert(msg.message);
                }
            },
        });
        $.ajax(ajaxOpts);
    },

    clearSuccess: function (msg) {
        console.log('clearing cart successful');
        this.setCartGuid(msg.cartGuid);
        this.listCamps([]);
    },



    ////////////////////////
    // cookie functions
    ////////////////////////

    getCartGuid: function() {
        var cartGuid = cookie.get('cartGuid');
        return (cartGuid) ? cartGuid : '0';
    },

    setCartGuid: function(value) {
        cookie.set('cartGuid', value, {
            expires: 1,
            path: '/',
        });
    },



    ////////////////////////
    // helper functions
    ////////////////////////

    getKeyNames: function (obj) {
        var keynames = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keynames.push(key);
            }
        }
        return keynames;
    },

}



////////////////////////
// AJAX GLOBAL CODE
////////////////////////

var ajaxDefaults = {};

ajaxDefaults.base = {
    timeout: 100000,
    error: function (xhr) {
        //see 
        if (!xhr) return;
        if (xhr.responseText) {
            var response = JSON.parse(xhr.responseText);
            //console.log works in FF + Firebug only, replace this code 
            if (response) console.log(response);
            else console.log("Unknown server error");
        }
    }
};

ajaxDefaults.json = $.extend(ajaxDefaults.base, {
    //see http://encosia.com/2008/03/27/using-jquery-to-consume-aspnet-json-web-services/ 
    contentType: "application/json; charset=utf-8",
    dataType: "jsonp"
});
