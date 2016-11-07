"use strict"

import React from 'react';
import Nav from './nav';
import store from './reduce/store';
import AdminModal from './adminModal';
import ProducInfo from './productInfo';         // Page info
import ManageProd from './manageProd';          // Product Admin
import HomeCategory from './homeCat';           // Home cat
import Aboutus from './about';                    // About
import Home from './home';                      // Home
import PersonalShop from './personalShop';      // Personal shop page
import Myshop from './myshop';      // Personal shop page
import { Router, Route, hashHistory, browserHistory, IndexRoute } from 'react-router';
import AddProduct from './form/AddProduct';
import AdminBar from './adminBar';
import AppRoute from './route';


const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

class MainProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdmin: true, // Admin is connected or not
      currentView: 0,
      currentCart: [],
      zipCode: null
    };
    this.createProduct = this.createProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.activeAdmin = this.activeAdmin.bind(this);
    this.rendAdmin = this.rendAdmin.bind(this);
    this.addProductInCart = this.addProductInCart.bind(this);
    this.showProductInfo = this.showProductInfo.bind(this);
    this.homeCategory = this.homeCategory.bind(this);
    this.homeCategoryProd = this.homeCategoryProd.bind(this);
    this.addAnAd = this.addAnAd.bind(this);

    this.rte = (
      <Route path="/" component={AppRoute}>
        <IndexRoute component={this.homeCategory} />
        <Route path='productid' name="InfoProduct" component={ProducInfo} />
        <Route path='about' name="About us" component={Aboutus} />
        <Route path='personalShop' name="My shop" component={PersonalShop} />
        <Route path='myShop(/:shopname)' name="My shop" component={Myshop} />
        <Route path='manageProd' name="Manage Product" component={ManageProd} />
        <Route path='productlist' name="Productlist" component={this.homeCategoryProd} />
        <Route path='addProduct' name="addProduct" component={this.addAnAd} />
        <Route path='/:zip' name="Homezip" component={this.homeCategory} />
        <Route path='*' name="404" component={NotFound} />
      </Route>
    )
  }

  componentWillMount() {
    store.dispatch(store.dispatchArticle('GET_LOCAL_ZIP'));
    
  }

  createProduct(product) {
    let id = store.getState().count;

    let addProd = {
      id: id,
      cat: product.cat || 1,
      gender: product.gender || 1,
      email: product.email || 'empty@empty.com',
      name: product.name || 'Empty name',
      price: Number(product.price) || 0,
      desc: product.desc || 'Empty description',
      brand: product.brand || 'No brand',
      qty: 1,
      shpnme: product.shpnme || false,
      zip: product.zip,
      img: product.img || '/img/boyshirt.jpg'
    };


    this.props.addArt(addProd);

  }

  removeProduct(id) {
    this.props.remArt(id);
  }

  activeAdmin(idps) {
    $('#adminConnect').modal('show');
    this.setState({ showAdmin: idps && idps === adminpass });
  }

  rendAdmin() {
    return (this.state.showAdmin) ? <AdminBar handleCreate={this.createProduct} /> : undefined;
  }

  showProductInfo(id) {
    this.setState({ currentView: id });
    browserHistory.push('/productid?_id=' + id);
  }

  addProductInCart(id) {
    let cart = [{ id: id }];
    this.setState({
      currentCart: this.state.currentCart.concat(cart)
    });
    // Remove article
    this.removeProduct(id);
    $('#prodInf').modal('hide');
  }

  listProductHome() {
    return (
      <ProductList handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} />
    )
  }

  homeCategory() {
    return (
      <HomeCategory handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} />
    )
  }

  homeCategoryProd(props) {
    return (
      <HomeCategory {...props} handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} prodList={true} />
    )
  }

  addAnAd() {
    return (
      <AddProduct handleCreate={this.createProduct} />
    )
  }

  render() {
    const stFlux = store.getState();
    
    const listProduct = stFlux.product;
    const zipData = stFlux.zip;
    var viewProduct;
    if (this.state.currentView) {
      for (let i = 0; i < listProduct.length; i++) {
        if (listProduct[i]._id === this.state.currentView) {
          viewProduct = listProduct[i];
          break;
        }
      }
    }
    
    return (
      <div>
        <Router history={browserHistory}>
            {this.rte}
          </Router>
      </div>
    );
  }
};


export default MainProduct;