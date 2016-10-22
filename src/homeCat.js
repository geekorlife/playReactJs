import React from 'react';
import ProductList from './productList';
import {Link} from 'react-router';
import {hashHistory} from 'react-router';

class homeCat extends React.Component {
    constructor(props) {
        super(props);

        this.category = [
            [
                {n:'Clothes',id:1, img:'img/categories/clothes-cat.jpg'},
                {n:'Shoes',id:2, img:'img/categories/shoes-cat.jpeg'},
                {n:'Childcare',id:3, img:'img/categories/childcare-cat.jpeg'}
            ],
            [
                {n:'Child furnitures',id:4, img:'img/categories/furniture-cat.jpeg'},
                {n:'Toys',id:5, img:'img/categories/toys-cat.jpg'},
                {n:'Outdoor',id:6, img:'img/categories/outdoor-cat.jpeg'}
            ],
            [
                {n:'Others',id:7, img:'img/categories/other-cat.jpg'}
            ]
        ];

        this.state = {
            catChoosed: null
        };

        this.listProductHome = this.listProductHome.bind(this);
        this.rendCategory = this.rendCategory.bind(this);
        this.mainRender = this.mainRender.bind(this);

        this.contextType =  {
            router: React.PropTypes.object.isRequired
        }
    }


    

    listProductHome(paramQuery){
        const catId = this.state.catChoosed;
        
        return (
            <ProductList handleInfo={this.props.handleInfo} catId={paramQuery.id} addProductInCart={this.props.addProductInCart} />
        )
    }

    rendCategory() {
        let ln = this.category.map((l,i) => {
            const lineInside = l.map((li,ii) => {

                const chooseCat = () => {
                    this.setState({"catChoosed": li.id});
                    this.contextType.router.push('#/productlist?id='+li.id);

                }
                const lk = 'productlist?id='+li.id;
                const stl = {
                    position: 'absolute',
                    color: '#fff',
                    marginLeft: '1em',
                    fontWeight: '100',
                    letterSpacing: '0.04em',
                    textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
                }
                return (
                    <div key={ii} className="col-sm-4">
                        <Link to={lk}>
                        <div className="bg-gray-dark main-category">
                            <h3 style={stl} >{li.n}</h3>
                            <img src={li.img} alt={li.n} className="img-responsive img-thumb"/>
                        </div>
                        </Link>
                    </div>
                )
            })

            return (
                <div key={i} className="row text-center">
                    {lineInside}
                </div>
            )
        })
        return (
            <div>
            {ln}
            </div>
        )
    }

    mainRender(paramQuery){
        if(this.props.location && this.props.location.query && this.props.location.query.id) {

            return (
                <div>
                {this.listProductHome(paramQuery)}
                </div>
            )
        }
        else {
            const stl = {
                marginTop: '100px'
            }
            return (
                <div style={stl}>
                {this.rendCategory()}
                </div>
            )
        }
    }

    render() {
        let paramQuery = this.props.location && this.props.location.query ? this.props.location.query : null;
        return (
            <div>
                {this.mainRender(paramQuery)}
            </div>
        )
        
    }
}

export default homeCat;