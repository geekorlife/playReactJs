import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import reducer from './reducers';

const INITIAL_STATE = {
    post_state : { posts: [], error: null, loading: false, id_connect: null },
    product: [],
    zip: null,
    user: {id_shop: null, credential: null, shpnme: null},
    currentShop: {name: null, avatar: null, desc: null},
    poolRequest : []
};

const finalCreateStore = compose(applyMiddleware(promise),window.devToolsExtension ? window.devToolsExtension() : f => f)(createStore);

const store = finalCreateStore(reducer, INITIAL_STATE);

store.dispatchArticle = (type, ob) => {
    return Object.assign({ type }, ob)
};

export default store;