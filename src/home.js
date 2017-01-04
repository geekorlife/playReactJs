"use strict";

import React from 'react';
import store from './reduce/store';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import ActionSave from 'material-ui/svg-icons/action/done';
import AutoCompletion from './autoCompletion';

import AutoComplete from 'material-ui/AutoComplete';

class home extends React.Component {
    constructor() {
        super();
        this.sendZip = this.sendZip.bind(this);
        this.handleZip = this.handleZip.bind(this);
        this.rendForm = this.rendForm.bind(this);
        this.state = {
            zip: null,
            error_msg: ''
        };
    }

    sendZip() {
        const mxDist = this.refs.dist.getValue();
        if(!this.state.zip){
            this.setState({
                error_msg: 'Error: Type a city name or a zipcode and select a city in the list'
            });
            return;
        }
        else if(!mxDist) {
            this.setState({
                error_msg: 'Error: You have to enter a max distance'
            });
            return;
        }
        
        const zip = {
            code: this.state.zip,
            dist: mxDist
        }
        
        store.dispatch(store.dispatchArticle('SET_LOCAL_ZIP', zip));
    }

    handleZip(e) {
        
        if(e && e.length == 1) {
            this.setState({
                zip: e[0]
            });
        }
    }

    rendForm(){
        const classError = this.state.error_msg ? 'showError' : '';
        return(
            <div className="selectZip">
                <h5 className={classError}>{this.state.error_msg}</h5>
                <AutoCompletion handleZip={this.handleZip} />
                <br/>
                <TextField
                        hintText="Enter max distance (miles)"
                        floatingLabelText="Max distance:"
                        type="number"
                        ref='dist'
                    />
                <br/>
                <RaisedButton
                        label="Submit"
                        secondary={true}
                        icon={<ActionSave />}
                        style={{ transform: 'translateY(0%)' }}
                        onClick={this.sendZip}
                    />
            </div>
        )
    }

    renderLoading(){
        console.log('loading...');
        
        return(
            <div style={{paddingTop: '130px', textAlign:'center'}}>
                <CircularProgress size={60} thickness={5} />
                <br/>
                <span style={{color: '#777'}}>LOADING</span>
            </div>
        )
    }
    
    render() {
        const str = store.getState();
        console.log('str',str);
        const mainRender = str.post_state.loading ? this.renderLoading() : this.rendForm();
        
        return (
            <div className="zipEnter">
                <h4 className="text-center titleHome">
                    THE BEST PLACE TO SELL AND BUY KID STUFFS.
                </h4>
                {mainRender}
            </div>
        )
    }
}

export default home;