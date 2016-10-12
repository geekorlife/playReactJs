let defaultProduct = [
    { id: 0, name: 'Tshirt Boy - 5year', price: 20, desc: 'T-shirt blue for a boy', brand: 'Catimin', qty: 1, img: 'img/boyshirt.jpg' },
    { id: 1, name: 'Tshirt Girl - 4year', price: 30, desc: 'T-shirt yellow for a girl', brand: 'Cater', qty: 3, img: 'img/girlshirt.jpg' }
]

function addArticle(state, prev){
    return [
                ...state,
                { 
                    id: prev.id, 
                    name: prev.name, 
                    price: prev.price, 
                    desc: prev.desc, 
                    brand: prev.brand, 
                    qty: prev.qty, 
                    img: prev.img 
                }
            ]
}

function removeArticle(state, id){
    return state.map((a) => {
                if(a.id == id) {
                    a.qty--;
                }
                return a;
            })
}

const articleState = (state = defaultProduct, action) => {
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