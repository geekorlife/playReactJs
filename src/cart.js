var React = require('react');

module.exports = React.createClass({
    submit: function(e) {
        e.preventDefault();
    },
    curCart: function(){
        var cart;
        if(this.props.cart && this.props.cart.length > 0){
            cart = (
                <div id="curCart">
                    {this.props.cart.length}
                </div>
            )
        }
        return cart;
    },
    dataCart: function(){
        var dt, that = this;
        var checkOut = (
                <li>
                    <button className="btn btn-primary cartButton checkout">Checkout</button>
                    <button className="btn btn-primary cartButton cancel">Cancel</button>
                </li>
            );
        

        if(this.props.cart && this.props.cart.length > 0){

            var datac = this.props.cart.map(function(c,i){
                console.log('c',c)
                var product = that.props.product[c.id];
                return (
                    <li key={i}>
                        <table className="tableProduct">
                            <tbody>
                            <tr>
                                <td>
                                    <img src={product.img}/>
                                </td>
                                <td className="cartPname">
                                    {product.name}
                                </td>
                                <td className="cartPprice">
                                    $ {product.price}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <hr/>
                    </li>
                );
            });

            dt = (
                <ul className="dropdown-menu cartMenu">
                  {datac}
                  {checkOut}
                </ul>
            );
        }
        else {

            dt = (
                <ul className="dropdown-menu cartMenu">
                    <li className="alinEmpty">Empty cart...</li>
                    <hr/>
                    {checkOut}
                </ul>
            );
        }
        return dt;
    },
    render: function(){
        console.log('CURRENT CART ',this.props.cart);
        var curct = this.curCart();
        var dtCart = this.dataCart();
        return (
            <li id="myCart">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>
                    &nbsp;<span>My cart</span>
                </a>
                {curct}
                {dtCart}
            </li>
        )
    }
})