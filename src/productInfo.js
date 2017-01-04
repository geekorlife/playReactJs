"use strict"

import React from 'react';
import store from './reduce/store';
import QuestionProduct from './questionProduct';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Size from './setting/size';

class productInfo extends React.Component {
    constructor() {
        super();

        // Set genderColor and gender to change the border color dynamicaly
        this.state = {
            img: null,
            genderColor: '1px solid rgba(0,0,0,0.5)',
            gender: 1
        };

        this.loadPage = this.loadPage.bind(this);
        this.imgAddedRend = this.imgAddedRend.bind(this);
        this.submitQa = this.submitQa.bind(this);
        this.submitQap = this.submitQap.bind(this);

        this._id = null;
    }

    /**
     * Rend catalog image if exists
     * 
     * @param {any} product
     * @returns
     * 
     * @memberOf productInfo
     */
    imgAddedRend(product) {
        let im = product.img.map((m, i) => {
            const remImg = () => {
                this.setState({
                    img: m
                });
            };

            var divStyle = {
                backgroundImage: 'url("/img/adImg/' + m + '")'
            };

            return (
                <div key={i} className="imgPrevAdded" style={divStyle} onClick={remImg} ></div>
            )
        })
        return im;
    }

    /**
     * If the product is linked to a shop, rend a My Shop button
     * 
     * @param {any} prodt
     * @returns
     * 
     * @memberOf productInfo
     */
    myShopButton(prodt) {
        if (prodt.shopName) {
            const myshp = '/myshop/' + prodt.shopName;
            return (
                <RaisedButton
                    label="Enter in my Shop"
                    backgroundColor="#00BCD4"
                    labelPosition="before"
                    labelStyle={{ color: 'white', width: '100%' }}
                    icon={<FontIcon className="material-icons" color={'#ffffff'}></FontIcon>}
                    className="question"
                    onClick={(e) => { browserHistory.push(myshp) } }
                    fullWidth={true}
                    >
                </RaisedButton>
            )
        }
    }

    /**
     * Transform a product object in JSX data
     * 
     * @param {any} product
     * @param {any} fn
     * @returns
     * 
     * @memberOf productInfo
     */
    getData(product, fn) {
        let desc = null;

        if (product && product.img) {
            var addProduct = function () {
                fn(product.id);
            }
            var genderAttrib = [null, 'Unisex', 'Boy', 'Girl'];
            const sizeClothe = () => {
                if (typeof product.idSize === 'number') {
                    return (
                        <div>
                            <h4>Size:</h4>
                            <p>{Size.idSz[product.idSize]}</p>
                        </div>
                    )
                }
                else if (product.idShoes && typeof product.idShoes.who === 'number') {
                    return (
                        <div>
                            <h4>For who:</h4>
                            <p>{Size.whoShoes[product.idShoes.who]}</p>

                            <h4>Size:</h4>
                            <p>{Size.sizeShoes[product.idShoes.who][product.idShoes.size]}</p>
                        </div>
                    )
                }
            }
            desc = (
                <div className="row">
                    <div className="col-md-4">
                        <div className="imgPreview">
                            <img src={this.state.img ? '/img/adImg/' + this.state.img : '/img/default.jpg'} />
                        </div>
                        <hr />
                        <div className="wrapper">
                            <div className="wrapper-info">
                                {this.imgAddedRend(product)}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h4>Description:</h4>
                        <p>{product.desc}</p>

                        <h4>Brand:</h4>
                        <p>{product.brand}</p>

                        {sizeClothe()}

                        <h4>Price:</h4>
                        <p>${product.price}</p>

                        <h4>Gender:</h4>
                        <p>{genderAttrib[product.gender]}</p>

                        {this.myShopButton(product)}

                    </div>
                </div>
            )
        }
        return desc;
    }

    /**
     * Load article by id from the QUERY param after the component did mount
     * 
     * @memberOf productInfo
     */
    loadPage() {

        let _id = null;
        if (this.props.location && this.props.location.query) {
            _id = this._id = this.props.location.query._id;
        }

        store.dispatch(store.dispatchArticle('GET_ARTICLE', { _id: _id }));
    }

    componentWillMount() {
        store.dispatch(store.dispatchArticle('RESET_PAGE_ARTICLE'));
    }

    componentDidUpdate() {
        var product = store.getState().product[0];
        if (!this.state.img && product && product.img.length > 0) this.setState({ img: product.img[0] });

        if (product && this.state.gender !== product.gender) {

            if (product.gender == 2) {
                this.setState({
                    genderColor: '1px solid rgba(39,132,219,0.5)',
                    gender: product.gender
                });
            }
            else if (product.gender == 3) {

                this.setState({
                    genderColor: '1px solid rgba(221,18,123,0.5)',
                    gender: product.gender
                });
            }
        }

    }

    componentDidMount() {
        this.loadPage();
    }

    /**
     * Submit a public request by updating the qa DB
     * 
     * @memberOf productInfo
     */
    submitQa() {
        var dataQa = { qa: this.refs.qaAsk.value };
        store.dispatch(store.dispatchArticle('ADD_QA', { _id: this._id, qa: dataQa }));
        this.refs.qaAsk.value = '';
        $("div.qq").toggleClass("qa-noshow");
    }

