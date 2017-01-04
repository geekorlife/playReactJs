import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
		byteString = atob(dataURI.split(',')[1]);
	}   
    else {
		byteString = unescape(dataURI.split(',')[1]);
	}
        
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

class ImageUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			img: [],
			loadingImg: false,
			currentRotate : 0,
			originW: 300,
			originH: 300,
			ctx: null,
			ratio: null
		};
		this._handleImageChange = this._handleImageChange.bind(this);
		this.upload = this.upload.bind(this);
		this.rotateCanvas = this.rotateCanvas.bind(this);
		this.formDt = null;

		this.canvas = null;
		this.currentRotate = 0;
		this.currentImage = null;
	}

	hadImg(f, im) {
		return { file: f, imagePreviewUrl: im };
	}

	clearWhitePreview(ctx, w, h){
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, w, h);
	}

	_handleImageChange(e) {
		e.preventDefault();
		const that = this;
		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onload = (event) => {
			that.currentImage = new Image();
			let wImg, hImg = 300;
			that.currentImage.onload = function(){ 	
				wImg = 300 * that.currentImage.width / that.currentImage.height;
				that.canvas.width = wImg;
				that.canvas.height = 300;
				let ratio =  wImg / 300;

				if(window.innerWidth < 750) {
					that.canvas.style.width = '100%';
					let maxWidth = that.canvas.offsetWidth;

					if(that.canvas.width > that.canvas.height) {
						that.canvas.style.height = (maxWidth / ratio) + 'px' ;
					}
					else {
						that.canvas.style.height = maxWidth + 'px';
						that.canvas.style.width = (maxWidth * ratio) + 'px';
					}
				}

				that.setState({
					originW : wImg,
					currentRotate: 0,
					ratio: ratio 
				});

				that.clearWhitePreview(that.state.context, wImg, hImg);
				that.state.context.drawImage(that.currentImage,0,0,wImg,hImg);

				setTimeout(function() {
					console.log('SEND ROTATE PREVIEW');
					var idimg = that.state.img.length;
					var dataURL = that.canvas.toDataURL('image/jpeg', 0.5);
					var blob = dataURItoBlob(dataURL);
					that.setState({
						img: [...that.state.img, that.hadImg(blob, dataURL)]
					});
					that.props.addImg(file);
				}, 10);
			}
			that.currentImage.src = reader.result;
		}

		reader.onloadend = (event) => {
			
		}

		reader.readAsDataURL(file)
	}

	upload() {
		if(this.state.img.length == 0) {
			this.props.noUploadFile();
			return;
		}
		let that = this;
		this.formDt = new FormData();

		this.state.img.map((img, i) => {
			that.formDt.append("imgAd" + i, img.file, i+'.jpeg');
		})
		
		this.props.uploadFile(this.formDt);
		return true;
	}

	rotateCanvas(rot){
		let rotate = rot || 0;
		let ctx = this.state.context;
		this.currentRotate = this.currentRotate + rotate;
		this.currentRotate = this.currentRotate == 360 || this.currentRotate == -360 ? 0 : this.currentRotate;
		
		// Switch size canvas
		if(this.currentRotate == 0 || this.currentRotate == 180 || this.currentRotate == -180) {
			this.canvas.width = this.state.originW;
			this.canvas.height = this.state.originH;
		}
		else {
			this.canvas.width = this.state.originH;
			this.canvas.height = this.state.originW;
			
		}
		if(window.innerWidth < 750) {
			this.canvas.style.width = '100%';
			let maxWidth = this.canvas.offsetWidth;

			if(this.canvas.width > this.canvas.height) {
				if(this.state.originW > this.state.originH) {
					this.canvas.style.height = (maxWidth / this.state.ratio) + 'px' ;
				}
				else {
					this.canvas.style.height = (maxWidth * this.state.ratio) + 'px' ;
				}	
			}
			else {
				this.canvas.style.height = maxWidth + 'px';
				if(this.state.originH > this.state.originW) {
					this.canvas.style.width = (maxWidth * this.state.ratio) + 'px';
				}	
				else {
					this.canvas.style.width = (maxWidth / this.state.ratio) + 'px';
				}
				
			}
		}
		
		ctx.save();

  		ctx.translate(this.canvas.width/2, this.canvas.height/2);
		ctx.rotate(this.currentRotate * Math.PI / 180);
		
		this.clearWhitePreview(ctx, this.state.originW, this.state.originH);
		ctx.drawImage(this.currentImage, -(this.state.originW/2),  -(this.state.originH/2), this.state.originW, this.state.originH);

		ctx.restore();

		var dataURL = this.canvas.toDataURL('image/jpeg', 0.5);
		var blob = dataURItoBlob(dataURL);
		let newStateImg = this.state.img;
		newStateImg.pop();

		newStateImg.push({
			file: blob,
			imagePreviewUrl: dataURL
		})

		this.setState({currentRotate: this.currentRotate});
  	}

	componentDidMount(){
		this.canvas = document.getElementById("canvas");
		this.canvas.width = this.canvas.height = 300;

		if(window.innerWidth < 750) {
			this.canvas.style.width = '100%';
			this.canvas.style.height = this.canvas.offsetWidth+'px';
		}
		const context = canvas.getContext("2d");
		this.setState({ context: context });

		let imgDefault = this.currentImage = new Image(), that = this;
		imgDefault.src = '/img/default.jpg';
		imgDefault.onload = () => { 
			that.canvas.width = 300;
			that.canvas.height = 300;
			
			that.clearWhitePreview(context, 300, 300);
			context.drawImage(imgDefault,0,0,300,300);
		}
		console.log('COMPO DID MOUNT');
	}

	imgAddedRend() {
		let im = this.state.img.map( (m, i) => {
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
		
		let imgprev = this.imgAddedRend();

		let inlineStyle = { display: 'none' };
		let showRotate = () => {
			if(this.state.img.length > 0) {
				return (
					<div>
						<FlatButton
							label="Rotate -90°"
							backgroundColor="#00BCD4"
							style={{marginRight:'3px'}}
							labelStyle={{ color: 'white',float: 'right' }}
							onClick={(e) => {this.rotateCanvas(-90)}}
						/>
						<FlatButton
							label="Rotate +90°"
							backgroundColor="#00BCD4"
							style={{marginLeft:'3px'}}
							labelStyle={{ color: 'white',float: 'right' }}
							onClick={(e) => {this.rotateCanvas(90)}}
						/>
					</div>
				)
			}
		}
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
			<div className="col-md-12 text-center">
				<FlatButton
					label="Add an Image"
					backgroundColor="#DD127B"
					labelPosition="before"
					labelStyle={{ color: 'white', width: '100%' }}
					onChange={this._handleImageChange}
				>
					<input type="file" style={styles.addbutt} />
				</FlatButton>
				<br/>
				<canvas className="imgPreview" id="canvas"></canvas>
				<br/>
				{showRotate()}
			</div>
			<div className="col-md-12">
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