// See https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/dist/my-reactive-element.js
// this is wrapped inside a web component container

var React = require('React');
var classNames = require('classnames');

// var CartUI = {
//     render: function(containerId) {
//         return React.render(
//             <CartUI_Container />,
//             document.getElementById(containerId)
//         );
//     },
// }

var CartUI_Container = React.createClass({displayName: "CartUI_Container",
    
    componentDidMount: function() {
        
        // these are necessary to expose the methods to the web component wrapper
        if (!this.props.container.toggleVisibility)
            this.props.container.toggleVisibility = this.toggleVisibility.bind(this);

        if (!this.props.container.reloadCampList)
            this.props.container.reloadCampList = this.reloadCampList.bind(this);

    },

    getInitialState: function() {
        return {
            isVisible: false,
        };
    },

    reloadCampList: function(camps) {
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
                React.createElement("div", {className: classNames({'overlay': true, 'visible': this.state.isVisible}), onClick: this.onClick_overlay.bind(this)}), 
                React.createElement("div", {className: classNames({'cart-box': true, 'visible': this.state.isVisible})}, 
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


// window.USSC.CampList = React.createClass({
//     getInitialState: function() {
//         return {
//             color: '#000000'
//         };
//     },

//     attributeChanged: function(name, oldValue, newValue) {
//         console.log('Attribute ' + name + ' was changed from ' + oldValue + ' to ' + newValue);
//     },

//     render: function() {
//         var rows = [];

//         if (this.props.items === undefined) {
//             return <div></div>;
//         }

//         this.props.items.forEach(function(item) {
//             rows.push(<li key={item.text}>{item.text}</li>);
//         });

//         return <div>&lt;my-reactive-element&gt;<ul style={this.state}>{rows}</ul>&lt;/my-reactive-element&gt;</div>;
//     },
//     changeColor: function(color) {
//         this.state.color = color;
//         this.forceUpdate();
//     }
// });