    /**
     * Submit a private request by sending an email to the owner
     * 
     * @returns
     * 
     * @memberOf productInfo
     */
    submitQap() {
        if (this.state.email_error_text && this.state.email_error_text.length > 0 || this.refs.emailp.getValue() == '') {
            this.setState({
                email_error_text: 'Enter a valid address'
            });
            return false;
        }
        var dataQa = { _id: this._id, msg: this.refs.qaAskp.value, from: this.refs.emailp.getValue() };

        store.dispatch(store.dispatchArticle('ADD_QAP', dataQa));
        this.refs.qaAskp.value = '';
        $("div.qqp").toggleClass("qap-noshow");
        $("div.qqps").removeClass("qaps-noshow");
        setTimeout(function () { $("div.qqps").addClass("qaps-noshow") }, 2000);
        return true;
    }

    /**
     * Check valide email or not and populate local state
     * 
     * @param {any} e
     * 
     * @memberOf productInfo
     */
    checkEmail(e) {
        const value = e.target.value;
        const err = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalide email address' : '';
        this.setState({
            email_error_text: err
        });
    }

    render() {
        // Get the product info form REDUX store
        var product = store.getState().product[0];

        const hstl = {
            marginTop: '10px'
        };

        if (!product) {
            // Load in the store
            return (
                <div className="infoProd text-center" style={{ marginTop: '90px' }}>
                    <h3 style={hstl}>LOADING AD</h3>
                </div>
            )
        }
        else if (product == 'no_exist') {
            // No product in the store
            return (
                <div className="infoProd text-center" style={{ marginTop: '90px' }}>
                    <h3 style={hstl}>404. No product available</h3>
                </div>
            )
        }

        var desc = this.getData(product, this.props.addProductInCart);
        var stlq = {
            marginTop: '20px',
            width: '100%',
            backgroundColor: '#dd127b',
            color: 'white'
        }
        var descstl = {
            color: '#888',
            fontWeight: '500',
            fontSize: '0.95em'
        }
        var qatest = product.qa;

        let tg = () => {
            $("div.qq").toggleClass("qa-noshow");
        };
        let tgp = () => {
            $("div.qqp").toggleClass("qap-noshow");
            $("div.qqps").addClass("qaps-noshow");
        };

        return (
            <div className="infoProd" style={{ marginTop: '90px', border: this.state.genderColor }}>
                <h4 className="modal-title">{product.name}</h4>
                {desc}

                <div style={stlq}>

                    <div className="row qa-row">
                        <div className="col-md-4">
                            <h3 style={{ float: 'left', paddingLeft: '1em' }}>Questions:</h3>
                        </div>
                        <div className="col-md-4">
                            <RaisedButton
                                label="Ask public question"
                                backgroundColor="#00BCD4"
                                labelPosition="before"
                                labelStyle={{ color: 'white', width: '100%' }}
                                icon={<FontIcon className="material-icons" color={'#ffffff'}></FontIcon>}
                                className="question"
                                onClick={tg}
                                fullWidth={true}
                                >
                            </RaisedButton>
                        </div>
                        <div className="col-md-4">
                            <RaisedButton
                                label="Contact the seller"
                                backgroundColor="#00BCD4"
                                labelPosition="before"
                                labelStyle={{ color: 'white', width: '100%' }}
                                icon={<FontIcon className="material-icons" color={'#ffffff'}></FontIcon>}
                                className="question"
                                onClick={tgp}
                                fullWidth={true}
                                >
                            </RaisedButton>
                        </div>
                    </div>
                    <div className="row qq qa-noshow">
                        <div className="col-md-12">
                            <textarea className="qa-ask" placeholder="Enter your question" ref='qaAsk' />
                            <FlatButton
                                label="SEND"
                                backgroundColor="#00BCD4"
                                labelPosition="before"
                                labelStyle={{ color: 'white', width: '100%' }}
                                icon={<FontIcon className="material-icons" color={'#ffffff'}></FontIcon>}
                                style={{ float: 'right', transform: 'translate(-7%, 50%)' }}
                                onClick={this.submitQa}
                                >
                            </FlatButton>
                        </div>
                    </div>
                    <div className="row qqp qap-noshow">
                        <div className="col-md-12">
                            <h4 className="text-center" style={{ color: 'black' }}>Send a private email to the owner.</h4>
                            <TextField
                                hintText="Email"
                                floatingLabelText="Enter your Email"
                                errorText={this.state.email_error_text}
                                onChange={e => this.checkEmail(e)}
                                ref='emailp'
                                style={{ marginLeft: '5px' }}
                                />
                            <br /><br />
                            <textarea className="qap-ask" placeholder="Enter your question" ref='qaAskp' />
                            <FlatButton
                                label="SEND"
                                backgroundColor="#00BCD4"
                                labelPosition="before"
                                labelStyle={{ color: 'white', width: '100%' }}
                                icon={<FontIcon className="material-icons" color={'#ffffff'}></FontIcon>}
                                style={{ float: 'right', transform: 'translate(-7%, 50%)' }}
                                onClick={this.submitQap}
                                >
                            </FlatButton>
                        </div>
                    </div>
                    <div className="row qqps qaps-noshow">
                        <div className="col-md-12">
                            <h4 className="text-center" style={{ color: 'black' }}>Message sent !</h4>
                        </div>
                    </div>
                </div>
                <div>
                    <QuestionProduct qa={qatest} />
                </div>
            </div>
        )
    }
};

export default productInfo;