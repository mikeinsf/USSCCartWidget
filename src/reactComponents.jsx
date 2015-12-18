// See https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/dist/my-reactive-element.js
// this is wrapped inside a web component container

var React = require('React');
var cx = require('classnames');



var CartUI_Container = React.createClass({
    
    onClick_overlay: function(event) {
        __CartWidget.hideWidget();
    },

    onClick_checkout: function(event) {
        __CartWidget.goToCart();
    },

    render: function() {
        var width;
        if (this.props.isVisible) {
            width = this.props.pxWidth + 'px';
        } else {
            width = '0';
        }

        return (
            <div>
                <div className={cx({'overlay': true, 'visible': this.props.isVisible})} onClick={this.onClick_overlay} />
                <div className="cart-box" style={{width: width}} >
                    <div className="cart-box-fix" style={{width: this.props.pxWidth + 'px'}}>
                        <div className="cart-box-inner-wrapper">
                            <h2>Your Cart</h2>
                            <div className="button-wrap"><button onClick={this.onClick_checkout}>Proceed to Checkout</button></div>
                            <div className="camp-list"><div class="camp-list-inner-wrapper"><CampList camps={this.props.camps} /></div></div>
                            <div className="button-wrap"><button onClick={this.onClick_checkout}>Proceed to Checkout</button></div>
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
        var classNo = $(event.target).data('classno');
        __CartWidget.delete(classNo);
    },

    render: function () {
        var campRows = [];

        if (!this.props.camps || this.props.camps.length === 0) {
            return <div>No camps</div>;
        }

        for(var i=0; i < this.props.camps.length; i++) {
            var camp = this.props.camps[i];
            console.log(camp);
            campRows.push(
                <div className="camp-list-item" key={camp.classNo}>
                    <div className="camp-list-item-inner-wrapper">
                        <div className="sport"><span className="lbl">Sport:</span> <span className="sportName">{camp.sportName}</span></div>
                        <div className="class"><span className="lbl">Class:</span> <span className="classDescription">{camp.classDescription}</span></div>
                        <div className="dates"><span className="lbl">Camp Dates:</span> <span className="begins">{camp.begins} - {camp.ends}</span></div>
                        <div className="location"><span className="lbl">Location:</span> <span className="ends">{camp.city}, {camp.state}</span></div>
                        <div className="camp-delete"><button data-classno={camp.classNo} onClick={this.onClick_delete} className="delete-button mini-button">remove this camp</button></div>
                    </div>
                </div>
            );
        }

        return <div>{campRows}</div>;
    }
});

