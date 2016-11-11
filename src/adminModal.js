import React from 'react';
import store from './reduce/store';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ActionSave from 'material-ui/svg-icons/action/done';
import AddAvatar from './addAvatar';

class adminModal extends React.Component {
	constructor() {
		super();
		this.submitEvent = this.submitEvent.bind(this);
		this.createAccountState = this.createAccountState.bind(this);
		this.cancelCreate = this.cancelCreate.bind(this);
		this.dataJsx = this.dataJsx.bind(this);
		this.updateIsLoggin = this.updateIsLoggin.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.selectAv = this.selectAv.bind(this);
		this.changePassrender = this.changePassrender.bind(this);
		this.submitPass = this.submitPass.bind(this);

		this.state = {
			isLogin: false,
			isCreateAccount: false,
			email_error_text: '',
			shop_error_text: '',
			pass_error: '',
			img: null,
			av: null
		}

		this.welcometxt = 'WELCOME BACK!';
	}

	checkEmail(e) {
		const value = e.target.value;
		const err = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalide email address' : '';

		this.setState({
			email_error_text: err
		});
	}

	createAccountState() {
		this.setState({ isCreateAccount: true });
	}

	cancelCreate() {
		this.setState({ isCreateAccount: false });
	}

	componentWillUpdate() {
		this.updateIsLoggin();
		this.errorInput();
	}

	updateIsLoggin() {
		const usrData = store.getState().user;
		if (usrData.id_shop && usrData.credential && !this.state.isLogin) {
			const welc = () => {
				return (
					<div>
						CONGRATS!
						<br/><br/>
						Your account has been created.
					</div>
				)
			}
			let delayAnim = 1500;
			if(this.state.isCreateAccount) {
				this.welcometxt = welc();
				delayAnim = 2500;
			}
			this.setState({
				isLogin: true,
				isCreateAccount: false
			})
			setTimeout(function () { $('#adminConnect').modal('hide') }, delayAnim);
		}
		else if(!usrData.id_shop && !usrData.credential && this.state.isLogin) {
			this.setState({
				isLogin: false,
				isCreateAccount: false
			})
		}
		if(usrData.passUpdated) {
			setTimeout(function(){store.dispatch(store.dispatchArticle('RESET_PASS_MSG'));},2000);
		}
	}

	errorInput(){
		const errorState = store.getState().post_state.error;
		if(errorState && !this.state.shop_error_text) {
			 if(errorState.type && errorState.type == 'DUPLICATE_VALUE') {
				 
				switch(errorState.duplicate_key) {
					case 'email':
						this.setState({
							shop_error_text: 'This email already exists'
						})
					 	break;
					case 'shpnme':
						this.setState({
							shop_error_text: 'This shop name already exists'
						});
						break;
					default:
						this.setState({
							email_error_text: 'This email already exists'
						})
						break;
				}
			 }
		}
	}

	submitEvent(e, type) {
		e.preventDefault();
		let typeEvent = 'LOG_USER';
		const account = {
			email: this.refs.email.getValue(),
			pass: this.refs.pass.getValue()
		}
		if(type == 'PUSH') {
			typeEvent = 'PUSH_USER';
			account.shpnme = this.refs.shpnme.getValue();
			account.avatar = typeof this.state.av === 'number' ? this.state.av : 0;
			account.desc = this.refs.descOp.value;
		}
		this.setState({
			shop_error_text: ''
		});
		store.dispatch(store.dispatchArticle(typeEvent, { account }));
	}

	selectAv(avt){
		console.log('CLICK AVATATR',avt);
		this.setState({
			av: avt
		})
	}

