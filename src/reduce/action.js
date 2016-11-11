import {updateObject, updateItemInArray} from './dispatchObj';

import * as post from './post';

const postIsLoading = (state, db) => {
    if(!db) {
        post.fetchDB(); 
    }        
    return updateObject(state,{post_state:{ posts: [], error: null, loading: true, db: db, createdAdId: null}});
}

const poolingRequest = [];

const action = {};

action.addPoolRequest = (meth, action) => {
    poolingRequest.push({nam: meth, data: JSON.stringify(action)});
}

action.getPoolRequest = (meth, action) => {
    return poolingRequest.length > 0 ? poolingRequest[poolingRequest.length-1] : null;
}

action.runPoolRequest = (state) => {
    if(poolingRequest.length === 0) return;
    const lastPool = poolingRequest[poolingRequest.length-1];
    action[lastPool.nam](state, JSON.parse(lastPool.data));
}

action.addArticleSuccess = (state, prev) => {
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

action.addArticle = (state, prev) => {
    post.fetchPutArticle(prev);
    return postIsLoading(state, true);
};

action.updateArticle = (state, prev) => {
    console.log('prev',prev);
    post.updateArticle(prev);
    return postIsLoading(state, true);
}

action.addQA = (state, prev) => {
    post.fetchPutQAArticle(prev);
    return postIsLoading(state, true);
};

action.addQASuccess = (state, prev) => {
    console.log('ADD QA SUCCES',prev);
    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: [prev], count:0});
};

action.addQAP = (state, prev) => {
    post.fetchPutQAPArticle(prev);
    return postIsLoading(state, true);
};

action.addQAPSuccess = (state, prev) => {
    console.log('ADD QA SUCCES',prev);
    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
    return updateObject(state, {post_state:newPostState});
};

action.addUser = (state, prev) => {
    console.log('ADD USER');
    post.fetchPushUser(prev);
    return postIsLoading(state, true);
}

action.addUsrSuccess = (state, prev) => {
    console.log('ADD USR SUCCESS',prev);
    return action.setLocalUsr(state, prev);
};

action.getArticle = (state, formPage) => {
    console.log('GET PAGE ARTICLE',formPage);
    post.fetchOneArticle(formPage);
    return postIsLoading(state, true);
}

action.getArticleAdmin = (state, formPage) => {
    console.log('GET PAGE ARTICLE',formPage);
    post.fetchOneArticle(formPage);
    return postIsLoading(state, true);
}

action.getPageArticle = (state, formPage) => {
    post.fetchPageArticle(formPage);
    return postIsLoading(state, true);
}

action.getPageArticleSuccess = (state, newProductList) => {
    console.log('newProductList COUNT', newProductList);
    var newPostState = { posts: [], error: null, loading: false, db: true, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: newProductList[0].article, count:newProductList[0].length});
}

action.getMyShopArticle = (state, formPage) => {
    post.fetchShopArticle(formPage);
    var newPostState = { posts: [], error: null, loading: true, db: true, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: [], count:0});
}

action.resetPageArticle = (state) => {
    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: [], count:0});
}

action.removeArticle = (state, id) => {
    const newProductList = updateItemInArray(state.product, id, item => {
        var newq = item.qty - 1;
        return updateObject(item, {qty : newq});
    });

    return updateObject(state, {product : newProductList});
};

action.addArticleDB = (state, newProductList) => {
    var prodt = state.product.concat(newProductList.article);
    console.log('prodt',prodt);
    console.log('newProductList',newProductList);
    const currentShop = newProductList.shop ? {name: newProductList.shop.shopName, avatar: newProductList.shop.avatar, desc: newProductList.shop.desc} : {name: null, avatar: null, desc: null};
    
    if(prodt.length == 0 || prodt[0] == undefined){
        console.log('NO ARTICLE EXIST');
        var newPostState = { posts: [], error: null, loading: false, db: true};
        return updateObject(state, {post_state:newPostState, product: ['no_exist'], count:newProductList.length, createdAdId: null, currentShop: currentShop});
    }

    // Avoid duplicate entry in the store
    var product = prodt.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj._id).indexOf(obj._id) === pos;
    });
    var newPostState = { posts: [], error: null, loading: false, db: true};
    
    return updateObject(state, {post_state:newPostState, product: product, count:newProductList.length, createdAdId: null, currentShop: currentShop});
}

action.updateShop = (state, prev) => {
    post.updateShop(prev);
    return postIsLoading(state, true);
}

