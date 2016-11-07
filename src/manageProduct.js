import React from 'react';
import store from './reduce/store';

class manageProduct extends React.Component {
    constructor(){
        super();
        this.test = '/img/default.jpg';
        this.listProduct = this.listProduct.bind(this);
    }

    handleOnChange(e){
        console.log(e);
    }

    listProduct(){
        var article = store.getState().product;
        var that = this;
        var ret = article.map((a,i) =>{
            return (
                <tr key={i}>
                    <td>
                        <div className="imgAdp">
                            <img src={a.img}/>
                        </div>
                        <div className="descAdp">
                            <input type="text" onChange={this.handleOnChange} value={a.name}/>
                            <input type="text" onChange={this.handleOnChange} value={a.brand}/>
                            <input type="text" onChange={this.handleOnChange} value={a.price}/>
                            <input type="text" onChange={this.handleOnChange} value={a.qty}/>
                            <textarea onChange={this.handleOnChange} value={a.desc}/>
                        </div>
                    </td>
                    
                </tr>
            )
        })
        return ret;
    }

    render(){
        var listP = this.listProduct();
        return (
            <div className="eachDivProd">
                <table>
                <tbody>
                    {listP}
                </tbody>
                </table>
            </div>
        )
    }
}

export default manageProduct;