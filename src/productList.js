import React from 'react';
import Slider from 'nuka-carousel';
import store from './reduce/store';
import { Link } from 'react-router';

class RendCol extends React.Component {
    constructor(props) {
        super(props);
        this.addProductInCart = this.addProductInCart.bind(this);
        this.clickProd = this.clickProd.bind(this);
    }

    addProductInCart() {
        addProductInCart(this.props.r._id);
    }
    clickProd() {
            var id = this.props.r._id;
            this.props.handleInfo(id);
    }

    rendCarousel() {
        var displayAr = this.props.r.img.length > 1 ? 'block' : 'none';
        const Decorators = [
            {
                component: React.createClass({
                    render() {
                        return (
                            <button
                                style={this.getButtonStyles(this.props.currentSlide === 0)}
                                onClick={this.props.previousSlide}>
                                <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                            </button>
                        );
                    },
                    getButtonStyles(disabled) {
                        return {
                            border: 0,
                            background: 'rgba(0,0,0,0.4)',
                            color: 'white',
                            padding: 10,
                            outline: 0,
                            opacity: disabled ? 0.2 : 0.7,
                            cursor: 'pointer',
                        };
                    },
                }),
                style: {
                    display: displayAr
                },
                position: 'CenterLeft',
            },
            {
                component: React.createClass({
                    render() {
                        return (
                            <button
                                style={this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount)}
                                onClick={this.props.nextSlide}>
                                <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                            </button>
                        );
                    },
                    getButtonStyles(disabled) {
                        return {
                            border: 0,
                            background: 'rgba(0,0,0,0.4)',
                            color: 'white',
                            padding: 10,
                            outline: 0,
                            opacity: disabled ? 0.2 : 0.7,
                            cursor: 'pointer',
                        };
                    },
                }),
                style: {
                    display: displayAr
                },
                position: 'CenterRight',
            },
        ];
        var images = this.props.r.img.map((img, index) => {
                        const srci = img ? "/img/adImg/" + img : "/img/default.jpg";
                        const backG = {
                            backgroundImage: 'url('+srci+')'
                        }
                        return (
                            <div
                                key={index} 
                                className="img-Carousel" 
                                onClick={this.clickProd} 
                                onLoad={() => {window.dispatchEvent(new Event('resize'));}}
                                style={backG}
                            ></div>
                            
                        );
                    });
        if(this.props.r.img.length == 0) {
            images = (
                <img    src="/img/default.jpg"
                        className="img-responsive img-thumb" 
                        onClick={this.clickProd} 
                        onLoad={() => {window.dispatchEvent(new Event('resize'));}}
                />
            )
        }
        return (
            <Slider ref="slider" decorators={Decorators} style={{minHeight:'220px'}}>
                {images}
            </Slider>
        )
    }

    render() {
        const f = new Date(this.props.r.updatedAt).toString().split(' ');
        const dateP = [f[1], f[2]].join(' ');
        const imgRendSrc = this.rendCarousel();

        //<button className="btn btn-primary infobutton cartadd" onClick={this.addProductInCart}>Add to cart <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></button>
        return (
            <div className="col-md-4" ref="col" >
                <div className="bg-gray-dark bg-gray-dark-list">
                    <p className="priceAndCity" onClick={this.clickProd}>
                        <span className="priceMenu" >${this.props.r.price}</span>
                        <span className="cityMenu">{this.props.r.zip.cty}</span>
                    </p>

                    {imgRendSrc}
                    <h3 onClick={this.clickProd} className="descDate">{this.props.r.name} <span>{dateP}</span></h3>

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
            if (r.qty > 0) rd = <RendCol key={i} r={r} handleInfo={handleInf} />;
            return rd;
        });
        return <div>{dt}</div>;
    }
};

