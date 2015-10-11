// See https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/dist/my-reactive-element.js
// this is wrapped inside a web component container

var React = require('React');
var cx = require('classnames');



var CartUI_Container = React.createClass({displayName: "CartUI_Container",
    
    componentDidMount: function() {
        
        // these are necessary to expose the methods to the web component wrapper
        if (!this.props.container.toggleVisibility)
            this.props.container.toggleVisibility = this.toggleVisibility.bind(this);

        if (!this.props.container.loadCamps)
            this.props.container.loadCamps = this.loadCamps.bind(this);

    },

    getInitialState: function() {
        return {
            isVisible: false,
        };
    },

    loadCamps: function(camps) {
        this.setState({camps: camps});
    },

    toggleVisibility: function(isVisible) {
        this.setState({isVisible: isVisible});
    },

    onClick_overlay: function(event) {
        this.toggleVisibility(false);
    },

    onClick_button: function(event) {
        __CartWidget.doIt();
    },

    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: cx({'overlay': true, 'visible': this.state.isVisible}), onClick: this.onClick_overlay.bind(this)}), 
                React.createElement("div", {className: cx({'cart-box': true, 'visible': this.state.isVisible})}, 
                    React.createElement("h2", null, "Your Cart"), 
                    React.createElement("button", {onClick: this.onClick_button.bind(this)}, "click"), 
                    React.createElement(CampList, {camps: this.state.camps})
                )
            )
        );
    }
});

var CampList = React.createClass({displayName: "CampList",

    render: function () {
        var rows = [];

        if (this.props.camps === undefined) {
            return React.createElement("div", null);
        }

        this.props.camps.forEach(function(camp) {
            rows.push(React.createElement("li", {key: camp.name}, camp.name));
        });

        return React.createElement("div", null, React.createElement("ul", null, rows));
    }
});

