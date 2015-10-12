// See https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/dist/my-reactive-element.js
// this is wrapped inside a web component container

var React = require('React');
var cx = require('classnames');



var CartUI_Container = React.createClass({
    
    componentDidMount: function() {
        
        // these are necessary to expose the methods to the web component wrapper
        if (!this.props.container.toggleVisibility)
            this.props.container.toggleVisibility = this.toggleVisibility.bind(this);
        if (!this.props.container.listCamps)
            this.props.container.listCamps = this.listCamps.bind(this);
        if (!this.props.container.setWidth)
            this.props.container.setWidth = this.setWidth.bind(this);

    },

    getInitialState: function() {
        return {
            isVisible: false,
            pxWidth: '300',
        };
    },

    setWidth: function (width) {
        this.setState({pxWidth: width});
    },

    listCamps: function(camps) {
        this.setState({camps: camps});
        this.toggleVisibility(true);
    },

    toggleVisibility: function(isVisible) {
        this.setState({isVisible: isVisible});
    },

    onClick_overlay: function(event) {
        this.toggleVisibility(false);
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
                <div className={cx({'overlay': true, 'visible': this.state.isVisible})} onClick={this.onClick_overlay.bind(this)} />
                <div className="cart-box" style={{width: width}} >
                    <div style={{width: this.state.pxWidth + 'px', overflow: 'hidden'}}>
                        <h2>Your Cart</h2>
                        <div><button onClick={this.onClick_checkout.bind(this)}>Proceed to Checkout</button></div>
                        <div className="camp-list"><CampList camps={this.state.camps} /></div>
                        <div><button onClick={this.onClick_checkout.bind(this)}>Proceed to Checkout</button></div>
                    </div>
                </div>
            </div>
        );

    }
});

var CampList = React.createClass({

    render: function () {
        var rows = [];

        if (!this.props.camps || this.props.camps.length === 0) {
            return <div>No camps</div>;
        }

        this.props.camps.forEach(function(camp) {
            rows.push(<li key={camp.campNo}>
                <div>{camp.sportName}</div>
                <div>{camp.campName}</div>
                <div>{camp.city}, {camp.state}</div>
                <div>{camp.begins} to {camp.ends}</div>
            </li>);
        });

        return <div><ul>{rows}</ul></div>;
    }
});

