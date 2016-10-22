import {updateObject, updateItemInArray} from './dispatchObj';

import * as post from './post';

const addArticleSuccess = (state, prev) => {
    var newPostState = { posts: [], error: null, loading: false, db: true};
    
    const newProductList = [{ 
        id: prev.id, 
        name: prev.name, 
        price: prev.price, 
        desc: prev.desc, 
        brand: prev.brand, 
        qty: prev.qty, 
        img: prev.img 
    }].concat(state.product);
    console.log('newProductList',newProductList);
    const ob = updateObject(state, {post_state: newPostState, product: newProductList});
    console.log('ob',ob);
    return ob;
};

const addArticle = (state, prev) => {
    console.log('state.product before',state.product);
    post.fetchPutArticle(prev);
    return postIsLoading(state, true);
};

const getPageArticle = (state, formPage) => {
    console.log('GET PAGE ARTICLE',formPage);
    post.fetchPageArticle(formPage);
    const st = Object.assign({},state,{product:[]},{count:0});
    return postIsLoading(state, true);
}

const getPageArticleSuccess = (state, newProductList) => {
    console.log('newProductList COUNT', newProductList);
    var newPostState = { posts: [], error: null, loading: false, db: true};
    return updateObject(state, {post_state:newPostState, product: newProductList[0].article, count:newProductList[0].length});
}

const resetPageArticle = (state) => {
    var newPostState = { posts: [], error: null, loading: true, db: true};
    return updateObject(state, {post_state:newPostState, product: [], count:0});
}

const removeArticle = (state, id) => {
    const newProductList = updateItemInArray(state.product, id, item => {
        var newq = item.qty - 1;
        return updateObject(item, {qty : newq});
    });

    return updateObject(state, {product : newProductList});
};

const postIsLoading = (state, db) => {
    if(!db) {
        console.log('GET ALL DB FROM INIT STATE');
        post.fetchDB(); 
    }        // Send GET all articles
    return updateObject(state,{post_state:{ posts: [], error: null, loading: true, db: db}});
}

const addArticleDB = (state, newProductList) => {
    var product = state.product.concat(newProductList.article);

    var newPostState = { posts: [], error: null, loading: false, db: true};
    return updateObject(state, {post_state:newPostState, product: product, count:newProductList.length});
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
    loadAllArticles,
    addArticleDB,
    getPageArticle,
    getPageArticleSuccess
};