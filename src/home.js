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
        this.state = {
            zip: null,
            error_msg: ''
        }
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
    
    render() {
        const classError = this.state.error_msg ? 'showError' : '';
        return (
            <div style={{width:'85%', margin:'80px auto 0px auto'}}>
                <h4 className="text-center">
                    Post and see ads about Kid stuff.
                </h4>
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
            </div>
        )
    }
}

export default home;