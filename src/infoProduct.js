import React from 'react';

class infoProduct extends React.Component{
    constructor(){
        super();
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
        var product = this.props.product;
        var desc = this.getData(product,this.props.addProductInCart);
        if(!product) return (
            <div className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myModal" id="prodInf"></div>
        )
        return (
            <div className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myModal" id="prodInf">
                <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 className="modal-title">{product.name}</h4>
                    </div>
                    <div className="modal-body">
                        {desc}
                    </div>
                </div>
                </div>
            </div>
        )
    }
};

export default infoProduct;