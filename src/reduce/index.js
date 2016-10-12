let defaultProduct = [
    { id: 0, name: 'Tshirt Boy - 5year', price: 20, desc: 'T-shirt blue for a boy', brand: 'Catimin', qty: 1, img: 'img/boyshirt.jpg' },
    { id: 1, name: 'Tshirt Girl - 4year', price: 30, desc: 'T-shirt yellow for a girl', brand: 'Cater', qty: 3, img: 'img/girlshirt.jpg' }
]

const articleState = (state = defaultProduct, action) => {
    switch (action.type) {
        case 'ADD_ARTICLE':
            return [
                ...state,
                { 
                    id: action.id, 
                    name: action.name, 
                    price: action.price, 
                    desc: action.desc, 
                    brand: action.brand, 
                    qty: action.qty, 
                    img: action.img 
                }
            ]
        case 'REMOVE_ARTICLE':
            return state.filter((a) => a.id !== action.id);

        default:
            return state
    }
}
export default articleState;