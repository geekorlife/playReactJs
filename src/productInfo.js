import React from 'react';
import store from './reduce/store';

class productInfo extends React.Component{
    constructor(){
        super();
        this.productList = store.getState().product;
    }

    getData(product,fn){
        var desc;
        
        if(product && product.img){
            var addProduct = function(){
                fn(product.id);
            }
            desc = (
                <table>
                    <tbody>
                    <tr>
                        <td><img src={product.img}/></td>
                        <td>
                            <h4>Description:</h4>
                            <p>{product.desc}</p>
                            
                            <h4>Brand:</h4>
                            <p>{product.brand}</p>

                            <h4>Price:</h4>
                            <p>${product.price}</p>
                            
                            <button className="btn btn-primary infobutton cartaddInf" onClick={addProduct}>
                                Add to cart <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            );
        }
        return desc;
    }

    render(){
        console.log('this.props',this.props.location.query);
        var product = store.getState().product[parseInt(this.props.params.id)];
        var desc = this.getData(product,this.props.addProductInCart);
        if(!product) return (
            <div>LOADING AD</div>
        )
        return (
            <div>
                <h4 className="modal-title">{product.name}</h4>
                {desc}
            </div>
        )
    }
};

export default productInfo;