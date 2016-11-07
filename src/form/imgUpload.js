import React from 'react';
import FlatButton from 'material-ui/FlatButton';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { img: [],loadingImg: false };
    this._handleImageChange = this._handleImageChange.bind(this);
    this.upload = this.upload.bind(this);
    this.formDt = null;
  }

  hadImg(f, im) {
    return { file: f, imagePreviewUrl: im };
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      
      var idimg = this.state.img.length;
      this.setState({
        img: [...this.state.img, this.hadImg(file, reader.result)]
      });
      this.props.addImg(file);
    }

    reader.readAsDataURL(file)
  }

  upload() {
    let that = this;
    this.formDt = new FormData();

    this.state.img.map((img, i) => {
      that.formDt.append("imgAd" + i, img.file);
    })
    
    this.props.uploadFile(this.formDt);
    return true;
  }

  imgAddedRend() {
    let im = this.state.img.map((m, i) => {
      const remImg = () => {
        var id = i;
        var newImg = this.state.img.filter((im, i) => {
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
    let imagePreviewUrl = this.state.img.length > 0 ? this.state.img[this.state.img.length - 1].imagePreviewUrl : null;
    let $imagePreview = null;
    let imgprev = this.imgAddedRend();
    let textPreview = "No image selected...";
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
      textPreview = "Click to change the image...";
    } else {
      $imagePreview = (<img src='/img/default.jpg' />);
    }
    var inlineStyle = { display: 'none' };
    const styles = {
      addbutt:{
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#3ed3Ed',
        opacity: 0
      },
      subButton: {
        float: 'right'
      }
    };
    return (
      <div className="previewImg">
        <div className="row">
          <div className="col-md-4 text-center">
            <FlatButton
              label="Add an Image"
              backgroundColor="#DD127B"
              labelPosition="before"
              labelStyle={{ color: 'white', width: '100%' }}
              onChange={this._handleImageChange}
              >
              <input type="file" style={styles.addbutt} />
            </FlatButton>

            <div className="imgPreview">
              {$imagePreview}
            </div>
          </div>
          <div className="col-md-8">
            <div className="imgAdded">
              {imgprev}
            </div>
          </div>
        </div>

        <FlatButton
          label="Start upload"
          backgroundColor="#00BCD4"
          labelPosition="before"
          style={styles.subButton}
          labelStyle={{ color: 'white',float: 'right' }}
          onClick={this.upload}
          ></FlatButton>
      </div>
    )
  }
}

export default ImageUpload;