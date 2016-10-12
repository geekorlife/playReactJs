var React = require('react');
var Nav = require('./nav');
var ProductList = require('./productList');
var ProductForm = require('./addProduct');
var AdminModal = require('./adminModal');
var InfoProduct = require('./infoProduct');

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reduce';

let store = createStore(reducer);

var adminConnect = false;

var adminpass = '1234';

var defaultProduct = [
  {id:0, name:'Tshirt Boy - 5year', price:20, desc:'T-shirt blue for a boy', brand:'Catimin', qty:1, img:'img/boyshirt.jpg'},
  {id:1, name:'Tshirt Girl - 4year', price:30, desc:'T-shirt yellow for a girl', brand:'Cater', qty:3, img:'img/girlshirt.jpg'}
];

const dispatchArticle = (type,ob) => Object.assign({type}, ob);

module.exports = React.createClass({
  getInitialState: function() {
    return {
      productList: defaultProduct,
      showAdmin: false,
      currentView: 0,
      currentCart: []
    };
  },

  createProduct: function(product) {
    console.log(store.getState());
    var id = store.getState().length;
    
    let addProd = {
      id: id,
      name: product.name || 'Empty name',
      price: product.price || 0,
      desc: product.desc || 'Empty description',
      brand: product.brand || 'No brand',
      qty: product.qty || 1,
      img: product.img || 'img/boyshirt.jpg'
    }

    store.dispatch(dispatchArticle('ADD_ARTICLE',addProd));

    this.setState({
      productList: this.state.productList.concat(addProd)
    });

    console.log(store.getState());

  },

  removeProduct: function(id){
    var prodL = this.state.productList;
    console.log('BEFORE ',this.state.productList);
    prodL[id].qty--;
    this.setState({
      productList: prodL
    });
    console.log('AFTER ',this.state.productList);
  },

  activeAdmin: function(idps){
    this.setState({showAdmin: idps && idps === adminpass});
    console.log('TRY ADMIN CONNECT WITH PASS:',idps,this.state.showAdmin);
  },

  rendAdmin: function(){
    console.log('ADMIN CONNECTED ? '+this.state.showAdmin);
    return (this.state.showAdmin) ? <ProductForm handleCreate={this.createProduct}/> : undefined;
  },

  showProductInfo: function(id){
    console.log('SHOW ID ',id);
    this.setState({currentView: id});
    $('#prodInf').modal('show');
  },

  addProductInCart: function(id){
    console.log('ADD ID ',id);
    var cart = [{id:id}];
    this.setState({
      currentCart: this.state.currentCart.concat(cart)
    });
    // Remove article
    this.removeProduct(id);
    $('#prodInf').modal('hide');
  },

  render: function() {
    return (
      <div>
        <div className="main"></div>
        <Nav cart={this.state.currentCart} product={this.state.productList}/>
        <div id="home">
          {this.rendAdmin()}
          <ProductList produit={this.state.productList} handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} />
          <AdminModal handleConnect={this.activeAdmin}/>
          <InfoProduct product={this.state.productList[this.state.currentView]} addProductInCart={this.addProductInCart}/>
        </div>
      </div>
    );
  }
});