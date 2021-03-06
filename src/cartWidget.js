var __CartWidget = {

    ready: false,

    errors: [],

    settings: {
        insertDomId: 'DIV__CART',
        webServiceEndpoint: '/ws.asmx',
        cartEndpoint: '/responsive/init.aspx?cartGuid=',
        cartEndpointX: '/init/',
        cookieTTL: 30,                              // in days
        datemask: 'MM/DD/YYYY',
    },
    
    normalizeDate: function (sDate) {
        // relies on momentjs library
        var s = this.settings;
        var retval = sDate;
        if (typeof (moment) == 'undefined' || typeof (s.datemask) == 'undefined') {
            if (typeof (moment) == 'undefined') { console.error('momentjs library not loaded'); }
            if (typeof (s.datemask) == 'undefined') { console.error('datemask not defined'); }
            return retval;
        } else {
            try{ retval = moment(sDate, 'MM/DD/YYYY hh:mm:ss A').format(s.datemask); } 
            catch(e) { console.error('Error converting datetime [' + sDate + '] using mask [' + s.datemask + ']' , e); }
        }
        return retval;
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
            if (!u.hasOwnProperty('path')) 
                this.errors.push('Settings object __CartParams must have a value for "path".');
            if (!u.hasOwnProperty('hostSiteGuid')) 
                this.errors.push('Settings object __CartParams must have a value for "hostSiteGuid".');
            if (!u.hasOwnProperty('targetSiteGuid')) 
                this.errors.push('Settings object __CartParams must have a value for "targetSiteGuid".');
            if (u.hasOwnProperty('datemask')) {
                s.datemask = u.datemask;
            }
            if (u.hasOwnProperty('insertDomId')) {
                if (document.getElementById(u.insertDomId) == null) {
                    console.log('Cannot find user-specified DOM element id="' + u.insertDomId + '". Fix or omit setting for __CartParams.insertDomId to eliminate this warning. Using default DOM element id="' + d.insertDomId + '".');
                } else {
                    s.insertDomId = u.insertDomId;
                }
            }
        } else {
            this.errors.push('Failed to load settings for the cart. Create an object named __CartParams.');
        }
        if (this.errors.length == 0) {
            s.path = u.path;
            s.cartFolder = u.cartFolder;
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
        var DOMId = s.insertDomId;

        // append the container div to the DOM
        if (document.getElementById(DOMId) == null) {
            var div = document.createElement('div');
            div.setAttribute('id', DOMId);
            document.getElementsByTagName('body')[0].appendChild(div);
        }
        
        // load the cart CSS
        var cssUrl = s.path[0] + s.path[1] + '/style.css[RANDOM]';
        this.loadCSS(cssUrl);

            var div = document.createElement('div');
            div.setAttribute('id', 'divTest');
            document.getElementsByTagName('body')[0].appendChild(div);

    },

    renderCart: function () {
        var s = this.settings;
        var DOMId = s.insertDomId;

        // append web component to DOM
        var cartContainer = document.createElement('div');
        cartContainer.setAttribute('id', 'cartContainer');
        cartContainer.className = '--cart-container';
        document.getElementById(DOMId).appendChild(cartContainer);
        React.render(
            React.createElement(CartUI_Container, {camps: null, isVisible: false}, null),
            document.getElementById('cartContainer')
        );
    },

    initCart: function () {
        this.initSettings(__CartParams);
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

    showWidget: function() {
        this.list();
    },
    
    hideWidget: function() {
        React.render(
            React.createElement(CartUI_Container, {camps: null, isVisible: false}, null),
            document.getElementById('cartContainer')
        );
        $('body').prepend($('[body-container]>div.footer'));
        $('body').prepend($('[body-container]>div.outer-wrapper'));
        $('[body-container]').remove();
    },

    listCamps: function (camps) {
        $('body').append('<div body-container="" style="overflow:hidden;"></div>');
        $('[body-container]').append($('body>div.outer-wrapper'));
        $('[body-container]').append($('body>div.footer'));
        React.render(
            React.createElement(CartUI_Container, {camps: camps, isVisible: true}, null),
            document.getElementById('cartContainer')
        );
    },



    ////////////////////////
    // navigate to cart
    ////////////////////////

    goToCart: function () {
        var cartGuid = this.getCartGuid();
        var path = this.settings.path[0] + this.settings.cartEndpoint + cartGuid;
        window.location.href = path;
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
            url: s.path[0] + s.path[1] + s.webServiceEndpoint + '/List',
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
            url: s.path[0] + s.path[1] + s.webServiceEndpoint + '/Add',
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
            url: s.path[0] + s.path[1] + s.webServiceEndpoint + '/Delete',
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
            url: s.path[0] + s.path[1] + s.webServiceEndpoint + '/Clear',
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
        if (value=='0' || value == 'null' || value == null) {
            cookie.remove('cartGuid');
        } else {
            cookie.set('cartGuid', value, {
                expires: this.settings.cookieTTL,
                path: '/',
            });
        }
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
