# react-input-datalist

Implementation of HTML5 input/datalist combination as a React component.

![Component screenshot](http://i.imgur.com/rxhGXlg.png)

### Installation

    npm install react-input-datalist

### Usage

```jsx
var Input = require('react-input-datalist');
var datalist = [ /* ... */ ];

var Toolbar = React.createClass({
    render: function() {
        return <Input
            datalist={ datalist }
            onChange={ function(value) { this.setState({ value: value }); } }
            value={ this.state.value } />;
    },
    // ... 
});
```

Make sure to include `react-input-datalist.css` in your stylesheet. Feel free to
override or amend default styles.

### Properties

The properties listed below can be used to configure the component itself. All other properties, except for `onChange` and `className` will be applied to the `input` element inside this component, e.g. `placeholder` or `type`.

#### props.onChange

Required, callback that will receive value of the input once it changes.

#### props.value

Required, current value of the input.

#### props.datalist

Array of strings – available options

#### props.onEnter

Callback that will be fired when Enter key is pressed, receives `event` object as first argument. Useful to prevent automatic form submission on suggestion select.

#### props.minLength

Minimum value length after which suggestions list is shown.

#### props.predicate

Predicate function that decides which suggestions match the current value. Receives suggestion text as first argument and current value as second. Defaults to:

```js
function contains(string, substring) {
    return string.indexOf(substring) !== -1;
}
```
