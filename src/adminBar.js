import React from 'react'
import AdminAddProd from './adminAddProd'

class addProd extends React.Component{
    constructor() {
        super();
        this.possibleView = ['addProduct','viewProducts'];
        this.state = {
            currentView:this.possibleView[0]
        }
        this.currentView = this.possibleView[0];
        this.createNewProd = this.createNewProd.bind(this);
        this.showAdd = this.showAdd.bind(this);
        this.showProd = this.showProd.bind(this);
        this.showParser = this.showParser.bind(this);
    }

    createNewProd(p){
        this.props.handleCreate(p);
    }

    showParser(id){
        this.setState({
            currentView: this.possibleView[id]
        })
        this.currentView = this.possibleView[id];
        $('#addProAdm').modal('show');
    }

    showAdd(){
        this.showParser(0);
    }

    showProd(){
        this.showParser(1);
    }

    render(){
        return (
            <div>
                <button onClick={this.showAdd}>Add a new product</button>
                <button onClick={this.showProd}>Manage products</button>
                <AdminAddProd handleCreate={this.createNewProd} currentView={this.currentView} />
            </div>
        )
    }
}

export default addProd