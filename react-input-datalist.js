var React = require('react');
var D = React.DOM;

var DEFAULT_HIGHLIGHTED_INDEX = -1;
var NO_RESULTS = [];

module.exports = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.string.isRequired,
        datalist: React.PropTypes.array,
        onEnter: React.PropTypes.func,
        className: React.PropTypes.string,
        inputClassName: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxOptions: React.PropTypes.number,
        predicate: React.PropTypes.func
    },
    getInitialState: getInitialState,
    getDefaultProps: function() {
        return {
            datalist: [],
            minLength: 1,
            maxOptions: 5,
            className: '',
            inputClassName: '',
            onEnter: noop,
            predicate: contains
        };
    },
    render: function() {
        return D.div({ className: 'suggest ' + this.props.className },
            D.input(
                merge(
                    merge({ type: 'text' }, this.props),
                    {
                        className: 'suggest__input' + this.props.inputClassName,
                        onChange: this._onChange,
                        onKeyDown: this._onKeyDown,
                        onBlur: this._onBlur
                    }
                )
            ),
            D.div({ className: 'suggest__datalist' },
                this.options().map(this.renderOption)
            )
        );
    },
    renderOption: function(option, index) {
        var p = this.props;

        if (this.state.suggest) {
            var className = 'suggest__option';

            if (index === this.state.highlighted) {
                className += ' suggest__option_hl';
            }

            function onMouseDown() {
                p.onChange(option);
            }

            return D.div({ className: className, key: option, onMouseDown: onMouseDown },
                option
            );
        }
    },
    componentWillReceiveProps: function() {
        this.setState({
            highlighted: DEFAULT_HIGHLIGHTED_INDEX
        });
    },
    options: function() {
        var predicate = this.props.predicate;
        var value = this.props.value;
        var datalist = this.props.datalist;
        var maxOptions = this.props.maxOptions;

        if (value.length >= this.props.minLength) {
            var matches = datalist.filter(containsValue).slice(0, maxOptions);

            // When `matches` contain only the entered `value` itself.
            if (matches.length === 1 && matches[0] === value) {
                return NO_RESULTS;
            } else {
                return matches;
            }
        } else {
            return NO_RESULTS;
        }

        function containsValue(option) {
            return predicate(option, value);
        }
    },
    _onChange: function(e) {
        this.props.onChange(e.target.value);
    },
    _onBlur: function(e) {
        this.resetState();

        if (typeof this.props.onBlur === 'function') {
            this.props.onBlur(e);
        }
    },
    _onKeyDown: function(e) {
        var s = this.state;
        var isHighlighted = s.highlighted !== DEFAULT_HIGHLIGHTED_INDEX;
        var options;

        if (e.key === 'Enter') {
            if (isHighlighted) {
                this.props.onChange(this.options()[s.highlighted]);
                this.props.onEnter(e);
            }

            this.resetState();

        } else if (e.key === 'Tab' && isHighlighted) {
            this.props.onChange(this.options()[s.highlighted]);

            e.preventDefault();

        } else if (e.key === 'ArrowUp') {
            options = this.options();
            this.setState({
                highlighted: (options.length + s.highlighted - 1) % options.length
            });

            e.preventDefault();

        } else if (e.key === 'ArrowDown') {
            options = this.options();
            this.setState({
                highlighted: (s.highlighted + 1) % options.length
            });

            e.preventDefault();

        } else if (e.key === 'Escape') {
            this.resetState();
            e.preventDefault();

        } else {
            this.setState({
                suggest: true
            });
        }

        if (typeof this.props.onKeyDown === 'function') {
            this.props.onKeyDown(e);
        }
    },
    resetState: function() {
        this.setState(getInitialState());
    }
});

function getInitialState() {
    return {
        suggest: false,
        highlighted: DEFAULT_HIGHLIGHTED_INDEX
    };
}

function contains(string, substring) {
    return string.indexOf(substring) !== -1;
}

function merge(target, source) {
    for (var key in source) {
        target[key] = source[key];
    }

    return target;
}

function noop() {}
