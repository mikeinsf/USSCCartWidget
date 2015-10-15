// See https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/dist/my-reactive-element.js
// this is wrapped inside a web component container

var React = require('React');
var cx = require('classnames');



var CartUI_Container = React.createClass({
    
    getInitialState: function() {
        return {
            isVisible: false,
            pxWidth: '300',
            baseUrl: '',
        };
    },

    componentDidMount: function() {
        // expose methods to the web component wrapper
        if (!this.props.container.toggleVis)    this.props.container.toggleVis      = this.toggleVis;
        if (!this.props.container.listCamps)    this.props.container.listCamps      = this.listCamps;
        if (!this.props.container.setState)     this.props.container.setState       = this.setState;
    },

    listCamps: function(camps) {
        this.setState({camps: camps});
        this.toggleVis(true);
    },

    toggleVis: function(isVisible) {
        this.setState({isVisible: isVisible});
    },

    onClick_overlay: function(event) {
        this.toggleVis(false);
    },

    onClick_checkout: function(event) {
        __CartWidget.goToCart();
    },

    render: function() {
        var width;
        if (this.state.isVisible) {
            width = this.state.pxWidth + 'px';
        } else {
            width = '0';
        }

        // public string classNo;
        // public string sportName;
        // public string sportDescription;
        // public string className;
        // public string classDescription;
        // public string city;
        // public string state;
        // public string begins;
        // public string ends;

        return (
            <div>
                <div className={cx({'overlay': true, 'visible': this.state.isVisible})} onClick={this.onClick_overlay} />
                <div className="cart-box" style={{width: width}} >
                    <div style={{width: this.state.pxWidth + 'px', overflow: 'hidden'}}>
                        <h2>Your Cart</h2>
                        <div><button onClick={this.onClick_checkout}>Proceed to Checkout</button></div>
                        <div className="camp-list"><CampList camps={this.state.camps} /></div>
                        <div><button onClick={this.onClick_checkout}>Proceed to Checkout</button></div>
                    </div>
                </div>
            </div>
        );

    },

});

var CampList = React.createClass({

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
                <li key={camp.classNo}>
                <div>{camp.sportName}</div>
                <div>{camp.campName}</div>
                <div>{camp.city}, {camp.state}</div>
                <div>{camp.begins} to {camp.ends}</div>
                <div><button data-classno={camp.classNo} onClick={this.onClick_delete}>delete</button></div>
                </li>
            );
        }

        return <div><ul>{campRows}</ul></div>;
    }
});

