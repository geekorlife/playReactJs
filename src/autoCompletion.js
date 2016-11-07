import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import store from './reduce/store';

class autoCompletion extends React.Component{
    constructor() {
        super();
        this.getZip = this.getZip.bind(this);
        this.handeClick = this.handeClick.bind(this);
        this.state = {
            zip_error: null,
            dataSource: []
        }
    }

    getZip(e) {
        let data = null;
        if(typeof e.preventDefault === 'function') {
            e.preventDefault();
            data = e.target.value;
        }
        else {
            data = e;
        }
        
        const that = this;

        const type = !isNaN(data) ? 'zip' : 'name';

        $.ajax({
            url: 'http://138.68.31.97:8080/api/zipCode',
            data: { type: 'GET_ZIPCODE', zip: {code: data, type:type} },
            type: 'GET',
            success: function (data) {
                if(data.city && Array.isArray(data.city)) {
                    let cityAr = data.city.map((c) => {
                        return c.nm+ ', ' + c.st;
                    });
                    
                    that.setState({
                        zip_error: data.city.length === 0 ? 'Invalid city name' : null,
                        city: cityAr,
                        data: data.city,
                        dataSource: cityAr
                    });
                }
                else  {
                    const dataS = data.city ? [data.city.nm + ', ' + data.city.st] : [];
                    that.setState({
                        zip_error: data.city ? null : 'Invalid zip code',
                        city: data.city ? [data.city.nm + ', ' + data.city.st] : null,
                        data: [data.city],
                        dataSource: dataS
                    });
                }
               
            }
        });
    }

    handeClick(e){
        const dataClick = e.split(',');
        const citySelect = dataClick[0];
        const stateSelect = dataClick[1].split(' ')[1];
        const result = this.state.data.filter((d) => {
            return d.nm == citySelect && d.st == stateSelect;
        })
        this.props.handleZip(result);
    }

    render(){
        const zipCity = this.state.zip_error;
        
        return (
            <AutoComplete
                floatingLabelText="Zip code or City:"
                hintText="Enter a zip code or a City"
                dataSource={this.state.dataSource}
                errorText={zipCity}
                filter={AutoComplete.noFilter}
                onNewRequest={(e) => {this.handeClick(e)}}
                menuStyle= {{marginBottom:'20px'}}
                onUpdateInput={this.getZip.bind(this)}
                searchText={this.props.zipData}
            />
        )
        
    }
}

export default autoCompletion;