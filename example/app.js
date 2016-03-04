var React = require('react');
var D = React.DOM;

var BROWSERS = [
    'Chrome',
    'Firefox',
    'Yandex.Browser',
    'Opera',
    'Internet Explorer'
];

var Input = require('..');
var input = React.createFactory(Input);

var App = React.createClass({
    getInitialState: function() {
        return {
            browser: ''
        };
    },
    render: function() {
        return D.label(null,
            D.span(null, 'Enter your browser name'),
            input({
                className: 'my-input',
                datalist: BROWSERS,
                value: this.state.browser,
                onChange: this._onChange,
                placeholder: 'e.g. Chrome, Firefox'
            }));
    },
    _onChange: function(browser) {
        this.setState({
            browser: browser
        });
    }
});

var app = React.createFactory(App);

document.addEventListener('DOMContentLoaded', function() {
    React.render(app(), document.getElementById('main'));
});
