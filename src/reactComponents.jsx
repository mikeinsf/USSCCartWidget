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
                        <h2>Your Cart</h2>
                        <div><button onClick={this.onClick_checkout}>Proceed to Checkout</button></div>
                        <div className="camp-list"><CampList camps={this.props.camps} /></div>
                        <div><button onClick={this.onClick_checkout}>Proceed to Checkout</button></div>
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
                    <div><span className="lbl">className:</span> <span className="className">{camp.className}</span></div>
                    <div><span className="lbl">classDescription:</span> <span className="classDescription">{camp.classDescription}</span></div>
                    <div><span className="lbl">sportName:</span> <span className="sportName">{camp.sportName}</span></div>
                    <div><span className="lbl">sportDescription:</span> <span className="sportDescription">{camp.sportDescription}</span></div>
                    <div><span className="lbl">city:</span> <span className="city">{camp.city}</span></div>
                    <div><span className="lbl">state:</span> <span className="state">{camp.state}</span></div>
                    <div><span className="lbl">begins:</span> <span className="begins">{camp.begins}</span></div>
                    <div><span className="lbl">ends:</span> <span className="ends">{camp.ends}</span></div>
                    <div className="camp-delete"><button data-classno={camp.classNo} onClick={this.onClick_delete} className="delete-button mini-button">remove this camp</button></div>
                </div>
            );
        }

        return <div>{campRows}</div>;
    }
});

