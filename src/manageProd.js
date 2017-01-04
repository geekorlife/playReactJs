import React from 'react';
import store from './reduce/store';
import QuestionProduct from './questionProduct';

import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import { fullWhite } from 'material-ui/styles/colors';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionEdit from 'material-ui/svg-icons/action/subject';
import ActionSave from 'material-ui/svg-icons/action/done';

import Size from './setting/size';

class manageProd extends React.Component {
    constructor() {
        super();
        console.log('Size', Size);
        this.loadPage = this.loadPage.bind(this);
        this.imgAddedRend = this.imgAddedRend.bind(this);
        this.submitQa = this.submitQa.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.updateData = this.updateData.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.selectGender = this.selectGender.bind(this);
        this.getData = this.getData.bind(this);
        this.respondQa = this.respondQa.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);

        this._id = null;
        this.categ = [null, 'Clothes', 'Shoes', 'Childcare', 'Child furnitures', 'Toys', 'Outdoor', 'Other'];
        this.gend = [null, 'Unisex', 'Boy', 'Girl'];
        this.gendValue = null;
        this.catValue = null;
        this.defaultCategorie = { gender: null, cat: null };
        this.state = {
            editProd: false,
            product: { gende: null, cat: null },
            deleted: false,
            sizeValue : null
        }
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
            }

            var divStyle = {
                backgroundImage: 'url("/img/adImg/' + m + '")'
            };

            return (
                <div key={i} className="imgPrevAdded" style={divStyle} onClick={remImg}>
                </div>
            )
        })
        return im;
    }

    toggleEdit() {
        this.setState({ editProd: !this.state.editProd });
        
        // Reset default selected value
        if (!this.state.editProd) {
            this.gendValue = null;
            this.catValue = null;
            let saveState = { product: { gender: this.defaultCategorie.gender, cat: this.defaultCategorie.cat }};
            if(this.defaultCategorie.cat === 1 || this.defaultCategorie.cat === 2){
                const product = store.getState().product[0];
                const sizeArt = this.defaultCategorie.cat === 1 ? {sizeValue: product.idSize} : {whoShoesValue: product.idShoes.who, shoesValue: product.idShoes.size};
                saveState = Object.assign({}, saveState, sizeArt);
                this.setState(saveState);
            }
            
        }
        else if(this.defaultCategorie.cat === 1 || this.defaultCategorie.cat === 2){
            this.setState({ 
                sizeValue: null,
                whoShoesValue: null,
                shoesValue: null
            });
        }
    };

    selectCategory(df) {
        const that = this;
        const handleChangeS = (event, index, value) => {
            this.catValue = value;
            const nwPrd = Object.assign({}, this.state.product, { cat: value });
            this.setState({ product: nwPrd });
        }

        return (
            <SelectField
                floatingLabelText="Category"
                value={this.catValue || df}
                onChange={handleChangeS}
                >
                <MenuItem value={1} primaryText="Clothes" />
                <MenuItem value={2} primaryText="Shoes" />
                <MenuItem value={3} primaryText="Childcare" />
                <MenuItem value={4} primaryText="Child furnitures" />
                <MenuItem value={5} primaryText="Toys" />
                <MenuItem value={6} primaryText="Outdoor" />
                <MenuItem value={7} primaryText="Other" />
            </SelectField>
        )
    }

    selectGender(df) {
        let curVal = 1;
        const handleChangeS = (event, index, value) => {
            this.gendValue = value;
            const nwPrd = Object.assign({}, this.state.product, { gender: value });
            this.setState({ product: nwPrd });

        }
        return (
            <SelectField
                floatingLabelText="Gender"
                value={this.gendValue || df}
                onChange={handleChangeS}
                >
                <MenuItem value={1} primaryText="Unisex" />
                <MenuItem value={2} primaryText="Boy" />
                <MenuItem value={3} primaryText="Girl" />
            </SelectField>
        )
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
        var desc, editProd = false;

        if (product && product.img) {
            const that = this;
            const addProduct = function () {
                fn(product.id);
            }
            const editTxt = this.state.editProd ? 'Cancel' : 'Edit';
            
            const saveProd = () => {
                if (this.state.editProd) {
                    return (
                        <FlatButton
                            label="Save"
                            backgroundColor="#dd127b"
                            labelPosition="before"
                            labelStyle={{ color: 'white', width: '100%' }}
                            style={{ float: 'right', marginTop: '-20px', }}
                            onClick={this.toggleEdit}
                            >
                        </FlatButton>
                    )
                }
            };

            const idSize = () => {
                if (product.cat === 1) {
                    const rendSz = Size.idSz.map((s, i) => {
                        return <MenuItem key={i} value={i} primaryText={s} />
                    });

                    const handleChangeSize = (event, index, value) => {
                        that.setState({ sizeValue: value });
                    };
                    
                    return (
                            <div>
                            <SelectField
                                floatingLabelText="Size"
                                value={typeof that.state.sizeValue === 'number' ? that.state.sizeValue : product.idSize}
                                onChange={handleChangeSize}
                                >
                                {rendSz}
                            </SelectField>
                            <br />
                            </div>
                    )
                }
                else if (product.cat === 2) {
                    const rendST = Size.whoShoes.map((s, i) => {
                        return <MenuItem key={i} value={i} primaryText={s} />
                    });
                     
                    const handleChangeWhoShoes = (event, index, value) => {
                        this.setState({ whoShoesValue: value, shoesValue:0 });
                    };

                    const handleChangeSizeShoes = (event, index, value) => {
                        this.setState({ shoesValue: value });
                    };
                    const rendSizeSHoes = () => {
                        if (typeof product.idShoes.who === 'number') {
                            const whoShoesValue = typeof that.state.whoShoesValue === 'number' ? that.state.whoShoesValue : product.idShoes.who;
                            const dt = Size.sizeShoes[whoShoesValue].map((s, i) => {
                                return <MenuItem key={i} value={i} primaryText={s} />
                            })
                            return dt;
                        }
                    }

                    return (
                        <div>
                            <SelectField
                                floatingLabelText="For who"
                                value={typeof that.state.whoShoesValue ==='number' ? that.state.whoShoesValue : product.idShoes.who}
                                onChange={handleChangeWhoShoes}
                                >
                                {rendST}
                            </SelectField>
                            <br/>
                            <SelectField
                                floatingLabelText="Shoes size"
                                value={typeof that.state.shoesValue === 'number' ? that.state.shoesValue : product.idShoes.size}
                                onChange={handleChangeSizeShoes}
                                >
                                {rendSizeSHoes()}
                            </SelectField>
                        </div>
                    )
                }
                return null;
            };
            const inputProduct = () => {
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
                if (!this.state.editProd) {
                    return (
                        <div>
                            <h4>Category:</h4>
                            <p>{this.categ[product.cat]}</p>

                            <h4>Gender:</h4>
                            <p>{this.gend[product.gender]}</p>

                            {sizeClothe()}

                            <h4>Product name:</h4>
                            <p>{product.name}</p>

                            <h4>Description:</h4>
                            <p>{product.desc}</p>

                            <h4>Brand:</h4>
                            <p>{product.brand}</p>

                            <h4>Price:</h4>
                            <p>${product.price}</p>

                            <h4>Gender:</h4>
                            <p>{genderAttrib[product.gender]}</p>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            {this.selectCategory(product.cat)}
                            <br />
                            {this.selectGender(product.gender)}
                            <br />
                            {idSize()}
                            
                            <TextField
                                hintText="Enter the product name"
                                floatingLabelText="Product name:"
                                defaultValue={product.name}
                                ref='name'
                                />
                            <br />

                            <h4>Description:</h4>
                            <textarea className="desc" placeholder="Enter a description" ref='desc' defaultValue={product.desc} />

                            <TextField
                                hintText="Enter the brand"
                                floatingLabelText="Brand:"
                                defaultValue={product.brand}
                                ref='brand'
                                />
                            <br />
                            <TextField
                                hintText="Enter the price"
                                floatingLabelText="Price:"
                                defaultValue={product.price}
                                ref='price'
                                />

                            <h4>Gender:</h4>
                            <p>{genderAttrib[product.gender]}</p>
                        </div>
                    )
                }
            }
            var genderAttrib = [null, 'Unisex', 'Boy', 'Girl'];
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
                        {saveProd}

                        {inputProduct()}
                    </div>
                </div>
            )
        }
        return desc;
    }

    /**
     * Load article by id from the QUERY param after the component did mount
     * 
     * 
     * @memberOf productInfo
     */
    loadPage() {

        let id_connect = null;
        if (this.props.location && this.props.location.query) {
            id_connect = this.props.location.query.id;
        }

        store.dispatch(store.dispatchArticle('GET_ARTICLE_ADMIN', { id_connect }));
    }

    componentWillMount() {
        store.dispatch(store.dispatchArticle('RESET_PAGE_ARTICLE'));
    }

    componentDidUpdate() {
        var product = store.getState().product[0];
        if (!this.state.img && product && product.img.length > 0) this.setState({ img: product.img[0] });

        if (product) {
            if (product._id) this._id = product._id;
            this.defaultCategorie = { gender: product.gender, cat: product.cat };
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

    updateData() {
        const cate = this.state.product.cat ? this.state.product.cat : this.defaultCategorie.cat;
        const gend = this.state.product.gender ? this.state.product.gender : this.defaultCategorie.gender;
        let product = {
            id_connect: this.props.location.query.id,
            cat: Number(this.state.product.cat),
            gender: Number(this.state.product.gender),
            name: this.refs.name.getValue(),
            price: this.refs.price.getValue(),
            brand: this.refs.brand.getValue(),
            desc: this.refs.desc.value
        }
        if(cate === 1) {
            product.idSize = this.state.sizeValue;
        }
        else if(cate === 2) {
            product.idShoes =  {who: this.state.whoShoesValue, size: this.state.shoesValue};
        }
        this.setState({
            stateCreate: 1,
            stepIndex: 1,
            product: product
        })

        this.toggleEdit();

        store.dispatch(store.dispatchArticle('UPDATE_ARTICLE', { product }));
    }

    deleteArticle() {
        this.setState({
            deleted: true
        })

        store.dispatch(store.dispatchArticle('DELETE_ARTICLE', {
            id_connect: this.props.location.query.id,
            _id: this._id
        }));
    }

    respondQa(id, response) {
        let product = {
            id_connect: this.props.location.query.id,
            idQa: id,
            resp: response
        }
        store.dispatch(store.dispatchArticle('UPDATE_ARTICLE', { product }));
    }

    render() {
        // Get the product info form REDUX store
        var product = store.getState().product[0];

        const hstl = {
            marginTop: '10px'
        }
        if (this.state.deleted) {
            return (
                <div className="infoProd text-center" style={{ marginTop: '90px' }}>
                    <h3 style={hstl}>YOUR AD HAS BEEN DELETED</h3>
                </div>
            )
        }
        else if (!product) {
            // Load in the store
            return (
                <div className="infoProd text-center" style={{ marginTop: '90px' }}>
                    <h3 style={hstl}>LOADING YOUR AD</h3>
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
        var iconStl = {
            marginTop: '-5px',
            color: '#ffffff'
        }
        var qatest = product.qa;

        let tg = () => {
            $("div.qq").toggleClass("qa-noshow");
        };
        let tgp = () => {
            $("div.qqp").toggleClass("qap-noshow");
            $("div.qqps").addClass("qaps-noshow");
        };

        const editTxt = this.state.editProd ? 'Cancel' : 'Edit';

        const saveEdit = this.state.editProd ? (
            <RaisedButton
                label="Save"
                secondary={true}
                icon={<ActionSave style={iconStl} />}
                style={{ transform: 'translateY(50%)' }}
                onClick={this.updateData}
                fullWidth={true}
                />
        ) : '';

        return (
            <div className="infoProd" style={{ marginTop: '90px' }}>
                <div className="navEdit">
                    <div className="row">
                        <div className="col-md-3">
                        </div>
                        <div className="col-md-3">
                            {saveEdit}
                        </div>
                        <div className="col-md-3">
                            <RaisedButton
                                label={editTxt}
                                secondary={true}
                                icon={<ActionEdit style={iconStl} />}
                                style={{ transform: 'translateY(50%)' }}
                                onClick={this.toggleEdit}
                                fullWidth={true}
                                />
                        </div>
                        <div className="col-md-3">
                            <RaisedButton
                                label="Delete"
                                backgroundColor="#ef381c"
                                color={fullWhite}
                                className="raised-button--white"
                                icon={<ActionDelete style={iconStl} color={fullWhite} />}
                                style={{ transform: 'translateY(50%)' }}
                                onClick={this.deleteArticle}
                                fullWidth={true}
                                />
                        </div>
                    </div>
                </div>
                {desc}

                <div style={stlq}>

                    <div className="row qa-row">
                        <div className="col-md-4">
                            <h3 style={{ float: 'left', paddingLeft: '1em' }}>Questions:</h3>
                        </div>
                    </div>

                </div>
                <div>
                    <QuestionProduct admin={true} respondQa={this.respondQa} />
                </div>
            </div>
        )
    }
};

export default manageProd;