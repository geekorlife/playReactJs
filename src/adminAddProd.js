import React from 'react'
import ProductForm from './addProduct';
import ManageProduct from './manageProduct';

class addProd extends React.Component{
    constructor() {
        super();
        this.title;
    }

    routeView(){
        switch (this.props.currentView) {
            case 'addProduct':
                this.title = 'Add a new product';
                return (
                    <ProductForm handleCreate={this.props.handleCreate}/>
                )
                break;
            
            case 'viewProducts':
                this.title = 'Manage products';
                return (
                    <ManageProduct/>
                )
        
            default:
                this.title = 'Add a new product';
                return (
                    <ProductForm handleCreate={this.props.handleCreate}/>
                )
        }
    }

    render(){
        let caseView = this.routeView();
        return (
            <div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModal" id="addProAdm">
                <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 className="modal-title">{this.title}</h4>
                    </div>
                    <div className="modal-body">
                        {caseView}
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default addProd