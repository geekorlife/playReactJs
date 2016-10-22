import React from 'react';
import store from './reduce/store';
import {Link} from 'react-router';

class RendCol extends React.Component {
    constructor(props) {
        super(props);
        this.addProductInCart = this.addProductInCart.bind(this);
        this.clickProd = this.clickProd.bind(this);
    }

    clickProd() {
        console.log('CLICK PROD',this.props);
        //var id = this.props.r.id;
        //this.props.handleInfo(id);
    }

    addProductInCart() {
        addProductInCart(this.props.r.id);
    }

    render() {
        const stl = {
            fontWeight: '100',
            letterSpacing: '0.04em',
            fontSize: '1.4em',
            marginTop: '8px',
            marginLeft: '6px'
        };
        const bgStl = {
            height: '340px'
        }
        const pStl = {
            position: 'absolute',
            bottom: '23px'
        }

        const clickProd = () => {
            console.log('CLICK PROD',this.props.r);
            var id = this.props.r._id;
            this.props.handleInfo(id);
        }
        const f = new Date(this.props.r.updatedAt).toString().split(' ');
        const dateP = [f[1],f[2]].join(' ');
        return (
            <div className="col-md-4" ref="col" >
                <div className="bg-gray-dark" style={bgStl} onClick={clickProd}>
                    <h3 style={stl}>{this.props.r.name} <span>{dateP}</span></h3>
                
                    <img src={this.props.r.img} alt={this.props.r.name} className="img-responsive img-thumb" />
                    <p style={pStl}>
                        <span className="priceMenu" >${this.props.r.price}</span>
                        <button className="btn btn-primary infobutton cartadd" onClick={this.addProductInCart}>Add to cart <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></button>
                    </p>
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
        this.productList = [];
        this.productState = [];
        this.numberArticlePerPage = 9;
        this.currentPage = 0;
        this.state = {
            currentPage: this.currentPage,
            _id:null,
            catId: null
        }
        this.loadPage = this.loadPage.bind(this);
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

    componentWillMount(){
        this.productList = [];   
    }

    loadPage(){
        if( !this.state.catId || this.state.catId && this.props.catId != this.state.catId) {
            console.log('GET PAGE');
            this.productList = [];
            this.setState({catId: this.props.catId});
            store.dispatch(store.dispatchArticle('GET_LIST_ARTICLE',{catId:this.props.catId}));
        }
    }

    componentDidMount(){
        console.log('COMPONENT  DID MOUNT - CAT:', this.props.catId);
        this.loadPage();
    }

    changePage(updown){
        if(updown == 1) {
            this.currentPage = this.currentPage + 1;
            if(this.haveToPopulateList()){
                store.dispatch(store.dispatchArticle('GET_LIST_ARTICLE',{_id:this.productState[this.productState.length-1]._id, catId:this.props.catId}));
            }
        }
        else if(this.currentPage - 1 > -1){
            this.currentPage = this.currentPage - 1;
            this.haveToPopulateList();
        }
        else {
            return;
        }

        this.setState({
            currentPage: this.currentPage
        })
    }

    butNxtPrv(){
        const changeUp = () => {
            this.changePage(1);
        }
        const changeDown = () => {
            this.changePage(0);
        }
        return (
            <div className="text-center">
                <button className="btn btn-primary nextPrev" onClick={changeDown} >Previous</button>
                <button className="btn btn-primary nextPrev" onClick={changeUp} >Next</button>
            </div>
        )
    }

    haveToPopulateList(){
        console.log('haveToPopulateList');
        this.productState = store.getState().product;
        let that = this;
        console.log('haveToPopulateList',this.productState);
        console.log('if('+this.productState.length+' >= ('+this.currentPage*this.numberArticlePerPage+')+'+this.numberArticlePerPage+')');
        if(this.productState.length < 9){
            this.productList = this.productState.filter((p,i) => {
                console.log('p.cat',p.cat,'that.props.cat',that.props.cat);
                return p.cat == that.props.catId;
            });
            return false;
        }
        else if(this.productState.length >= (this.currentPage*this.numberArticlePerPage)+this.numberArticlePerPage){
            console.log('SECOND TRUE');
            let idFrom = (this.currentPage*this.numberArticlePerPage);
            let idTo = idFrom + this.numberArticlePerPage;
            
            this.productList = this.productState.filter((p,i) => {
                return (i >= idFrom && i < idTo && p.cat == that.props.catId);
            });
            return false;
        }
        return true;
    }

    render() {
        console.log('component render',this.productList);
        this.haveToPopulateList();
        console.log('component render after',this.productList);
        
        addProductInCart = this.props.addProductInCart;

        let product = this.productList;
        let rows = this.chunks(product, 3);
        let handleInf = this.props.handleInfo;
        
        if(product.length === 0) {
            var stl = {
                marginTop: '100px'
            }
            return (
                <div className="text-center">
                <h3 style={stl}>Empty list...</h3>
                </div>
            )
        }

        let c = rows.map(function (row, i) {
            return (
                <div className="row" key={i}>
                    <ColProducts key={i} dataRow={row} handleInfo={handleInf}/>
                </div>
            )
        })

        return (
            <div>
            {this.butNxtPrv()}
            <div className="eachDiv">{c}</div>
            {this.butNxtPrv()}
            </div>
        )
    }
};

export default ProductList;