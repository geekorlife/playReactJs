import React from 'react';
import store from './reduce/store';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ActionSave from 'material-ui/svg-icons/action/done';

class adminModal extends React.Component {
	constructor() {
		super();
		this.submitEvent = this.submitEvent.bind(this);
		this.createAccountState = this.createAccountState.bind(this);
		this.cancelCreate = this.cancelCreate.bind(this);
		this.dataJsx = this.dataJsx.bind(this);
		this.updateIsLoggin = this.updateIsLoggin.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.state = {
			isLogin: false,
			isCreateAccount: false,
			email_error_text: '',
			shop_error_text: ''
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
		}
		this.setState({
			shop_error_text: ''
		});
		store.dispatch(store.dispatchArticle(typeEvent, { account }));
	}

	dataJsx() {
		let firstEntry = null;
		let title = 'Login';
		if (this.state.isCreateAccount) {
			title = 'Create an account';

			const errorTitle = this.state.shop_error_text ? (
				<h5 style={{color:'red', textAlign:'center'}}>{this.state.shop_error_text}</h5>
				) : null;

			firstEntry = (
				<div>
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
					<br />
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

	render() {
		const dataToRend = this.dataJsx();
		return (
			<div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="myModal" id="adminConnect">
				<div className="modal-dialog modal-sm" role="document">
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
		)
	}
};

export default adminModal;