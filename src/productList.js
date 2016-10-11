var React = require('react');

var RendCol = React.createClass({
    render: function(){
        return(
            <div className="col-md-6" key={this.props.i}>
                Name:{this.props.r.name} Price:{this.props.r.price}
            </div>
        )
    }
})

var ColProducts = React.createClass({

  render: function(){
      
    var dt = this.props.dataRow.map(function(r, i){
        return <RendCol i={i} r={r}/>
    });
    console.log(dt);
    return <div>{dt}</div>;
  }

});

module.exports = React.createClass({
  chunks: function(arr, size) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Input should be Array');
    }

    if (typeof size !== 'number') {
      throw new TypeError('Size should be a Number');
    }

    var result = [];
    for (var i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, size + i));
    }
    return result;
  },
  render: function (){
    var rows = this.chunks(this.props.produit, 2);
    console.log(rows);
    var c = rows.map(function(row, i){
      return (
        <div className="row" key={i}>
          <ColProducts dataRow={row}/>
        </div>
      )
    })
    console.log(c);
    return <div>{c}</div>;
  }
});