import React from 'react';
import Slider from 'nuka-carousel';
import store from './reduce/store';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { browserHistory } from 'react-router';

class myshop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: [],
            gendValue: 1,
            catValue: 0,
            avt: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAKAAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODU4RDJDNUE5QUYwMTFFNjlENTU5NEQwMTM0OUQ4OTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODU4RDJDNUI5QUYwMTFFNjlENTU5NEQwMTM0OUQ4OTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NThEMkM1ODlBRjAxMUU2OUQ1NTk0RDAxMzQ5RDg5NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NThEMkM1OTlBRjAxMUU2OUQ1NTk0RDAxMzQ5RDg5NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEABQQEBkSGScXFycyJh8mMi4mJiYmLj41NTU1NT5EQUFBQUFBREREREREREREREREREREREREREREREREREREREQBFRkZIBwgJhgYJjYmICY2RDYrKzZERERCNUJERERERERERERERERERERERERERERERERERERERERERERERERERP/AABEIACsAKwMBIgACEQEDEQH/xACBAAEBAQADAQAAAAAAAAAAAAAGBQEAAgQDAQACAwEAAAAAAAAAAAAAAAACAwAEBQEQAAEDAQUFBgcAAAAAAAAAAAEAAgMEESExEgVBUYEyE2Fx0XIUNMHhImKyMwYRAAIBAgYBBQEAAAAAAAAAAAECABEDITFBURIEE2FxMkJSFP/aAAwDAQACEQMRAD8AYKVqurekPSiAMhvNuDfmqyHyQurq17G4l7r9wCJRvLXXRWYtc+Kis6nVqtxt6h4AeCr6Tq7qh3RnszHldv7FShooYY+kxoykWHee9HJ9Pk06dkltrM4ynbxRYGWA1q8GQKFP1itcWrEuZs1HNIIFfKDj9f5JGh0lQ6jrXyMxD3XbwSiXWXOupYXEGZWMF4tR6WVgkvJcGsH3E48AvvSVLaqISstAO9HqysfUVzGuGVsbw0N448VAMYuzbJc6cM4oWLViGV55q6rFHCZTecGjeUNfM6SQyuvcTmKQ/wBF+lnm+CNJi0mp0+HE/vX2junkbLG17LmkAhG9emDqgMbiwXnbafBV9D9o3HF2Pfs7EZrvcSW28x5sVxc4nrBfKcd+PrLOi6m+R3p5jaTyOOPcryF6b7qLzBNFMKwj4v6FpTjrtWf/2Q==',
            desc: null,
            editMode: false,
            shopName: props.params.shopname,
            shop_error_text: ''
        }
        this.updateList = this.updateList.bind(this);
        this.checkExistName = this.checkExistName.bind(this);
        this.shopName = '';
        this.adminMode = null;
    }

    updateList(value) {
        if (this.props.params && this.props.params.shopname) {
            this.shopName = this.props.params.shopname;

            //CHeck if this shop exist and return all articles
            let cmd = {
                shopName: this.props.params.shopname,
                adminMode: this.adminMode
            }
            if (value && value.catValue && value.catValue > 0) {
                cmd.cat = value.catValue;
            }
            if (value && value.gendValue && value.gendValue > 1) {
                cmd.gender = value.gendValue;
            }

            store.dispatch(store.dispatchArticle('GET_SHOP_ARTICLE', cmd));
        }
    }

    componentDidMount() {
        const shpLocal = JSON.parse(localStorage.getItem("usrData"));
        console.log('shpLocal', shpLocal);

        this.adminMode = shpLocal && shpLocal.shpnme && (shpLocal.shpnme.toLowerCase() === this.props.params.shopname.toLowerCase());
        this.updateList();
    }

    componentWillUpdate() {
        console.log('UPDATE COMPO');
        const stFlux = store.getState();

        const listProduct = stFlux.product.map((p) => {
            if (p.shopName && p.shopName === this.shopName)
                return p;
        })

        if (this.state.product.length !== listProduct.length || this.state.desc !== stFlux.currentShop.desc) {
            this.setState({
                product: listProduct,
                avt: stFlux.currentShop.avatar,
                desc: stFlux.currentShop.desc
            })
        }

        const shpLocal = JSON.parse(localStorage.getItem("usrData"));
        if (shpLocal && this.adminMode != !!(shpLocal && (shpLocal.shpnme.toLowerCase() === this.props.params.shopname.toLowerCase()))) {
            this.adminMode = shpLocal && (shpLocal.shpnme.toLowerCase() === this.props.params.shopname.toLowerCase());
            this.updateList();
        }

    }

    rendListProduct() {
        const listp = this.state.product.map((p, i) => {
            if (p) {
                const desc = p.desc.length > 100 ? p.desc.substring(0, 100) : p.desc;
                const showAds = () => {
                    if (p.id_connect) {
                        browserHistory.push('/manageProd?id=' + p.id_connect);
                        return;
                    }
                    browserHistory.push('/productid?_id=' + p._id);
                }
                const imgRend = () => {
                    const src = p.img.length === 0 ? "/img/default.jpg" : "/img/adImg/" + p.img[0];

                    return {
                        backgroundImage: 'url(' + src + ')',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        height: '120px'
                    }
                }
                const brd = p.gender == 1 ? '0, 0, 0, 0.498039' : p.gender == 2 ? '39, 132, 219, 0.498039' : '221, 18, 123, 0.498039';
                const stl = {
                    border: '1px solid rgba(' + brd + ')',
                    paddingBottom: '4px'
                }

                const categ = [null, "Clothes", "Shoes", "Childcare", "Child furnitures", "Toys", "Outdoor", "Other"];
                const deleteArt = () => {
                    if (!p.id_connect) return;
                    store.dispatch(store.dispatchArticle('DELETE_ARTICLE', {
                        id_connect: p.id_connect,
                        _id: p._id
                    }));
                }
                const adminMenu = () => {
                    if (p.id_connect) {
                        return (
                            <div className="col-md-2">
                                <br />
                                <RaisedButton
                                    label="delete"
                                    backgroundColor="#dd127b"
                                    labelStyle={{ color: 'white', width: '100%' }}
                                    onClick={(e) => { deleteArt() } }
                                    style={{ marginRight: '10px' }}
                                    fullWidth={true}
                                    >
                                </RaisedButton>
                                <br /><br />
                                <RaisedButton
                                    label="edit / See details"
                                    backgroundColor="#00BCD4"
                                    labelStyle={{ color: 'white', width: '100%' }}
                                    onClick={(e) => { showAds() } }
                                    fullWidth={true}
                                    >
                                </RaisedButton>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className="col-md-2">
                                <br />
                                <RaisedButton
                                    label="See details"
                                    backgroundColor="#00BCD4"
                                    labelStyle={{ color: 'white', width: '100%' }}
                                    onClick={(e) => { showAds() } }
                                    style={{ marginRight: '10px' }}
                                    fullWidth={true}
                                    >
                                </RaisedButton>
                            </div>
                        )
                    }
                }
                return (
                    <div className="col-md-12" key={i}>
                        <div className="row bg-gray-dark" style={stl}>
                            <div className="col-md-2" style={imgRend()}></div>
                            <div className="col-md-2">
                                <h5>Title:</h5>
                                {p.name}
                            </div>
                            <div className="col-md-2">
                                <h5>Category:</h5>
                                {categ[p.cat]}
                            </div>
                            <div className="col-md-2">
                                <h5>Description:</h5>
                                {desc}...
                            </div>
                            <div className="col-md-2">
                                <h5>Price:</h5>
                                ${p.price}
                            </div>
                            {adminMenu()}
                        </div>
                    </div>
                )
            }
        })
        return (
            <div className="row">
                {listp}
            </div>
        )
    }

    selectGender() {
        const that = this;
        const handleChangeS = (event, index, value) => {
            if (value === this.state.gendValue) return;
            this.setState({ gendValue: value });
            setTimeout(function () { that.updateList({ gendValue: value }) }, 10);
        }
        return (
            <SelectField
                floatingLabelText="Gender"
                value={this.state.gendValue}
                onChange={handleChangeS}
                >
                <MenuItem value={1} primaryText="Unisex" />
                <MenuItem value={2} primaryText="Boy" />
                <MenuItem value={3} primaryText="Girl" />
            </SelectField>
        )
    }

    selectCategory() {
        const that = this;
        const handleChangeS = (event, index, value) => {
            if (value === this.state.catValue) return;
            this.setState({ catValue: value });
            setTimeout(function () { that.updateList({ catValue: value }) }, 10);
        }
        return (
            <SelectField
                floatingLabelText="Category"
                value={this.state.catValue}
                onChange={handleChangeS}
                >
                <MenuItem value={0} primaryText="All" />
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

    checkExistName(value) {
        const that = this;
        $.ajax({
            url: 'http://192.168.2.8:8080/api/addUsr',
            data: { type: 'GET_SHOP_NAME', shopName: value },
            type: 'GET',
            success: function (data) {
                that.setState({
                    shop_error_text: data.shopName ? 'This name already exists' : ''
                });
            }
        });
    }

    rendDesc() {
        const editMd = () => {
            this.setState({
                editMode: !this.state.editMode
            })
        }

        const checkShopName = (e) => {
            this.setState({ 
                shopName: e.target.value,
                shop_error_text: ''
             });
            
            if (e.target.value !== this.props.params.shopname) {
                this.checkExistName(e.target.value);
            }

        }

        const saveEdit = () => {
            const descName = {
                shopName: this.props.params.shopname,
                desc: this.refs.shopDesc.value,
                nShpNme: this.refs.shopNm.getValue(),
                credential: store.getState().user.credential
            }
            store.dispatch(store.dispatchArticle('UPDATE_SHOP_DATA', descName));
            this.setState({
                editMode: !this.state.editMode
            })
            if (this.props.params.shopname !== descName.nShpNme) {
                setTimeout(function () { window.location = '/myshop/' + descName.nShpNme }, 1000);
            }
        }

        if (!this.adminMode) {
            return (
                <div className="descShop">
                    {this.state.desc}
                </div>
            )
        }
        else if (this.state.editMode) {
            const styleName = {
                height: '30px',
                border: '1px solid rgba(0,0,0,0.1)'
            }
            const disableSave = !!this.state.shop_error_text;
            return (
                <div className="descShop descShop-edit text-left">
                    <h5>Description:</h5>
                    <textarea className="opTxtdesc" placeholder="Enter a description about your shop" ref='shopDesc' defaultValue={this.state.desc} />
                    <br />
                    <TextField
                        hintText="Enter a shop name"
                        floatingLabelText="Shop name:"
                        errorText={this.state.shop_error_text}
                        onChange={e => checkShopName(e)}
                        value={this.state.shopName}
                        ref='shopNm'
                        />
                    <hr />
                    <RaisedButton
                        label="Cancel"
                        backgroundColor="#dd127b"
                        labelStyle={{ color: 'white', width: '100%' }}
                        onClick={(e) => { editMd() } }
                        style={{ marginRight: '10px' }}
                        >
                    </RaisedButton>
                    <RaisedButton
                        label="Save"
                        disabled = {disableSave}
                        backgroundColor="#00BCD4"
                        labelStyle={{ color: 'white', width: '100%' }}
                        onClick={(e) => { saveEdit() } }
                        >
                    </RaisedButton>
                </div>
            )
        }
        else {
            return (
                <div className="descShop text-left">
                    <h5>Description:</h5>
                    {this.state.desc}
                    <br />
                    <h5>Shop name: </h5>
                    {this.props.params.shopname}
                    <hr />
                    <RaisedButton
                        label="Edit"
                        backgroundColor="#00BCD4"
                        labelPosition="before"
                        labelStyle={{ color: 'white', width: '100%' }}
                        onClick={(e) => { editMd() } }
                        >
                    </RaisedButton>
                </div>
            )
        }
    }

    render() {
        const titlePage = this.adminMode ? 'Welcome in your Shop' : 'Welcome in my Shop';

        return (
            <div className="eachDiv">
                <div className="row bg-gray-dark">
                    <div className="col-md-12 text-center">
                        <h4 className="titleShop text-center">
                            <img src={this.state.avt} className="imgWelc" />
                            <span className="welcTitle text-left">{titlePage}</span>
                        </h4>
                        {this.rendDesc()}
                        <hr />
                    </div>
                    <div className="col-md-3 col-fixed" style={{ paddingTop: '20px', width: 'auto' }}>
                        <h4 className="text-center">Filter:</h4>
                    </div>
                    <div className="col-md-3 col-fixed">
                        {this.selectCategory()}
                    </div>
                    <div className="col-md-3 col-fixed">
                        {this.selectGender()}
                    </div>
                </div>

                {this.rendListProduct()}
            </div>
        )
    }
}

export default myshop;