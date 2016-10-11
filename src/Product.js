var React = require('react');
var Nav = require('./nav');
var ProductList = require('./productList');
var ProductForm = require('./addProduct');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      productList: [
        {name:'test1', price:20},
        {name:'test2', price:30}
      ]
    };
  },

  createProduct: function(product) {
    this.setState({
      productList: this.state.productList.concat(product)
    });
  },

  render: function() {
    return (
      <div>
        <Nav />
        <ProductForm handleCreate={this.createProduct}/>
        <ProductList produit={this.state.productList} />
      </div>
    );
  }
});