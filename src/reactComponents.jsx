// See https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/dist/my-reactive-element.js
// this is wrapped inside a web component container

var React = require('React');
var cx = require('classnames');



var CartUI_Container = React.createClass({
    
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

    listCamps: function(camps) {
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
            <div>
                <div className={cx({'overlay': true, 'visible': this.state.isVisible})} onClick={this.onClick_overlay.bind(this)} />
                <div className={cx({'cart-box': true, 'visible': this.state.isVisible})} >
                    <h2>Your Cart</h2>
                    <button onClick={this.onClick_button.bind(this)}>click</button>
                    <CampList camps={this.state.camps} />
                </div>
            </div>
        );
    }
});

var CampList = React.createClass({

    render: function () {
        var rows = [];

        if (this.props.camps === undefined) {
            return <div></div>;
        }

        this.props.camps.forEach(function(camp) {
            rows.push(<li key={camp.name}>{camp.name}</li>);
        });

        return <div><ul>{rows}</ul></div>;
    }
});

