import {updateObject, updateItemInArray} from './dispatchObj';

const INITIAL_STATE = {
    post_state : { posts: [], error: null, loading: false },
    product: [
        { id: 0, name: 'Tshirt Boy - 5year', price: 20, desc: 'T-shirt blue for a boy', brand: 'Catimin', qty: 1, img: 'img/boyshirt.jpg' },
        { id: 1, name: 'Tshirt Girl - 4year', price: 30, desc: 'T-shirt yellow for a girl', brand: 'Cater', qty: 3, img: 'img/girlshirt.jpg' },
        { id: 2, name: 'Tshirt Boy - 5year', price: 20, desc: 'T-shirt blue for a boy', brand: 'Catimin', qty: 1, img: 'img/boyshirt.jpg' },
        { id: 3, name: 'Tshirt Boy - 5year', price: 20, desc: 'T-shirt blue for a boy', brand: 'Catimin', qty: 1, img: 'img/boyshirt.jpg' }
    ]
};

function addArticle(state, prev){
    const newProductList = [...state.product,{ 
        id: prev.id, 
        name: prev.name, 
        price: prev.price, 
        desc: prev.desc, 
        brand: prev.brand, 
        qty: prev.qty, 
        img: prev.img 
    }];

    return updateObject(state, {product : newProductList});
}

function removeArticle(state, id){
    const newProductList = updateItemInArray(state.product, id, item => {
        var newq = item.qty - 1;
        return updateObject(item, {qty : newq});
    });

    return updateObject(state, {product : newProductList});

}

const articleState = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_ARTICLE':
            return  addArticle(state,action);
        case 'REMOVE_ARTICLE':
            return removeArticle(state,action.id);
        case 'INIT_ARTICLE':
            return state;
        default:
            return state;
    }
}

export default articleState;