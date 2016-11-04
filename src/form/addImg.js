import React from 'react';
import ImgUpload from './imgUpload';

class addImg extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            img: []
        };
        this.addImge = this.addImge.bind(this);
    }

    addImge(img) {
        this.setState({ img: [...this.state.img,img] });
    }

    render(){
        
        return(
            <div className="row">
                <ImgUpload addImg={this.addImge} uploadFile={this.props.uploadFile}/>
            </div>
        )
    }
}

export default addImg;