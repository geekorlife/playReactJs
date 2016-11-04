import React from 'react';
import TextField from 'material-ui/TextField';
import ActionSave from 'material-ui/svg-icons/action/done';
import ActionCancel from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';
import {fullWhite} from 'material-ui/styles/colors';
import store from './reduce/store';

class questionProduct extends React.Component {
    constructor() {
        super();

        this.state = {
            qa: [],
            currentEdit: null
        }
        this.cancelQa = this.cancelQa.bind(this);
        this.currentEdit = null;
    }

    /**
     * Fill state with question data
     * 
     * @returns
     * 
     * @memberOf questionProduct
     */
    fillQaState(force) {
        var productqa = store.getState().product[0];
        const newQa = productqa.qa.map((q, i) => {
            return { id: i, qa: q };
        });

        this.setState({ qa: newQa });
    }

    componentWillReceiveProps(){
        this.fillQaState();
        this.setState({currentEdit: null});
    }

    cancelQa(){
        this.setState({currentEdit: null});
    }

    loadQa(){
        this.setState({currentEdit: {loading:this.state.currentEdit}});
    }

    render() {
        var prodInfo = this.props.qa || this.state.qa;
        var qa = prodInfo.map((q, i) => {
            
            const qaq = this.props.admin ? q.qa : q;
            if(!qaq) return;
            const resp = qaq.own ? 'R: '+qaq.own : 'R: No answer for now...';

            const respondQa = (resp) => {
                this.props.respondQa(i, this.refs.resp.value);
                this.loadQa();
            }

            const editResp = () => {
                this.setState({currentEdit: i});
            }

            const rendResp = () => {
                if (this.props.admin) {
                    if(this.state.currentEdit === i) {
                        var iconStl = {
                            marginTop:'-5px',
                            color: '#ffffff'
                        }
                        return (
                            <div className="row" style={{backgroundColor:'#EEE',paddingBottom: '0px'}}>
                                <div className="col-md-8">
                                <textarea className="desc responseQa" placeholder="Enter your response " ref='resp' />
                            
                                </div>
                                <div className="col-md-2">
                                <FlatButton
                                    label="Save"
                                    backgroundColor="#dd127b"
                                    labelPosition="before"
                                    labelStyle={{ color: 'white', width: '100%'}}
                                    style={{ float: 'right', marginTop: '0px', transform:'translateY(50%)'}}
                                    icon= {<ActionSave style={iconStl} color={fullWhite}/>}
                                    onClick={respondQa}
                                    >
                                </FlatButton>
                                </div>
                                <div className="col-md-2">
                                <FlatButton
                                    label="Cancel"
                                    backgroundColor="#dd127b"
                                    labelPosition="before"
                                    labelStyle={{ color: 'white', width: '100%'}}
                                    style={{ float: 'right', marginTop: '0px', transform:'translateY(50%)'}}
                                    icon= {<ActionCancel style={iconStl} color={fullWhite}/>}
                                    onClick={this.cancelQa}
                                    >
                                </FlatButton>
                                </div>
                            </div>
                        )
                    }
                    else if(this.state.currentEdit && typeof this.state.currentEdit.loading === 'number' && this.state.currentEdit.loading == i){
                        return (
                            <div>
                                SAVING...
                            </div>
                        )
                    }
                    else {
                        return (
                            <div>
                                {resp}
                                <button onClick={(editResp)}>Edit a response</button>
                            </div>
                        )
                    }
                    
                }
                else {
                    return (
                        <div>
                            {resp}
                        </div>
                    )
                }
            }

            const indx = i + 'q';
            return (
                <div key={i}>
                    <div className="qa-other" >Q: {qaq.qa}</div>
                    <div className="qa-owner" >
                        {rendResp()}
                    </div>
                </div>
            )
        })
        
        return <div className="qa" >{qa}</div>
    }
}

export default questionProduct;