import {updateObject, updateItemInArray} from './dispatchObj';

import * as post from './post';

const addArticleSuccess = (state, prev) => {
    var newPostState = { posts: [], error: null, loading: false, db: true};
    
    const newProductList = [...state.product,{ 
        id: prev.id, 
        name: prev.name, 
        price: prev.price, 
        desc: prev.desc, 
        brand: prev.brand, 
        qty: prev.qty, 
        img: prev.img 
    }];
    const ob = updateObject(state, {post_state: newPostState, product: newProductList});
    console.log('ob',ob);
    return ob;
};

const addArticle = (state, prev) => {
    
    console.log('state.product before',state);
    post.fetchPutArticle(prev);
    return postIsLoading(state, true);
};

const removeArticle = (state, id) => {
    const newProductList = updateItemInArray(state.product, id, item => {
        var newq = item.qty - 1;
        return updateObject(item, {qty : newq});
    });

    return updateObject(state, {product : newProductList});
};

const postIsLoading = (state, db) => {
    if(!db) post.fetchDB();         // Send GET all articles
    return updateObject(state,{post_state:{ posts: [], error: null, loading: true, db: db}});
}

const loadAllArticles = (state, newProductList) => {
    var newPostState = { posts: [], error: null, loading: false, db: true};
    return updateObject(state, {post_state:newPostState, product: newProductList});
}

export {
    addArticle,
    addArticleSuccess,
    removeArticle,
    postIsLoading,
    loadAllArticles
};