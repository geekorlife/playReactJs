let React = require('react');

import ImgUpload from './imgUpload';

module.exports = React.createClass({
  getInitialState: function(){
    return {
      img: ''
    };
  },
  submit: function(e) {
    e.preventDefault();

    let product = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      brand: this.refs.brand.value,
      qty: this.refs.qty.value,
      desc: this.refs.desc.value,
      img: this.state.img
    }

    this.props.handleCreate(product);

    this.refs.name.value = "";
    this.refs.price.value = "";
    this.refs.brand.value = "";
    this.refs.qty.value = "";
    this.refs.desc.value = "";
  },

  addImg: function(img){
      this.setState({img:img});
  },

  render: function(){
    return (
        <div className="eachDiv">
            <h3>Add a new product:</h3>
            <form>
                <ImgUpload addImg={this.addImg}/>
                <div>
                  <div className="inputProd">
                    <label>Name:</label><label>Brand:</label><label>Price:</label><label>Quantity:</label><br/>
                    <input type='text' placeholder='Name' ref='name'/>
                    
                    <input type='text' placeholder='Brand' ref='brand'/>
                    
                    <input type='text' placeholder='Price' ref='price'/>
                    
                    <input type='text' placeholder='Quantity' ref='qty'/>
                  </div>
                  <label>Description:</label><br/>
                  <textarea className="desc" placeholder="Description" ref='desc'/>
                </div>
                <button onClick={this.submit}>Create new product</button>
            </form>
            
        </div>
    )
  }
})