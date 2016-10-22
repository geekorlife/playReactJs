import React from 'react';

import ImgUpload from './imgUpload';

class ProductForm extends React.Component {
  constructor() {
    super();
    this.state = { 
      img: '', 
      readyToSubmit: {
        price: false,
        desc: false
      }
    };

    this.submit = this.submit.bind(this);
    this.addImg = this.addImg.bind(this);
    this.showSubmit = false;
  }

  submit(e) {
    e.preventDefault();
    console.log(this.refs.cat.value);
    let product = {
      cat: Number(this.refs.cat.value),
      gender: Number(this.refs.gender.value),
      name: this.refs.name.value,
      price: this.refs.price.value,
      brand: this.refs.brand.value,
      desc: this.refs.desc.value,
      img: this.state.img
    }

    this.props.handleCreate(product);

    this.refs.name.value = "";
    this.refs.price.value = "";
    this.refs.brand.value = "";
    this.refs.desc.value = "";
    this.setState({ img: '' });
  }

  addImg(img) {
    this.setState({ img: img });
  }

  selectCategory() {
    return (
      <select ref='cat' className="form-control">
        <option value="1">Clothes</option>
        <option value="2">Shoes</option>
        <option value="3">Childcare</option>
        <option value="4">Child furnitures</option>
        <option value="5">Toys</option>
        <option value="6">Outdoor</option>
        <option value="7">Other</option>
      </select>
    )
  }

  selectGender() {
    return (
      <select ref='gender' className="form-control">
        <option value="1">Unisex</option>
        <option value="2">Boy</option>
        <option value="3">Girl</option>
      </select>
    )
  }

  labelRender() {
    var stl = {padding: '0px 5px 0px 5px'};
    return (
      <div>
        <div className="col-md-4" style={stl}>
          <label className="labelRegular" >Name:</label>
          <input type='text' placeholder='Name' ref='name' />
        </div>
        <div className="col-md-4" style={stl}>
          <label className="labelRegular" >Brand:</label>
          <input type='text' placeholder='Brand' ref='brand' />
        </div>
        <div className="col-md-4" style={stl}>
          <label className="labelRegular" >Price:</label>
          <input type='text' placeholder='Price' ref='price' onChange={this.handleChange.bind(this, 'price')}/>
        </div>
      </div>
    )
  }

  handleChange(name, e){
    var nameValue = this.refs.price.value;
    console.log('name',name,' value',nameValue,'  :', !isNaN(this.refs.price.value),parseInt(this.refs.price.value));
    if(name === 'price' && !isNaN(this.refs.price.value) && parseInt(this.refs.price.value) > -1 ) {
      this.setState({
        readyToSubmit: Object.assign(this.state.readyToSubmit,{price: true})
      })
    }
    else {
      
    }
    if(this.state.readyToSubmit.price){
      this.showSubmit = true;
    }
    else {
      this.showSubmit = false;
    }
  }

  subMitRend(){
    return (
      <button onClick={this.submit}>Create new product</button>
    )
  };
  render() {
    let rendSubmit;
    if(this.showSubmit) {
      rendSubmit = this.subMitRend();
    }

    return (
      <div className="eachDiv">
        <form>
          <div className="row">

            <div className="col-md-4">
              <ImgUpload addImg={this.addImg} />
            </div>

            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6">
                  <label>Category:</label>
                  {this.selectCategory()}
                </div>
                <div className="col-md-6">
                  <label>Gender:</label>
                  {this.selectGender()}
                </div>
              </div>
              <div className="row">
                {this.labelRender()}
              </div>
              <div className="row">
                <div className="col-md-12" style={{paddingLeft:'5px'}}>
                  <label>Description:</label>
                  <textarea className="desc" placeholder="Description" ref='desc' />
                </div>
              </div>
            </div>

            {rendSubmit}

          </div>
          
        </form>

      </div>
    )
  }
}

export default ProductForm;