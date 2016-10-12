let defaultProduct = [
    {id:0, name:'Tshirt Boy - 5year', price:20, desc:'T-shirt blue for a boy', brand:'Catimin', qty:1, img:'img/boyshirt.jpg'},
    {id:1, name:'Tshirt Girl - 4year', price:30, desc:'T-shirt yellow for a girl', brand:'Cater', qty:3, img:'img/girlshirt.jpg'}
]

const articleState = (state = defaultProduct, action) => {
    switch (action.type) {
        case 'ADD_ARTICLE':
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case 'REMOVE_ARTICLE':
            if (state.id !== action.id) {
                return state
            }

            return Object.assign({}, state, {
                completed: !state.completed
            })

        default:
            return state
    }
}
export default articleState;