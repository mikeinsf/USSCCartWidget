// See https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/dist/my-reactive-element.js
// this is wrapped inside a web component container

var React = require('React');
var cx = require('classnames');



var CartUI_Container = React.createClass({
    
    onClick_overlay: function(event) {
        if (typeof (__CartWidget) === 'undefined') { console.error('react.CartUI_Container.onClick_overlay()', '__CartWidget library not loaded'); return; }
        __CartWidget.hideWidget();
    },

    onClick_checkout: function(event) {
        if (typeof (__CartWidget) === 'undefined') { console.error('react.CartUI_Container.onClick_checkout()', '__CartWidget library not loaded'); return; }
        __CartWidget.goToCart();
    },

    render: function() {
        var allowCheckout = !(!this.props.camps || this.props.camps.length === 0);
        return (
            <div>
                <div id="cartOverlay" className={cx({'overlay': true, 'visible': this.props.isVisible})} onClick={this.onClick_overlay} />
                <div className={cx({'cart-box': true, 'visible': this.props.isVisible})}>
                    <div className="cart-box-fix">
                        <div className="cart-box-inner-wrapper">
                            <h2>Your Cart</h2>
                            <div className="arrow-down-dark"></div>
                            <div className="button-wrap">
                                <button className={cx({'btn-checkout': true, 'hide-this': !allowCheckout})} onClick={this.onClick_checkout}>Proceed to Checkout</button>
                                <button className="btn-continueshopping" onClick={this.onClick_overlay}>Continue Shopping</button>
                            </div>
                            <div className="camp-list"><div className="camp-list-inner-wrapper"><CampList camps={this.props.camps} /></div></div>
                            <div className="button-wrap">
                                <button className={cx({'btn-checkout': true, 'hide-this': !allowCheckout})} onClick={this.onClick_checkout}>Proceed to Checkout</button>
                                <button className="btn-continueshopping" onClick={this.onClick_overlay}>Continue Shopping</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

});


var CampList = React.createClass({

    // --- available fields
    // public string classNo;
    // public string sportName;
    // public string sportDescription;
    // public string className;
    // public string classDescription;
    // public string city;
    // public string state;
    // public string begins;
    // public string ends;

    onClick_delete: function(event) {
        if (typeof (__CartWidget) === 'undefined') { console.error('react.CampList.onClick_delete()', '__CartWidget library not loaded'); return; }
        var classNo = $(event.target).data('classno');
        __CartWidget.delete(classNo);
    },

    normalizeDate: function(datestring) {
        if (typeof (__CartWidget) === 'undefined') { console.error('react.CampList.normalizeDate()', '__CartWidget library not loaded'); return; }
        return __CartWidget.normalizeDate(datestring);
    },

    datesLabel: function(d1, d2){
        return (d1===d2) ? 'Date' : 'Dates';
    },

    datesValue: function(d1, d2){
        return (d1===d2) ? this.normalizeDate(d1) : this.normalizeDate(d1) + '-' + this.normalizeDate(d2);
    },

    render: function () {
        var campRows = [];

        if (!this.props.camps || this.props.camps.length === 0) {
            return <div>You have no camps in your cart.</div>;
        }

        for(var i=0; i < this.props.camps.length; i++) {
            var camp = this.props.camps[i];
            // console.log(camp);
            campRows.push(
                <div className="camp-list-item" key={camp.classNo}>
                    <div className="camp-list-item-inner-wrapper">
                        <div className="sport"><span className="lbl">Sport:</span> <span className="sportName">{camp.sportName}</span></div>
                        <div className="class"><span className="lbl">Class:</span> <span className="classDescription">{camp.classDescription}</span></div>
                        <div className="dates">
                            <span className="lbl">Camp {this.datesLabel(camp.begins, camp.ends)}:</span> 
                            <span className="begins">{this.datesValue(camp.begins, camp.ends)}</span>
                        </div>
                        <div className="location"><span className="lbl">Location:</span> <span className="ends">{camp.city}, {camp.state}</span></div>
                        <div className="camp-delete"><button data-classno={camp.classNo} onClick={this.onClick_delete} className="delete-button mini-button">remove this camp</button></div>
                    </div>
                </div>
            );
        }

        return <div>{campRows}</div>;
    }
});

