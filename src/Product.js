"use strict";

import React from 'react';
import Nav from './nav';
import store from './reduce/store';
import ProducInfo from './productInfo';         // Page info
import ManageProd from './manageProd';          // Product Admin
import HomeCategory from './homeCat';           // Home cat
import Aboutus from './about';                    // About
import Home from './home';                      // Home
import PersonalShop from './personalShop';      // Personal shop page
import Myshop from './myshop';      // Personal shop page
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import AddProduct from './form/AddProduct';	
import AppRoute from './route';
import Terms from './terms';

const NotFound = () => (<h1>404.. This page is not found!</h1>);

class MainProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentView: 0,
			zipCode: null
		};
		this.createProduct = this.createProduct.bind(this);
		this.showProductInfo = this.showProductInfo.bind(this);
		this.homeCategory = this.homeCategory.bind(this);
		this.homeCategoryProd = this.homeCategoryProd.bind(this);
		this.addAnAd = this.addAnAd.bind(this);

		this.rte = (
			<Route path="/" component={AppRoute}>
				<IndexRoute component={this.homeCategory} />
				<Route path='productid' name="Info Product" component={ProducInfo} />
				<Route path='about' name="About us" component={Aboutus} />
				<Route path='terms' name="Terms of service" component={Terms} />
				<Route path='personalShop' name="Personal shop" component={PersonalShop} />
				<Route path='myShop(/:shopname)' name="My shop" component={Myshop} />
				<Route path='manageProd' name="Manage Product" component={ManageProd} />
				<Route path='productlist' name="Product list" component={this.homeCategoryProd} />
				<Route path='addProduct' name="add Product" component={this.addAnAd} />
				<Route path='/:zip' name="Homezip" component={this.homeCategory} />
				<Route path='*' name="404" component={NotFound} />
			</Route>
		)
	}

	componentWillMount() {
		// On mount, get the local storage zip code saved
		store.dispatch(store.dispatchArticle('GET_LOCAL_ZIP'));
	}

	/**
	 * Main create new product function
	 * 
	 * @param {any} product
	 * 
	 * @memberOf MainProduct
	 */
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

		if (typeof product.idSize === 'number') {
			addProd.idSize = product.idSize.toString();
		}
		else if (product.idShoes) {
			addProd.idShoes = product.idShoes;
		}

		this.props.addArt(addProd);

	}

	/**
	 * Load product route 
	 * 
	 * @param {any} id
	 * 
	 * @memberOf MainProduct
	 */
	showProductInfo(id) {
		this.setState({ currentView: id });
		browserHistory.push('/productid?_id=' + id);
	}

	/**
	 * Main home category page
	 * 
	 * @returns
	 * 
	 * @memberOf MainProduct
	 */
	homeCategory() {
		return (
			<HomeCategory handleInfo={this.showProductInfo} />
		)
	}

	/**
	 * Main Home product list
	 * 
	 * @param {any} props
	 * @returns
	 * 
	 * @memberOf MainProduct
	 */
	homeCategoryProd(props) {
		return (
			<HomeCategory {...props} handleInfo={this.showProductInfo} prodList={true} />
		)
	}

	/**
	 * Parent function to pass add product function as props to the child
	 * 
	 * @returns
	 * 
	 * @memberOf MainProduct
	 */
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