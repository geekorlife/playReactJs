import React from 'react';

class adminModal extends React.Component{
    constructor(){
      super();
      this.tryConnect = this.tryConnect.bind(this);
    }
    tryConnect(e){
      e.preventDefault();
      this.props.handleConnect(this.refs.pwd.value);
    }
    render(){
        return (
        <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="myModal">
            <div className="modal-dialog modal-sm" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                  <h4 className="modal-title">Admin login</h4>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label>Login</label>
                      <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Email"/>
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref='pwd'/>
                    </div>
                    <button type="submit" className="btn btn-default" onClick={this.tryConnect}>Submit</button>
                  </form>
                </div>
              </div>
            </div>
        </div>
        )
    }
};

export default adminModal;