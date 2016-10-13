import React from 'react';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: '', texte:'gg'};
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
        console.log(this.props)
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
      this.props.addImg(reader.result);
    }

    reader.readAsDataURL(file)
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    let textPreview = "No image selected...";
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
      textPreview = "Click to change the image...";
    } else {
      $imagePreview = (<img src='img/default.jpg' />);
    }
    var inlineStyle = {display: 'none'};
    return (
      <div className="previewImg">

        <div className="input-group">
            <label className="input-group-btn">
                <span className="btn btn-primary fileInput" onChange={this._handleImageChange}>
                    Chooses an image... <input type="file" style={inlineStyle} multiple/>
                </span>
            </label>
        </div>

        <div className="imgPreview">
          {$imagePreview}
        </div>
      </div>
    )
  }
}

export default ImageUpload;