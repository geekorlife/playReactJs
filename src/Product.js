import React from 'react';
import Nav from './nav';
import store from './reduce/store';
import AdminModal from './adminModal';
import InfoProduct from './infoProduct';        // MODAL info
import ProducInfo from './productinfo';         // Page info
import HomeCategory from './homeCat';        // MODAL info
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import AddProduct from './form/AddProduct';
import AdminBar from './adminBar';
import AppRoute from './route';


const adminpass = '1234';

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

class MainProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdmin: true, // Admin is connected or not
      currentView: 0,
      currentCart: []
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
          <Route path='productlist' name="Productlist" component={this.homeCategoryProd} />
          <Route path='addProduct' name="addProduct" component={this.addAnAd} />
          <Route path='*' name="404" component={NotFound} />
        </Route>
    )
  }

  componentDidMount() {
    console.log('pros product',this.props)
  }

  createProduct(product) {
    let id = store.getState().count;

    let addProd = {
      id: id,
      cat: product.cat || 1,
      gender: product.gender || 1,
      name: product.name || 'Empty name',
      price: Number(product.price) || 0,
      desc: product.desc || 'Empty description',
      brand: product.brand || 'No brand',
      qty: 1,
      img: product.img || 'img/boyshirt.jpg'
    };

    console.log('CREATE NEW PRODUCT/', addProd);
    
    this.props.addArt(addProd);

    console.log(store.getState());

  }

  removeProduct(id) {
    this.props.remArt(id);
  }

  activeAdmin(idps) {
    $('#adminConnect').modal('hide');
    this.setState({ showAdmin: idps && idps === adminpass });
  }

  rendAdmin() {
    return (this.state.showAdmin) ? <AdminBar handleCreate={this.createProduct} /> : undefined;
  }

  showProductInfo(id) {
    console.log('SHOW MODAL',id);
    this.setState({ currentView: id });
    $('#prodInf').modal('show');
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

  listProductHome(){
    return (
       <ProductList handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} />
    )
  }

  homeCategory(){
    return (
       <HomeCategory handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} />
    )
  }

  homeCategoryProd(props){
    return (
       <HomeCategory {...props} handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} prodList={true} />
    )
  }

  addAnAd(){
    return (
       <AddProduct handleCreate={this.createProduct} />
    )
  }

  render() {
    var listProduct = store.getState().product;
    var viewProduct;
    if(this.state.currentView){
      for(let i=0; i<listProduct.length; i++) {
        if(listProduct[i]._id === this.state.currentView) {
          viewProduct = listProduct[i];
          break;
        }
      }
    }
    console.log('store', store.getState());
    return (
      <div>
        <Nav cart={this.state.currentCart} product={listProduct} />
        <div id="home">
          {this.rendAdmin()}
          <Router history={hashHistory}>
            {this.rte}
          </Router>
          
          <AdminModal handleConnect={this.activeAdmin} />
          <InfoProduct product={viewProduct} addProductInCart={this.addProductInCart} />
        </div>
      </div>
    );
  }
};


export default MainProduct;