	dataJsx() {
		let firstEntry = null;
		let title = 'Login';
		if (this.state.isCreateAccount) {
			title = 'Create an account';

			const errorTitle = this.state.shop_error_text ? (
				<h5 style={{color:'red', textAlign:'center'}}>{this.state.shop_error_text}</h5>
				) : null;
			
			const addAnAvatar = () => {
				if(!this.proAccount) {
					
					const selectedAv = {
						men: this.state.av === 1 ? ' avt-men-sel' : '',
						wom: this.state.av === 0 ? ' avt-women-sel' : ''
					}
					console.log('this.state.av',this.state.av, selectedAv);
					const classW = "avt avt-women"+selectedAv.wom;
					const classM = "avt avt-men"+selectedAv.men;
					return (
						<div>
							<h6>Choose an avatar</h6>
							<div className={classW} onClick={() => this.selectAv(0)}></div>
							<div className={classM} onClick={() => this.selectAv(1)}></div>
						</div>
					)
				}
					

				return <AddAvatar />
			}
			const descstl = {
					color: '#888',
					fontWeight: '500',
					fontSize: '0.95em'
				}
			firstEntry = (
				<div>
					<h5>
						Create an account and get your own free personal shop !
					</h5>
					{errorTitle}
					<TextField
						hintText="Enter your email"
						floatingLabelText="Email:"
						onChange={e => this.checkEmail(e)}
						errorText={this.state.email_error_text}
						ref='email'
						/>
					<br />
					<TextField
						hintText="Enter a password"
						floatingLabelText="Password:"
						type="password"
						ref='pass'
						/>
					<br />
					<TextField
						hintText="Enter a shop name"
						floatingLabelText="Shop name:"
						ref='shpnme'
						/>
					<br/><br/>
					<label style={descstl}>Shop Description:</label><span className="opDesc">*optional</span>
					<textarea className="opTxtdesc" placeholder="Enter a description about your shop" ref='descOp' />
					<br />
					{addAnAvatar()}
					<RaisedButton
						label="Submit"
						backgroundColor="#03b9d2"
						labelStyle={{ color: 'white' }}
						icon={<ActionSave />}
						fullWidth={true}
						onClick={(e) => this.submitEvent(e, 'PUSH')}
						/>
					<br />
					<br />
					<RaisedButton
						label="Cancel"
						secondary={true}
						fullWidth={true}
						onClick={this.cancelCreate}
						/>
				</div>
			)
		}
		else if (!this.state.isLogin) {
			firstEntry = (
				<div>
					<TextField
						hintText="Enter your email"
						floatingLabelText="Email:"
						onChange={e => this.checkEmail(e)}
						errorText={this.state.email_error_text}
						ref='email'
						/>
					<br />
					<TextField
						hintText="Enter your password"
						floatingLabelText="Password:"
						type="password"
						ref='pass'
						/>
					<br />
					<RaisedButton
						label="Submit"
						backgroundColor="#03b9d2"
						labelStyle={{ color: 'white' }}
						icon={<ActionSave />}
						onClick={(e) => this.submitEvent(e, 'LOG')}
						fullWidth={true}
						/>
					<br />
					<br />
					<h6 className="text-center">OR</h6>
					<br />
					<RaisedButton
						label="Create an account"
						backgroundColor="#03b9d2"
						labelStyle={{ color: 'white' }}
						onClick={this.createAccountState}
						fullWidth={true}
						/>
				</div>
			)
		}
		else {
			firstEntry = (
				<div>
					<h5 className="text-center">{this.welcometxt}</h5>
				</div>
			)
		}
		return { dt: firstEntry, tl: title };
	}

	submitPass(){
		const data = {
			oldPass: this.refs.oldPass.getValue(),
			newPass: this.refs.newPass.getValue(),
			credential: store.getState().user.credential
		}
		if(!data.oldPass || !data.newPass) {
			this.setState({
				pass_error: 'You have to enter the previous and new password'
			})
		}
		else {
			console.log('SEND DATA',data);
			store.dispatch(store.dispatchArticle('CHANGE_PASS', {data}));
		}
	}

	changePassrender(){
		const usrData = store.getState().user;
		const err_txt = () => {
			if(this.state.pass_error)
				return (<h5 style={{color:'red', textAlign: 'center'}}>{this.state.pass_error}</h5>)
			return null;
		}
		if(usrData.passUpdated) {
			return (
				<h4 className="text-center">Your password has been updated!</h4>
			)
		}
		return (
			<div>
				{err_txt()}
				<TextField
					hintText="Enter your current password"
					floatingLabelText="Current password:"
					type="password"
					ref="oldPass"
					/>
				<TextField
					hintText="Enter your new password"
					floatingLabelText="New password:"
					type="password"
					ref="newPass"
					/>
				<br/><br/>
				<RaisedButton
					label="Submit"
					backgroundColor="#00BCD4"
                    labelStyle={{ color: 'white', width: '100%' }}
					fullWidth={true}
					onClick={() => this.submitPass()}
					/>
				<br/><br/>
				<RaisedButton
					label="Cancel"
					backgroundColor="#dd127b"
                    labelStyle={{ color: 'white', width: '100%' }}
					fullWidth={true}
					onClick={() => $('#settingConnect').modal('hide')}
					/>
			</div>
		)
	}

	render() {
		const dataToRend = this.dataJsx();
		const classModal = this.state.isCreateAccount ? "modal-dialog modal-lm" : "modal-dialog modal-sm";
		
		return (
			<div>
				<div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModal" id="adminConnect">
					<div className={classModal} role="document">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
								<h4 className="modal-title">{dataToRend.tl}</h4>
							</div>
							<div className="modal-body">
								{dataToRend.dt}
							</div>
						</div>
					</div>
				</div>
				<div className="modal fade" tabIndex="-1" role="dialog" id="settingConnect">
					<div className="modal-dialog modal-sm" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
								<h4 className="modal-title">Change password</h4>
							</div>
							<div className="modal-body">
								{this.changePassrender()}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
};

export default adminModal;