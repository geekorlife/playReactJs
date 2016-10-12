let React = require('react');
let Nav = require('./nav');
let ProductList = require('./productList');
let ProductForm = require('./addProduct');
let AdminModal = require('./adminModal');
let InfoProduct = require('./infoProduct');

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reduce';

let store = createStore(reducer);

let adminConnect = false;

const adminpass = '1234';

const defaultProduct = [
  {id:0, name:'Tshirt Boy - 5year', price:20, desc:'T-shirt blue for a boy', brand:'Catimin', qty:1, img:'img/boyshirt.jpg'},
  {id:1, name:'Tshirt Girl - 4year', price:30, desc:'T-shirt yellow for a girl', brand:'Cater', qty:3, img:'img/girlshirt.jpg'}
];

/*
Dispatch event in the redux store after a type and data object merging
*/
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
    let id = store.getState().length;
    
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

  },

  removeProduct: function(id){
    store.dispatch(dispatchArticle('REMOVE_ARTICLE',{id}));
  },

  activeAdmin: function(idps){
    this.setState({showAdmin: idps && idps === adminpass});
  },

  rendAdmin: function(){
    return (this.state.showAdmin) ? <ProductForm handleCreate={this.createProduct}/> : undefined;
  },

  showProductInfo: function(id){
    this.setState({currentView: id});
    $('#prodInf').modal('show');
  },

  addProductInCart: function(id){
    let cart = [{id:id}];
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
        <Nav cart={this.state.currentCart} product={store.getState()}/>
        <div id="home">
          {this.rendAdmin()}
          <ProductList produit={store.getState()} handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} />
          <AdminModal handleConnect={this.activeAdmin}/>
          <InfoProduct product={store.getState()[this.state.currentView]} addProductInCart={this.addProductInCart}/>
        </div>
      </div>
    );
  }
});