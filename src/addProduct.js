let React = require('react');

module.exports = React.createClass({
  submit: function(e) {
    e.preventDefault();

    let product = {
      name: this.refs.name.value,
      price: this.refs.price.value
    }

    this.props.handleCreate(product);

    this.refs.name.value = "";
    this.refs.price.value = "";
  },
  render: function(){
    return (
        <div className="eachDiv">
            <h3>Add a new product:</h3>
            <form>
                <input type='text' placeholder='Name' ref='name'/>
                <input type='text' placeholder='Price' ref='price'/>
                <button onClick={this.submit}>Create new product</button>
            </form>
        </div>
    )
  }
})