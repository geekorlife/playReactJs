import React, { Component } from 'react';
import store from '../reduce/store';
import Addimg from './addImg';
import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import AutoCompletion from '../autoCompletion';
import Checkbox from 'material-ui/Checkbox';
import Size from '../setting/size';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class ProductForm extends React.Component {
	constructor() {
		super();
		this.state = {
			img: '',
			readyToSubmit: {
				price: false,
				email: false
			},
			stateCreate: 0,
			createdAdId: null,
			product: {
				cat: 1,
				gender: 1,
				idSize: 0,
				name: null,
				price: null,
				brand: null,
				desc: null,
				img: null,
				shoes: {who:0, size: 0}
			},
			finished: false,
			stepIndex: 0,
			email_error_text: '',
			email: '',
			inMyShop: false,
			zip: null
		};

		this.submit = this.submit.bind(this);
		this.submitNoImg = this.submitNoImg.bind(this);
		this.toggleStep = this.toggleStep.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.getZip = this.getZip.bind(this);
		this.handleZip = this.handleZip.bind(this);
		this.createAd = this.createAd.bind(this);
		this.showLog = this.showLog.bind(this);
		this.noUploadFile = this.noUploadFile.bind(this);

		this.catValue = 1;
		this.gendValue = 1;
		this.sizeValue = 0;
		this.addShop = 1;
		this.whoShoesValue = 0;
		this.shoesValue = 0;
		this.id_connect = null;
		this._id = null;
		this.mainStore = null;
	}

	createAd() {
		let product = {
			cat: Number(this.state.product.cat),
			gender: Number(this.state.product.gender),
			email: this.refs.email.getValue(),
			name: this.refs.name.getValue(),
			price: this.refs.price.getValue(),
			brand: this.refs.brand.getValue(),
			desc: this.refs.desc.value,
			zip: this.state.zip,
			shpnme: this.state.inMyShop ? this.mainStore.user.shpnme : null,
			img: null
		}
		if(this.state.product.cat === 1) {
			product.idSize = Number(this.state.product.idSize);
		}
		else if(this.state.product.cat === 2) {
			product.idShoes = this.state.product.shoes;
		}
		const that = this;
		setTimeout(function () { that.props.handleCreate(product) }, 1000);
		return product;
	}

	submitNoImg(e) {
		e.preventDefault();
		const product = this.createAd();
		// Continue to the final step
		this.setState({
			stateCreate: 2,
			stepIndex: 2,
			finished: true,
			product: product,
		})
	}

	submit(e) {
		e.preventDefault();
		const product = this.createAd();

		// Continue to the next step UPLOAD IMG
		this.setState({
			stateCreate: 1,
			stepIndex: 1,
			product: product,
		})

	}

	handleZip(e) {
		if (e && e.length == 1) {
			this.setState({
				zip: e[0]
			});
		}
	}

	uploadFile(formdata) {
		formdata.append("_id", this._id);
		
		this.setState({
			stateCreate: 2
		})
		let that = this;
		$.ajax({
			url: 'http://138.68.31.97:8080/api/addImg',
			data: formdata,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function (data) {
				setTimeout(function () {
					that.setState({
						stepIndex: 2,
						stateCreate: 3
					})
				}, 1000)

			}
		});
	}

	noUploadFile(){
		this.setState({
			stepIndex: 2,
			stateCreate: 3
		})
	}

	checkEmail(e) {
		console.log('check email');
		const value = e.target.value;
		const err = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalide email address' : '';
		if (err != '') {
			this.setState({
				readyToSubmit: Object.assign(this.state.readyToSubmit, { email: false })
			})
		}
		else {
			this.setState({
				readyToSubmit: Object.assign(this.state.readyToSubmit, { email: true })
			})
		}

		this.setState({
			email_error_text: err,
			email: value
		});
	}

	checkBox(e){
		console.log('check box',e);
		if(!this.state.email) {
			//Usr not connected
			$('#adminConnect').modal('show');
		}
		else {
			this.setState({
				inMyShop: e
			})
		}
	}

	showLog(){
		if(e && !this.state.email) {
			//Usr not connected
			$('#adminConnect').modal('show');
		}
	}

	selectCategory() {
		const that = this;
		const handleChangeS = (event, index, value) => {
			this.catValue = value;
			const nwPrd = Object.assign({}, this.state.product, { cat: value });
			this.setState({ product: nwPrd });
		};

		const handleChangeSize = (event, index, value) => {
			this.sizeValue = value;
			const nwPrd = Object.assign({}, this.state.product, { idSize: value });
			this.setState({ product: nwPrd });
		};

		const handleChangeWhoShoes = (event, index, value) => {
			this.whoShoesValue = value;
			const nwPrd = Object.assign({}, this.state.product, { shoes: {who:value, size: 0} });
			this.setState({ product: nwPrd });
		};

		const handleChangeSizeShoes = (event, index, value) => {
			this.shoesValue = value;
			const nwPrd = Object.assign({}, this.state.product, { shoes: {who:this.whoShoesValue, size: value} });
			this.setState({ product: nwPrd });
			console.log('CHANGE SHOES SIZE');
			const that = this;
			setTimeout(function(){console.log(that.state.product.shoes)},200);
		};
		
		const idSize = () => {
			if(this.catValue === 1) {
				const rendSz = Size.idSz.map( (s, i) => {
					return <MenuItem key={i} value={i} primaryText={s} />
				});

				return (
					<div>
					<br/>
					<SelectField
						floatingLabelText="Size"
						value={this.sizeValue}
						onChange={handleChangeSize}
						>
						{rendSz}
					</SelectField>
					</div>
				)
			}
			else if(this.catValue === 2) {
				const rendST = Size.whoShoes.map( (s, i) => {
					return <MenuItem key={i} value={i} primaryText={s} />
				});
				const rendSizeSHoes = () => {
					if(typeof this.whoShoesValue === 'number') {
						const dt = Size.sizeShoes[this.whoShoesValue].map( (s,i) => {
							return <MenuItem key={i} value={i} primaryText={s} />
						})
						return dt;
					}
				}

				return (
					<div>
						<br/>
						<SelectField
							floatingLabelText="For who"
							value={this.whoShoesValue}
							onChange={handleChangeWhoShoes}
							>
							{rendST}
						</SelectField>

						<SelectField
							floatingLabelText="Shoes size"
							value={this.shoesValue}
							onChange={handleChangeSizeShoes}
							>
							{rendSizeSHoes()}
						</SelectField>
					</div>
				)
			}
			return null;
		};

		return (
			<div>
				<SelectField
					floatingLabelText="Category"
					value={this.catValue}
					onChange={handleChangeS}
					>
					<MenuItem value={1} primaryText="Clothes" />
					<MenuItem value={2} primaryText="Shoes" />
					<MenuItem value={3} primaryText="Childcare" />
					<MenuItem value={4} primaryText="Child furnitures" />
					<MenuItem value={5} primaryText="Toys" />
					<MenuItem value={6} primaryText="Outdoor" />
					<MenuItem value={7} primaryText="Other" />
				</SelectField>
				{idSize()}
			</div>
			
		)
	}

	addInShop() {
		const that = this;
		const handleChangeS = (event, index, value) => {
			this.addShop = value;
			const nwPrd = Object.assign({}, this.state.product, { inShop: value });
			this.setState({ product: nwPrd });
		}
		return (
			<SelectField
				floatingLabelText="Add in my shop"
				value={this.addShop}
				onChange={handleChangeS}
				>
				<MenuItem value={1} primaryText="Yes" />
				<MenuItem value={2} primaryText="No" />
			</SelectField>
		)
	}

	selectGender() {
		let curVal = 1;
		const handleChangeS = (event, index, value) => {
			this.gendValue = value;
			const nwPrd = Object.assign({}, this.state.product, { gender: value });
			this.setState({ product: nwPrd });
		}
		return (
			<SelectField
				floatingLabelText="Gender"
				value={this.gendValue}
				onChange={handleChangeS}
				>
				<MenuItem value={1} primaryText="Unisex" />
				<MenuItem value={2} primaryText="Boy" />
				<MenuItem value={3} primaryText="Girl" />
			</SelectField>
		)
	}

	labelRender() {
		var stl = { padding: '0px 5px 0px 5px' };
		return (
			<div>
				<div className="col-md-4" style={stl}>
					<TextField
						hintText="Enter a product name"
						floatingLabelText="Product Name"
						ref='name'
						/>
				</div>
				<div className="col-md-4" style={stl}>
					<TextField
						hintText="Enter the brand"
						floatingLabelText="Brand"
						ref='brand'
						/>
				</div>
				<div className="col-md-4" style={stl}>
					<TextField
						hintText="Enter the price"
						floatingLabelText="Price ($)"
						ref='price'
						onChange={this.handleChange.bind(this, 'price')}
						/>
				</div>
			</div>
		)
	}

	handleChange(name, e) {
		var nameValue = this.refs.price.getValue();

		if (name === 'price' && !isNaN(this.refs.price.getValue()) && parseInt(this.refs.price.getValue()) > -1) {
			this.setState({
				readyToSubmit: Object.assign(this.state.readyToSubmit, { price: true })
			})
		}
	}

	toggleStep() {
		//this.setState({
		//	stepIndex: (0+1)%2,
		//	stateCreate: (0+1)%2
		//})
	}

	stepperRend() {
		const stl = {
			background: '#ffffff',
			borderRadius: '5px',
			marginTop: '-15px',
			marginBottom: '25px',
			marginLeft: 'auto',
			marginRight: 'auto',
			height: '50px'
		}
		return (
			<div className="stepper">
				<Stepper activeStep={this.state.stepIndex} style={stl} className="stepper">
					<Step>
						<StepLabel onClick={this.toggleStep} style={{ cursor: 'pointer' }}>Fill the form</StepLabel>
					</Step>
					<Step>
						<StepLabel>Upload images</StepLabel>
					</Step>
					<Step>
						<StepLabel>Done !</StepLabel>
					</Step>
				</Stepper>
			</div>
		)
	}

	subMitRend() {
		return (
			<div>
				<FlatButton
					label="Upload images"
					backgroundColor="#00BCD4"
					labelPosition="before"
					labelStyle={{ color: 'white', width: '100%' }}
					icon={<FontIcon className="material-icons" color={'#ffffff'}></FontIcon>}
					style={{ float: 'right' }}
					onClick={this.submit}
					>
				</FlatButton>
				<br /><br />
				<a href="" onClick={this.submitNoImg} style={{ float: 'right' }}>Proceed without images</a>
			</div>
		)
	}

	componentDidMount() {
		const stFlux = this.mainStore = store.getState();
		const zipData = stFlux.zip && stFlux.zip.code ? stFlux.zip.code : null;
		if (zipData) {
			this.setState({
				zip: zipData
			})
		}
	}

	componentDidUpdate() {
		const stStore = this.mainStore = store.getState();
		if (stStore.post_state.id_connect) {
			this.id_connect = stStore.post_state.id_connect;
			if (this.state.finished && this.state.stateCreate == 2) {
				this.setState({
					stateCreate: 3
				})
			}
		}

		if (!this.state.email && stStore.user && stStore.user.email) {
			this.setState({
				email: stStore.user && stStore.user.email ? stStore.user.email : '',
				inMyShop: true,
				readyToSubmit: Object.assign(this.state.readyToSubmit, { email: !!(stStore.user && stStore.user.email) })
			})
		}

	}

	getZip(e) {
		e.preventDefault();
		const data = e.target.value;
		const that = this;
		$.ajax({
			url: 'http://138.68.31.97:8080/api/zipCode',
			data: { type: 'GET_ZIPCODE', _id: data },
			type: 'GET',
			success: function (data) {
				that.setState({
					zip_error: data.city ? null : 'Invalid zip code',
					city: data.city ? data.city.nm + ', ' + data.city.st : null
				});
			}
		});
	}
	render() {
		let rendSubmit;

		if (this.state.readyToSubmit.price && this.state.readyToSubmit.email && this.state.zip) {
			rendSubmit = this.subMitRend();
		}
		const stFlux = this.mainStore = store.getState();

		const zipData = stFlux.zip && stFlux.zip.code ? stFlux.zip.code.nm + ', ' + stFlux.zip.code.st : undefined;

		const isChecked = !!stFlux.user.email;

		switch (this.state.stateCreate) {
			case 0: {
				const descstl = {
					color: '#888',
					fontWeight: '500',
					fontSize: '0.95em'
				}

				const stl = { padding: '0px 5px 0px 5px' };

				const zipCity = this.state.zip_error ? this.state.zip_error : this.state.city ? this.state.city : null;

				const stlCty = this.state.city ? { color: '#03b9d2' } : { color: '#d10b04' };

				const checkB = {	
   	 					marginTop: '25px',
						padding: '8px 0px 0 12px',
						background: 'white',
						borderRadius: '4px'
				}

				const labelcheck = stFlux.user.email ? 'Add in my shop' : 'Add in my shop (must be logged)';
				
				return (
					<div className="eachDiv">
						{this.stepperRend()}
						<form>
							<div className="row">

								<div className="col-md-12">
									<div className="row">
										<div className="col-md-4" style={stl}>
											{this.selectCategory()}
										</div>
										<div className="col-md-4" style={stl}>
											{this.selectGender()}
										</div>
										<div className="col-md-4" style={stl}>
											<TextField
												hintText="Enter your email"
												floatingLabelText="Email"
												errorText={this.state.email_error_text}
												errorStyle={stlCty}
												onChange={e => this.checkEmail(e)}
												value={this.state.email}
												ref='email'
											/>
										</div>
									</div>
									<div className="row">
										{this.labelRender()}
									</div>
									<div className="row">
										<div className="col-md-4" style={stl}>
											<AutoCompletion handleZip={this.handleZip} zipData={zipData} />
										</div>
										<div className="col-md-4" style={stl}>
											<Checkbox
												label={labelcheck}
												labelPosition="left"
												style={checkB}
												defaultChecked={isChecked}
												onCheck= {(e,ev) => this.checkBox(ev)}
											/>
										</div>
										<div className="col-md-4"></div>
									</div>
									<div className="row">
										<div className="col-md-12" style={{ paddingLeft: '5px' }}>
											<label style={descstl}>Description:</label>
											<textarea className="desc" placeholder="Enter a description" ref='desc' />
										</div>
									</div>
									{rendSubmit}
								</div>
							</div>

						</form>

					</div>
				)
			}
			case 1: {
				this._id = this.mainStore.post_state.createdAdId;
				this.id_connect = this.mainStore.post_state.id_connect;

				return (
					<div className="eachDiv">
						{this.stepperRend()}
						<Addimg handleCreate={this.props.handleCreate} prevData={this.state.product} noUploadFile={this.noUploadFile} uploadFile={this.uploadFile} />
					</div>
				)
			}
			case 2: {
				return (
					<div className="eachDiv text-center">
						{this.stepperRend()}
						<h3>Creating your ad...</h3>
						<CircularProgress size={80} thickness={5} />
					</div>
				)
			}
			case 3: {
				const linkManage = document.location.origin + "/manageProd?id=" + this.id_connect;
				return (
					<div className="eachDiv text-center">
						{this.stepperRend()}
						<h3>Congrats ! The ad has been created.</h3>
						<br />
						<h4>
							Manage your ads: <a href={linkManage}>HERE</a>
						</h4>
					</div>
				)
			}
		}
	}
}

export default ProductForm;