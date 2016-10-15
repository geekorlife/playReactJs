import React from 'react';
import store from './reduce/store';

class RendCol extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthTitle: 0,
            widthCol: 0
        }
        this.addProductInCart = this.addProductInCart.bind(this);
        this.clickProd = this.clickProd.bind(this);
    }

    componentDidMount() {
        this.setState({
            widthTitle: this.refs.child.clientWidth,
            widthcol: this.refs.col.clientWidth
        });
    }

    prtWidth() {
        return { width: this.state.widthTitle + 'px' };
    }

    colHeight() {
        return { height: this.state.widthcol + 'px' };
    }

    clickProd() {
        var id = this.props.r.id;
        this.props.handleInfo(id);
    }

    addProductInCart() {
        addProductInCart(this.props.r.id);
    }

    render() {
        return (
            <div className="col-md-4" ref="col" style={this.colHeight() }>
                <div className="product">
                    <img src={this.props.r.img} ref="child"/>

                    <div className="menuProduct">
                        <span className="priceMenu">${this.props.r.price}</span>
                        <button className="btn btn-primary infobutton cartadd" onClick={this.addProductInCart}>Add to cart <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></button>
                        <button className="btn btn-primary infobutton inf" onClick={this.clickProd}>
                            More informations
                        </button>
                    </div>
                    <div className="titleProduct">{this.props.r.name}</div>
                </div>
            </div>
        )
    }
};

class ColProducts extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let handleInf = this.props.handleInfo;
        let dt = this.props.dataRow.map(function (r, i) {
            var rd;
            if (r.qty > 0) rd = <RendCol key={i} r={r} handleInfo={handleInf}/>;
            return rd;
        });
        return <div>{dt}</div>;
    }
};

let addProductInCart;

class ProductList extends React.Component {
    constructor(props){
        super(props);
    }
    chunks(arr, size) {
        if (!Array.isArray(arr)) {
            throw new TypeError('Input should be Array');
        }

        if (typeof size !== 'number') {
            throw new TypeError('Size should be a Number');
        }
        let validArray = arr.filter((ar) => {
            return ar.qty > 0;
        })

        let result = [];
        for (let i = 0; i < validArray.length; i += size) {
            result.push(validArray.slice(i, size + i));
        }
        return result;
    }
    render() {
        addProductInCart = this.props.addProductInCart;
        let product = store.getState().product;
        let rows = this.chunks(product, 3);
        let handleInf = this.props.handleInfo;
        
        let c = rows.map(function (row, i) {
            return (
                <div className="row" key={i}>
                    <ColProducts key={i} dataRow={row} handleInfo={handleInf}/>
                </div>
            )
        })

        return <div className="eachDiv">{c}</div>;
    }
};

export default ProductList;