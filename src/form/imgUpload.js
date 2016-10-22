import React from 'react';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { img: []};
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  hadImg(f,im){
    return {file: f, imagePreviewUrl: im};
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      console.log(reader);
      this.setState({
        img: [...this.state.img,this.hadImg(file,reader.result)]
      });
      this.props.addImg(reader.result);
    }

    reader.readAsDataURL(file)
  }

  imgAddedRend(){
    let im = this.state.img.map((m, i) => {
      const remImg = () => {
        var id = i;
        var newImg = this.state.img.filter((im,i) => {
          return i !== id;
        })
        this.setState({
          img: newImg
        });
      }
      const imgSrc = m.imagePreviewUrl;
     
      var divStyle = {
        backgroundImage: 'url(' + imgSrc + ')'
      };
      return (
        <div key={i} className="imgPrevAdded" style={divStyle} onClick={remImg}>
          <div className="hiddenRem"></div>
        </div>
      )
    })
    return im;
  }

  render() {
    let imagePreviewUrl = this.state.img.length > 0 ? this.state.img[this.state.img.length-1].imagePreviewUrl : null;
    let $imagePreview = null;
    let imgprev = this.imgAddedRend();
    let textPreview = "No image selected...";
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
      textPreview = "Click to change the image...";
    } else {
      $imagePreview = (<img src='img/default.jpg' />);
    }
    var inlineStyle = { display: 'none' };
    return (
      <div className="previewImg">

        <div className="input-group">
          <label className="input-group-btn">
            <span className="btn btn-primary fileInput" onChange={this._handleImageChange}>
              Add an image... <input type="file" style={inlineStyle} multiple />
            </span>
          </label>
        </div>

        <div className="imgPreview">
          {$imagePreview}
        </div>
        <div className="imgAdded">
          {imgprev}
        </div>
      </div>
    )
  }
}

export default ImageUpload;