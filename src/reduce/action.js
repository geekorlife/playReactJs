import {updateObject, updateItemInArray} from './dispatchObj';

import * as post from './post';

const addArticleSuccess = (state, prev) => {
    var newPostState = { 
        posts: [], 
        error: null, 
        loading: false, 
        db: true, 
        createdAdId: prev._id, 
        id_connect:prev.id_connect
    };
    console.log('prev',prev);
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

    const ob = updateObject(state, {post_state: newPostState});
    console.log('ob',ob);
    return ob;
};

const addArticle = (state, prev) => {
    post.fetchPutArticle(prev);
    return postIsLoading(state, true);
};

const updateArticle = (state, prev) => {
    console.log('prev',prev);
    post.updateArticle(prev);
    return postIsLoading(state, true);
}

const addQA = (state, prev) => {
    post.fetchPutQAArticle(prev);
    return postIsLoading(state, true);
};

const addQASuccess = (state, prev) => {
    console.log('ADD QA SUCCES',prev);
    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: [prev], count:0});
};

const addQAP = (state, prev) => {
    post.fetchPutQAPArticle(prev);
    return postIsLoading(state, true);
};

const addQAPSuccess = (state, prev) => {
    console.log('ADD QA SUCCES',prev);
    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
    return updateObject(state, {post_state:newPostState});
};

const addUser = (state, prev) => {
    console.log('ADD USER');
    post.fetchPushUser(prev);
    return postIsLoading(state, true);
}

const addUsrSuccess = (state, prev) => {
    console.log('ADD USR SUCCESS',prev);
    return setLocalUsr(state, prev);
};

const getArticle = (state, formPage) => {
    console.log('GET PAGE ARTICLE',formPage);
    post.fetchOneArticle(formPage);
    return postIsLoading(state, true);
}

const getArticleAdmin = (state, formPage) => {
    console.log('GET PAGE ARTICLE',formPage);
    post.fetchOneArticle(formPage);
    return postIsLoading(state, true);
}

const getPageArticle = (state, formPage) => {
    post.fetchPageArticle(formPage);
    return postIsLoading(state, true);
}

const getPageArticleSuccess = (state, newProductList) => {
    console.log('newProductList COUNT', newProductList);
    var newPostState = { posts: [], error: null, loading: false, db: true, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: newProductList[0].article, count:newProductList[0].length});
}

const resetPageArticle = (state) => {
    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
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
        post.fetchDB(); 
    }        
    return updateObject(state,{post_state:{ posts: [], error: null, loading: true, db: db, createdAdId: null}});
}

const addArticleDB = (state, newProductList) => {
    var prodt = state.product.concat(newProductList.article);
    console.log('prodt',prodt);
    if(prodt.length == 0 || prodt[0] == undefined){
        console.log('NO ARTICLE EXIST');
        var newPostState = { posts: [], error: null, loading: false, db: true};
        return updateObject(state, {post_state:newPostState, product: ['no_exist'], count:newProductList.length, createdAdId: null});
    }

    // Avoid duplicate entry in the store
    var product = prodt.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj._id).indexOf(obj._id) === pos;
    });
    
    var newPostState = { posts: [], error: null, loading: false, db: true};
    
    return updateObject(state, {post_state:newPostState, product: product, count:newProductList.length, createdAdId: null});
}

const deleteArticle = (state, prev) => {
    console.log('prev',prev);
    post.deleteArticle(prev);
    return postIsLoading(state, true);
}

const deleteSuccess = (state, prev) => {
    console.log('prev',prev);
    return postIsLoading(state, false);
}

const loadAllArticles = (state, newProductList) => {
    var newPostState = { posts: [], error: null, loading: false, db: true, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: newProductList});
}

const setLocalZip = (state, zip) => {
    localStorage.setItem("zipData", JSON.stringify(zip));
    return updateObject(state, {zip: {code: zip.code, dist: zip.dist} });
}

const setLocalUsr = (state, data) => {
    const localData = {
        id_shop:data.id_shop, 
        credential: data.credential,
        shpnme: data.shpnme,
        email: data.email
    };
    localStorage.setItem("usrData", JSON.stringify(localData));

    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
    return updateObject(state, {user: localData }, {post_state:newPostState});
}

const logUsr = (state, data) => {
    console.log('data log', data);
    post.fetchUsrLogin({l: data.email, p:data.pass});
    return postIsLoading(state, true);
}

const logUsrSuccess = (state, data) => {
     console.log('data log success', data);
    const newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};

    if(!data.message || data.message =='error_usr' || !data.id_shop) {
        resetUsrkey();
        return updateObject(state, {user: {id_shop: null, credential: null}}, {post_state:newPostState});
    }
    else {
        return setLocalUsr(state, data);
    }
}

const getUsrData = (state) => {
    const localUsr = localStorage.getItem("usrData");

    if(localUsr) {
        post.fetchUsrLogin(JSON.parse(localUsr));
        const nst = postIsLoading(state, true);
        return nst;
    }
    return state;
}

const getUsrSuccess = (state, data) => {

    console.log('getUsrSuccess',data);
    const newPostState = { posts: [], error: 'zut', loading: false, db: false, createdAdId: null};
    
    console.log('message',data.message);
    switch(data.message){
        case 'usr_exist':
            if(data.timeout) {
                resetUsrkey();
                return updateObject(state, {user: {id_shop: null, credential: null, email: null}}, {post_state:newPostState});
            }
            const user = JSON.parse(localStorage.getItem("usrData"));
            return Object.assign(state, {post_state:newPostState}, {user});
        case 'error_usr':
            resetUsrkey();
            return updateObject(state, {user: {id_shop: null, credential: null, email: null}}, {post_state:newPostState});
        default:
            return updateObject(state, {user: {id_shop: null, credential: null, email: null}}, {post_state:newPostState});
    }
}

const getLocalZip = (state) => {
    const zip = localStorage.getItem("zipData");
    let nState = null;
    if(!zip) {
        nState = updateObject(state, {zip: null });
    }
    else {
        var newPostState = { posts: [], error: null, loading: true, db: true, createdAdId: null};
        nState = updateObject(state, {zip: JSON.parse(zip) });
    }
    console.log('nState',nState);
    return getUsrData(nState);
}

const resetUsrkey = () => {
    if(localStorage.getItem("usrData"))
        localStorage.removeItem("usrData"); // Reset localsotrage key usrData
}

const duplicateKey = (state, data) => {
    return updateObject(state,{post_state:{ posts: [], error: data, loading: false, db: null, createdAdId: null}});
}

export {
    addArticle,
    addArticleSuccess,
    removeArticle,
    postIsLoading,
    loadAllArticles,
    addArticleDB,
    getPageArticle,
    getPageArticleSuccess,
    resetPageArticle,
    getArticle,
    addQA,
    addQASuccess,
    addQAP,
    addQAPSuccess,
    getArticleAdmin,
    updateArticle,
    getLocalZip,
    setLocalZip,
    deleteArticle,
    deleteSuccess,
    addUser,
    addUsrSuccess,
    getUsrSuccess,
    getUsrData,
    logUsrSuccess,
    logUsr,
    duplicateKey
};