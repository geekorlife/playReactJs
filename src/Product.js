import React from 'react';
let Nav = require('./nav');
let ProductList = require('./productList');
let ProductForm = require('./addProduct');
let AdminModal = require('./adminModal');
let InfoProduct = require('./infoProduct');


const adminpass = '1234';

const defaultProduct = [
  {id:0, name:'Tshirt Boy - 5year', price:20, desc:'T-shirt blue for a boy', brand:'Catimin', qty:1, img:'img/boyshirt.jpg'},
  {id:1, name:'Tshirt Girl - 4year', price:30, desc:'T-shirt yellow for a girl', brand:'Cater', qty:3, img:'img/girlshirt.jpg'}
];



class MainProduct extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      productList: defaultProduct,
      showAdmin: true, // Admin is connected or not
      currentView: 0,
      currentCart: []
    };
    this.createProduct = this.createProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.activeAdmin = this.activeAdmin.bind(this);
    this.rendAdmin = this.rendAdmin.bind(this);
    this.addProductInCart = this.addProductInCart.bind(this);
  }

  createProduct(product) {
    let id = this.props.store.getState().length;
    
    console.log('CREATE NEW PRODUCT/',product);

    let addProd = {
      id: id,
      name: product.name || 'Empty name',
      price: Number(product.price) || 0,
      desc: product.desc || 'Empty description',
      brand: product.brand || 'No brand',
      qty: Number(product.qty) || 1,
      img: product.img || 'img/boyshirt.jpg'
    };

    this.props.addArt(addProd);
    //store.dispatch(dispatchArticle('ADD_ARTICLE',addProd));

    console.log(this.props.store.getState());

  }

  removeProduct(id){
    this.props.remArt(id);
    //store.dispatch(dispatchArticle('REMOVE_ARTICLE',{id}));
  }

  activeAdmin(idps){
    this.setState({showAdmin: idps && idps === adminpass});
  }

  rendAdmin(){
    return (this.state.showAdmin) ? <ProductForm handleCreate={this.createProduct}/> : undefined;
  }

  showProductInfo(id){
    this.setState({currentView: id});
    $('#prodInf').modal('show');
  }

  addProductInCart(id){
    let cart = [{id:id}];
    this.setState({
      currentCart: this.state.currentCart.concat(cart)
    });
    // Remove article
    this.removeProduct(id);
    $('#prodInf').modal('hide');
  }

  render() {
    return (
      <div>
        <div className="main"></div>
        <Nav cart={this.state.currentCart} product={this.props.store.getState()}/>
        <div id="home">
          {this.rendAdmin()}
          <ProductList produit={this.props.store.getState()} handleInfo={this.showProductInfo} addProductInCart={this.addProductInCart} />
          <AdminModal handleConnect={this.activeAdmin}/>
          <InfoProduct product={this.props.store.getState()[this.state.currentView]} addProductInCart={this.addProductInCart}/>
        </div>
      </div>
    );
  }
};


//export default connect(mapStateToProps)(MainProduct);
export default MainProduct;