action.updateShopSuccess = (state, newProductList) => {
    // update localStore shpname
    console.log('UPDATE SHOP newProductList',newProductList);
    if(newProductList.newName) {
        const localUsr = JSON.parse(localStorage.getItem("usrData"));
        console.log('localUsr before',localUsr);
        localUsr.shpnme = newProductList.shop.shopName;
        console.log('localUsr after',localUsr);
        localStorage.setItem("usrData", JSON.stringify(localUsr));
    }
    var newPostState = { posts: [], error: null, loading: false, db: true};
    return updateObject(state, {post_state:newPostState, currentShop: newProductList.shop});
}

action.deleteShopArticle = (state, prev) => {
    console.log('prev',prev);
    post.deleteShopArticle(prev);
    return postIsLoading(state, true);
}

action.deleteArticle = (state, prev) => {
    post.deleteArticle(prev);
    return postIsLoading(state, true);
}

action.deleteSuccess = (state, prev) => {
    console.log('prev',prev);
    return postIsLoading(state, false);
}

action.loadAllArticles = (state, newProductList) => {
    var newPostState = { posts: [], error: null, loading: false, db: true, createdAdId: null};
    return updateObject(state, {post_state:newPostState, product: newProductList});
}

action.setLocalZip = (state, zip) => {
    localStorage.setItem("zipData", JSON.stringify(zip));
    return updateObject(state, {zip: {code: zip.code, dist: zip.dist} });
}

action.setLocalUsr = (state, data) => {
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

action.logUsr = (state, data) => {
    console.log('data log', data);
    post.fetchUsrLogin({l: data.email, p:data.pass});
    return postIsLoading(state, true);
}

action.logUsrSuccess = (state, data) => {
     console.log('data log success', data);
    const newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};

    if(!data.message || data.message =='error_usr' || !data.id_shop) {
        action.resetUsrkey();
        return updateObject(state, {user: {id_shop: null, credential: null}}, {post_state:newPostState});
    }
    else {
        return action.setLocalUsr(state, data);
    }
}

action.logOut = (state) => {
    action.resetUsrkey();
    return updateObject(state, {user: {id_shop: null, credential: null, shpnme: null}});
}

action.resetPassMsg = (state) => {
    return updateObject(state, {user: {id_shop: state.user.id_shop, credential: state.user.credential, shpnme: state.user.shpnme}});
}

action.changePass = (state, data) => {
    console.log('data action',data);
    post.fetchChangePass({credential: data.data.credential, oldPass: data.data.oldPass, newPass:data.data.newPass});
    return postIsLoading(state, true);
}

action.changePassSuccess = (state) => {
    var newPostState = { posts: [], error: null, loading: false, db: false, createdAdId: null};
    var user = {id_shop: state.user.id_shop, credential: state.user.credential, shpnme: state.user.shpnme, passUpdated: true};
    return updateObject(state, {post_state: newPostState, user: user});
}

action.getUsrData = (state) => {
    const localUsr = localStorage.getItem("usrData");

    if(localUsr) {
        post.fetchUsrLogin(JSON.parse(localUsr));
        const nst = postIsLoading(state, true);
        return nst;
    }
    return state;
}

action.getUsrSuccess = (state, data) => {

    console.log('getUsrSuccess',data);
    const newPostState = { posts: [], error: 'zut', loading: false, db: false, createdAdId: null};
    
    console.log('message',data.message);
    switch(data.message){
        case 'usr_exist':
            if(data.timeout) {
                action.resetUsrkey();
                return updateObject(state, {user: {id_shop: null, credential: null, email: null}}, {post_state:newPostState});
            }
            const user = JSON.parse(localStorage.getItem("usrData"));
            return Object.assign(state, {post_state:newPostState}, {user});
        case 'error_usr':
            action.resetUsrkey();
            return updateObject(state, {user: {id_shop: null, credential: null, email: null}}, {post_state:newPostState});
        default:
            return updateObject(state, {user: {id_shop: null, credential: null, email: null}}, {post_state:newPostState});
    }
}

action.getLocalZip = (state) => {
    const zip = localStorage.getItem("zipData");
    let nState = null;
    if(!zip) {
        nState = updateObject(state, {zip: null });
    }
    else {
        nState = updateObject(state, {zip: JSON.parse(zip) });
    }
    console.log('nState',nState);
    return action.getUsrData(nState);
}

action.resetUsrkey = () => {
    if(localStorage.getItem("usrData"))
        localStorage.removeItem("usrData"); // Reset localsotrage key usrData
}

action.duplicateKey = (state, data) => {
    return updateObject(state,{post_state:{ posts: [], error: data, loading: false, db: null, createdAdId: null}});
}

export default action;