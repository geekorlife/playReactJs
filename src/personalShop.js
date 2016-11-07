import React from 'react';
import store from './reduce/store';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';

class personalShop extends React.Component{

    componentDidMount(){
        const st = store.getState().user.shpnme;
        if(st)
            browserHistory.push('/myshop/'+st);
    }
    componentWillUpdate(){
        const st = store.getState().user.shpnme;
        if(st)
            browserHistory.push('/myshop/'+st);
    }
    logIn() {
        $('#adminConnect').modal('show');
    }
    render(){
        return (
            <div className="text-center mainPers">
                <h3>Your personal Shop</h3>
                <br/>
                <p>
                A personal shop is a dedicate space where you will be able to manage all of your ads list.<br/><br/>
                When you create an account, your personal shop is automaticaly created and a link on each of your ads 
                will give the possiblity to the other users to enter in your personal shop and take a look of all of your ads list.
                </p>
                <br/>
                <h4>Log in or create an account to access to your personal shop.</h4>
                <RaisedButton
                        label="Login / Create an account"
                        secondary={true}
                        style={{ transform: 'translateY(0%)' }}
                        onClick={this.logIn}
                />
            </div>
        )
    }
}

export default personalShop;