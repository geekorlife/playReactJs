let React = require('react');

let RendCol = React.createClass({
    getInitialState: function() {
        return {
            widthTitle: 0,
            widthCol: 0
        };
    },
    componentDidMount: function() {
        this.setState({
            widthTitle: this.refs.child.clientWidth,
            widthcol: this.refs.col.clientWidth
        });
    },
    prtWidth: function(){
        return {width: this.state.widthTitle+'px'};
    },

    colHeight: function(){
        return {height: this.state.widthcol+'px'};
    },
    clickProd: function(){
        var id = this.props.r.id;
        this.props.handleInfo(id);
    },
    addProductInCart: function(){
        addProductInCart(this.props.r.id);
    },
    render: function(){
        return(
            <div className="col-md-6" ref="col" style={this.colHeight()}>
                <div className="product">
                <img src={this.props.r.img} ref="child"/>
                <div className="titleProduct">{this.props.r.name}</div>
                <div className="menuProduct">
                    <span className="priceMenu">${this.props.r.price}</span>
                    <button className="btn btn-primary infobutton cartadd" onClick={this.addProductInCart}>Add to cart <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></button>
                    <button className="btn btn-primary infobutton inf" onClick={this.clickProd}>
                    More informations
                    </button>
                </div>
                </div>
            </div>
        )
    }
})

let ColProducts = React.createClass({
  render: function(){
    let handleInf = this.props.handleInfo;
    let dt = this.props.dataRow.map(function(r, i){
        var rd;
        if(r.qty > 0) rd = <RendCol key={i} r={r} handleInfo={handleInf}/>;
        return rd;
    });
    return <div>{dt}</div>;
  }

});

let addProductInCart;

module.exports = React.createClass({
  chunks: function(arr, size) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Input should be Array');
    }

    if (typeof size !== 'number') {
      throw new TypeError('Size should be a Number');
    }
    let validArray = arr.filter((ar) => {
        return ar.qty > 0;
    })

    let result = [];
    for (let i = 0; i < validArray.length; i += size) {
      result.push(validArray.slice(i, size + i));
    }
    return result;
  },
  render: function (){
    addProductInCart = this.props.addProductInCart;
    let rows = this.chunks(this.props.produit, 2);
    console.log('ROWS',rows);
    let handleInf = this.props.handleInfo;
    let c = rows.map(function(row, i){
        console.log('COL',row);
      return (
        <div className="row" key={i}>
          <ColProducts key={i} dataRow={row} handleInfo={handleInf}/>
        </div>
      )
    })
    
    return <div className="eachDiv">{c}</div>;
  }
});