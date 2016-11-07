import React from 'react';
import Nav from './nav';
import AdminBar from './adminBar';
import AdminModal from './adminModal';

class AppRoute extends React.Component{
  constructor(){
    super();
    this.state = {
      showAdmin: true, // Admin is connected or not
      currentView: 0,
      currentCart: [],
      zipCode: null
    };
  }
  rendAdmin() {
    return (this.state.showAdmin) ? <AdminBar handleCreate={this.createProduct} /> : undefined;
  }
  render() {
    return (
      <div>
        <Nav />
        <div id="home">
          {this.rendAdmin()}

          {this.props.children}

          <AdminModal handleConnect={this.activeAdmin} />
        </div>
      </div>
    )
  }
};

export default AppRoute;