let addProductInCart;

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.productList = [];
        this.productState = [];
        this.numberArticlePerPage = 9;
        this.currentPage = 0;
        this.state = {
            currentPage: this.currentPage,
            _id: null,
            catId: null
        }
        this.geo = {
            geoPos: null,
            dist: null
        }
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

    componentWillMount() {
        this.productList = [];
    }

    componentDidMount() {
        const stFlux = store.getState();
        if(!this.geo.geoPos || !this.geo.dist) {
            console.log('UPDATE ZIP LIST');
            this.geo = {
                geoPos: stFlux.zip && stFlux.zip.code ? stFlux.zip.code.pos : null,
                dist: stFlux.zip && stFlux.zip.dist ? stFlux.zip.dist : null
            }
        }
        
        if (!this.state.catId || this.state.catId && this.props.catId != this.state.catId) {
            this.productList = [];
            this.setState({ catId: this.props.catId });
            store.dispatch(store.dispatchArticle('RESET_PAGE_ARTICLE'));
            store.dispatch(store.dispatchArticle('GET_LIST_ARTICLE', { 
                catId: this.props.catId, 
                dist: this.geo.dist, 
                geo: this.geo.geoPos 
            }));
        }
    }

    changePage(updown) {
        console.log('CLICK CHANGE PAGE');
        if (updown == 1) {
            this.currentPage = this.currentPage + 1;

            store.dispatch(store.dispatchArticle('GET_LIST_ARTICLE', { 
                _id: this.productState[this.productState.length - 1]._id, 
                catId: this.props.catId, 
                dist: this.geo.dist, 
                geo: this.geo.geoPos 
            }));
        }
        else if (this.currentPage - 1 > -1) {
            console.log('PREVIOUS');
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

    butNxtPrv(st) {
        const changeUp = () => {
            if(this.state.currentPage*9 + 9 <  store.getState().count) 
                this.changePage(1);
        }
        const changeDown = () => {
            console.log('CHANGE DOWN', this.state.currentPage);
            if(this.state.currentPage > 0)
                this.changePage(0);
        }
        console.log(this.state.currentPage+'* 9 + 9 <'+  store.getState().count);
        const stl = st ? { paddingTop: '20px' } : {};
        const pad = { paddingTop: '1px' };
        const classPrev = this.state.currentPage === 0 ? 'btn btn-primary noPrev' : 'btn btn-primary nextPrev';
        const classNextPrev = this.state.currentPage*9 + 9 <  store.getState().count ? 'btn btn-primary nextPrev' : 'btn btn-primary noPrev';
        return (
            <div className="text-center" style={stl}>
                <button className={classPrev} onClick={changeDown} >
                    <span className="glyphicon glyphicon-chevron-left float-left" style={pad} aria-hidden="true"></span>
                    Previous
                </button>
                <button className={classNextPrev} onClick={changeUp} >
                    Next
                    <span className="glyphicon glyphicon-chevron-right float-right" style={pad} aria-hidden="true"></span>
                </button>
            </div>
        )
    }

    haveToPopulateList() {
        this.productState = store.getState().product;
        let that = this;
        const activeCountArticle = this.currentPage * this.numberArticlePerPage;
        if (this.productState.length < 9) {
            this.productList = this.productState.filter((p, i) => {
                return p.cat == that.props.catId;
            });
            return false;
        }
        else if (this.productState.length >= activeCountArticle) {
            
            let idFrom = activeCountArticle;
            let idTo = idFrom + this.numberArticlePerPage;

            this.productList = this.productState.filter((p, i) => {
                return (i >= idFrom && i < idTo && p.cat == that.props.catId);
            });
            return false;
        }
        return true;
    }

    render() {
        this.haveToPopulateList();

        addProductInCart = this.props.addProductInCart;

        let product = this.productList;
        let rows = this.chunks(product, 3);
        let handleInf = this.props.handleInfo;

        if (product.length === 0) {
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
                    <ColProducts key={i} dataRow={row} handleInfo={handleInf} />
                </div>
            )
        })

        return (
            <div>
                {this.butNxtPrv(true)}
                <div className="eachDiv">{c}</div>
                {this.butNxtPrv()}
            </div>
        )
    }
};

export default ProductList;