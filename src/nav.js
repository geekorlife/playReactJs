import React from 'react';
import Cart from './cart.js';
import store from './reduce/store';
import AutoCompletion from './autoCompletion';
import TextField from 'material-ui/TextField';
import ActionSave from 'material-ui/svg-icons/action/done';
import RaisedButton from 'material-ui/RaisedButton';

class navBar extends React.Component {
	constructor() {
		super();
		this.sendZip = this.sendZip.bind(this);
		this.handleZip = this.handleZip.bind(this);
		this.login = this.login.bind(this);
		this.logginMenu = this.logginMenu.bind(this);
		this.state = {
			zip: null
		}
		$('.navbar-right a').click(function () {
			$(".navbar-collapse").collapse('hide');
		});
	}

	showAdd(e) {
		e.preventDefault();
		$('#addProAdm').modal('show');
	}

	sendZip() {
		const stFlux = store.getState();

		const zip = {
			code: this.state.zip ? this.state.zip : stFlux.zip.code,
			dist: this.refs.dist.getValue()
		}

		store.dispatch(store.dispatchArticle('SET_LOCAL_ZIP', zip));
		this.editCity();
		window.location = '#';
	}

	handleZip(e) {
		if (e && e.length == 1) {
			this.setState({
				zip: e[0]
			});
		}
	}

	editCity() {
		const topDist = $('.editCity').css('top') === '-300px' ? 10 : -300;
		const op = $('.editCity').css('top') === '-300px' ? 1 : 0;
		const disp = $('.editCity').css('top') === '-300px' ? 'block' : 'none';


		$('.editCityBack').css('opacity', op);
		$('.editCityBack').css('display', disp);
		setTimeout(function () { $('.editCity').css('top', topDist) }, 0);
	}

	login(e) {
		e.preventDefault();
		console.log('login');
		$('#adminConnect').modal('show');
	}

	logginMenu() {
		const usrData = store.getState().user;
		if(!usrData.id_shop && !usrData.credential) {
			return (
				<li>
					<a href="#" onClick={(e) => this.login(e)}>Login</a>
				</li>
			)
		}
		else {
			return (
				<li>
					<a href="#" onClick={(e) => this.login(e)}>My settings</a>
				</li>
			)
		}
	}

	//<Cart cart={this.props.cart} product={this.props.product}/>
	//onClick={this.showAdd}
	render() {

		const stFlux = store.getState();

		const zipData = stFlux.zip && stFlux.zip.code ? stFlux.zip.code.nm + ', ' + stFlux.zip.code.st : undefined;

		const editCities = () => {
			if (zipData)
				return (
					<div className="city-nav" onClick={this.editCity}>
						<span>CITY: </span>{zipData} <span>- MAX  DISTANCE: </span>{stFlux.zip.dist}mi
        </div>
				)
		}

		return (
			<div>
				<nav className="navbar navbar-default mainNav">
					<div className="container-fluid">
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className="navbar-brand" href="/#">Stella's Shop</a>
						</div>
						{editCities()}
						<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
							<ul className="nav navbar-nav navbar-right">
								<li><a href="#">Home</a></li>
								<li><a href="#/about">About</a></li>
								<li><a href="#/addproduct" >Create an ad</a></li>
								<li><a href="#/personalShop" >My shop</a></li>
								{this.logginMenu()}
							</ul>
						</div>
					</div>
				</nav>
				<div className="editCityBack">
					<div className="editCity">
						<div className="closeCity" onClick={this.editCity}>X Close</div>
						<h4 className="text-center">EDIT CITY</h4>
						<AutoCompletion handleZip={this.handleZip} zipData={zipData} />
						<TextField
							hintText="Enter max distance"
							floatingLabelText="Max distance (mi):"
							defaultValue={stFlux.zip ? stFlux.zip.dist : undefined}
							ref='dist'
							/>
						<RaisedButton
							label="Submit"
							secondary={true}
							icon={<ActionSave />}
							style={{ transform: 'translate(10%, -11%)' }}
							onClick={this.sendZip}
							/>
						<RaisedButton
							label="Cancel"
							secondary={true}
							style={{ transform: 'translate(10%, -11%)', marginLeft: '10px' }}
							onClick={this.editCity}
							/>
					</div>
				</div>

			</div>
		);
	}
};

export default navBar;
