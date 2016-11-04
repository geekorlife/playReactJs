import React from 'react';
import ProductForm from './productForm';

class addProduct extends React.Component{
    constructor(props){
        super(props);
        this.showNext = false;
        this.goToNext = this.goToNext.bind(this);
        this.ctxRender = this.ctxRender.bind(this);
        this.state= {
            cat:null
        }
    }
    buttonRend(arg){
        let goNext = () => {
            this.setState({
                cat: arg.id
            });
        }
        return(
            <button type="button" key={arg.id} className="btn btn-primary btn-lg btn-block" onClick={goNext}>{arg.n}</button>
        )
    }
    butRend(){
        if(this.state.cat) return;
        const butArray = [
            {n:'Clothes',id:1},
            {n:'Shoes',id:2},
            {n:'Childcare',id:3},
            {n:'Child furnitures',id:4},
            {n:'Toys',id:5},
            {n:'Outdoor',id:6},
            {n:'Others',id:7}
        ]
        const but = butArray.map((m) => {
            return this.buttonRend(m);
        })
        
        return (
            <div>
            {but}
            </div>
        )
    }
    goToNext(idCat){
        this.setState({
            cat: idCat
        });
    }
    ctxRender(){
        var createAd = this.butRend();

        if(this.state.cat){
            createAd = <ProductForm handleCreate={this.props.handleCreate}/>;
        }
        return (
            <div>
                {createAd}
            </div>
        )
    }

    render(){
        var rd = this.ctxRender();
        const stl = {
            marginTop: '80px'
        }
        return (
            <div className="well center-block" style={stl}> 
                <ProductForm handleCreate={this.props.handleCreate}/>
            </div>
        )
    }
}

export default addProduct;