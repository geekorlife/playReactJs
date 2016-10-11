var React = require('react');

module.exports = React.createClass({
  submit: function(e) {
    e.preventDefault();
    //alert('Name: ' + this.refs.name.value + " - $" + this.refs.price.value);

    var product = {
      name: this.refs.name.value,
      price: this.refs.price.value
    }

    this.props.handleCreate(product);

    this.refs.name.value = "";
    this.refs.price.value = "";
  },
  render: function(){
    return (
      <form>
        <input type='text' placeholder='Name' ref='name'/>
        <input type='text' placeholder='Price' ref='price'/>
        <button onClick={this.submit}>Create new product</button>
      </form>
    )
  }
})