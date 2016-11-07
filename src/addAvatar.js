import React from 'react';
import FlatButton from 'material-ui/FlatButton';

class avatar extends React.Component {
    constructor() {
        super();
        this._handleImageChange = this._handleImageChange.bind(this);
        this.state = {
            img: null
        }
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            console.log('IMG LOADED');
            this.setState({
                img: { file: file, imagePreviewUrl: reader.result }
            });
        }

        reader.readAsDataURL(file)
    }

    render() {
        const addbutt = {
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#3ed3Ed',
            opacity: 0
        }
        let imagePreviewUrl = this.state.img ? this.state.img.imagePreviewUrl : null;
        let $imagePreview = {
            backgroundImage: 'url("/img/default.jpg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%'
        };
        let textPreview = "No image selected...";
        if (imagePreviewUrl) {
            $imagePreview.backgroundImage = 'url("' + imagePreviewUrl + '")';
            textPreview = "Click to change the image...";
        }
        return (
            <div>
                <FlatButton
                    label="Add an avatar"
                    backgroundColor="#DD127B"
                    labelPosition="before"
                    labelStyle={{ color: 'white', width: '100%' }}
                    onChange={this._handleImageChange}
                    >
                    <input type="file" style={addbutt} />
                </FlatButton>

                <div className="imgPreview" style={$imagePreview}>
                </div>
            </div>
        )
    }
}

export default avatar;