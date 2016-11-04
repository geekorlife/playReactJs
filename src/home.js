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
            zip: null
        }
    }

    sendZip() {
        
        const zip = {
            code: this.state.zip,
            dist: this.refs.dist.getValue()
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

        return (
            <div className="text-center" style={{width:'80%', margin:'auto'}}>
                <h2>My moms closet</h2>
                <p>
                    Sell and buy in the closet of other moms.
                </p>
                <div className="selectZip">
                    <AutoCompletion handleZip={this.handleZip} />
                    <br/>
                    <TextField
                        hintText="Enter max distance (miles)"
                        floatingLabelText="Max distance:"
                        ref='dist'
                    />
                    <br/>
                    <RaisedButton
                        label="Submit"
                        secondary={true}
                        icon={<ActionSave />}
                        style={{ transform: 'translateY(50%)' }}
                        onClick={this.sendZip}
                    />
                </div>
            </div>
        )
    }
}

export default home;