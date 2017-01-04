import axios from 'axios';

import store from './store';

//Post list
export const FETCH_POSTS = 'FETCH_POSTS';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';
export const RESET_POSTS = 'RESET_POSTS';

//Create new post
export const CREATE_POST = 'CREATE_POST';


//Fetch post
export const INIT_ARTICLE = 'INIT_ARTICLE';
export const ADD_ARTICLE_SUCCESS = 'ADD_ARTICLE_SUCCESS';

const ROOT_URL = 'http://138.68.31.97:8080/api';

//Get IP Location
export function tryGetLocation(){
    //Get ip localization thought ip-api.com 
    $.getJSON('//ip-api.com/json?callback=?', function(data) {
        
        if(data && data.status == 'success' && data.zip && data.city && data.region && data.lat && data.lon) {
            const zip = {
                code: {
                    "_id": data.zip,
                    "nm": data.city,
                    "st": data.region,
                    "cty": null,
                    "pos": [data.lat, data.lon]
                },
                dist: 10
            };
                
            store.dispatch(store.dispatchArticle('SET_LOCAL_ZIP', zip));
            
        }
        else {
            store.dispatch(store.dispatchArticle('ASK_LOCAL_ZIP'));
        }
    });    
}


// Get all articles from DB
export function fetchDB() {
    axios.get(`${ROOT_URL}/all`)
    .then(function (response) {
        
        store.dispatch(store.dispatchArticle(INIT_ARTICLE,{state:response.data}));      //   UPDATE STATE AND DOM
    })
    .catch(function (error) {
        console.log(error);
    });

    return {
      type: FETCH_POSTS
    };
}

//Get one Article by _id
export function fetchOneArticle(fromPage){
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
        }
    };
    
    axios.get(`${ROOT_URL}/getOne`, {params: fromPage}, configUpload)
    .then(function (response) {
        console.log('RESPONSE',response.data);
        store.dispatch(store.dispatchArticle('GET_ARTICLE_SUCCESS',{art:response.data}));      //   UPDATE STATE AND DOM
    })
    .catch(function (error) {
        console.log(error);
    });

    return {
      type: CREATE_POST
    };
}

// Get 9 articles by category id 
export function fetchPageArticle(fromPage){
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    
    axios.get(`${ROOT_URL}/page`, {params: fromPage}, configUpload)
    .then(function (response) {
        store.dispatch(store.dispatchArticle('GET_LIST_ARTICLE_SUCCESS',{art:response.data}));      //   UPDATE STATE AND DOM
    })
    .catch(function (error) {
        console.log(error);
    });

    return {
      type: CREATE_POST
    };
}

// Get myShop articles by shop  name 
export function fetchShopArticle(fromPage){
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    console.log('fromPage',fromPage);
    axios.get(`${ROOT_URL}/myShop`, {params: fromPage}, configUpload)
    .then(function (response) {
        console.log('response myShop',response.data);
        store.dispatch(store.dispatchArticle('GET_SHOP_SUCCESS_ARTICLE',{art:response.data}));      //   UPDATE STATE AND DOM
    })
    .catch(function (error) {
        console.log(error);
    });

    return {
      type: CREATE_POST
    };
}

// Create new user
export function fetchPushUser(prev) {

    const configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    $.ajax({
        type: "POST",
        url: `${ROOT_URL}/addUsr`,
        data: prev,
        success: function(s){
            console.log('PUSH USR SUCCESS',s);
            if(s.message && s.message === 'usr_added'){
                console.log('USR ADDED CORRECTLY',s);
                store.dispatch(store.dispatchArticle('ADD_USER_SUCCESS',s)); 
            }
            else {
                if(s.message == 'error_usr' && s.type && s.type.duplicate_key) {
                    
                    let keyDuplicate = null;
                    for(var key in prev.account){
                        if(prev.account[key] === s.type.duplicate_key) {
                            keyDuplicate = key;
                            break;
                        }
                    }
                    store.dispatch(store.dispatchArticle('DUPLICATE_VALUE',{duplicate_key:keyDuplicate}));
                }
            }
        }
    });

    return {
      type: CREATE_POST
    };
}

//Change passwrd
export function fetchChangePass(prev) {
    console.log('PUT NEW PASSWORD',prev);
    $.ajax({
        type: "PUT",
        url: `${ROOT_URL}/usrLog`,
        data: prev,
        success: function(s){
            console.log('PUT USR SUCCESS',s);
            if(s.message && s.message === 'pass_updated'){
                store.dispatch(store.dispatchArticle('UPDATE_PASS_SUCESS')); 
            }
        }
    });
}

//Update user shop
export function updateShop(prev) {
    $.ajax({
        type: "PUT",
        url: `${ROOT_URL}/addUsr`,
        data: prev,
        success: function(s){
            console.log('PUT USR SUCCESS',s);
            if(s.message && s.message === 'shop_updated'){
                console.log('USR SHOP UDPATED CORRECTLY',s);
                store.dispatch(store.dispatchArticle('UPDATE_SHOP_DATA_SUCESS',s)); 
            }
            else {
                
            }
        }
    });

    return {
      type: CREATE_POST
    };
}

// Get user login data
export function fetchUsrLogin(prev) {
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    
    axios.get(`${ROOT_URL}/usrLog`, {params: prev}, configUpload)
    .then(function (response) {
        console.log('response',response);
        if(prev.id_shop) {
            store.dispatch(store.dispatchArticle('GET_USR_SUCCESS',response.data));      //   UPDATE STATE AND DOM
        }
        else {
            store.dispatch(store.dispatchArticle('LOG_USER_SUCCESS',response.data));      //   UPDATE STATE AND DOM
        }
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

// Create new article
export function fetchPutArticle(prev) {
    var prevArt = { 
        id: prev.id, 
        name: prev.name, 
        price: prev.price, 
        desc: prev.desc, 
        brand: prev.brand, 
        qty: prev.qty, 
        cat: prev.cat,
        gender: prev.gender,
        img: prev.img,
        shpnme: prev.shpnme,
        zip: prev.zip
    };

    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    $.ajax({
        type: "POST",
        url: `${ROOT_URL}/add`,
        data: prev,
        success: function(s){
            if(s.message && s.message === 'article_added'){
                prevArt._id = s._id;
                prevArt.id_connect = s.id_connect;
                store.dispatch(store.dispatchArticle('ADD_ARTICLE_SUCCESS',prevArt));      //   UPDATE STATE AND DOM
            }
        }
    });

    return {
      type: CREATE_POST
    };
}

//Update article
export function updateArticle(prev){
    
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    $.ajax({
        type: "POST",
        url: `${ROOT_URL}/updateArticle`,
        data: prev,
        success: function(s){
            if(s.message && s.message === 'article_updated'){
                store.dispatch(store.dispatchArticle('UPDATE_ARTICLE_SUCCESS',s.article));      //   UPDATE STATE AND DOM
            }
        }
    });

    return {
      type: CREATE_POST
    };
}

// Remove qty article
export function deleteArticle(prev){
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    console.log('delete article on ',`${ROOT_URL}/deleteArticle`);
    $.ajax({
        type: "DELETE",
        url: `${ROOT_URL}/deleteArticle`,
        data: prev,
        crossDomain: true,
        success: function(s){
            if(s.message && s.message === 'article_deleted'){
                store.dispatch(store.dispatchArticle('DELETE_ARTICLE_SUCCESS',s));      //   UPDATE STATE AND DOM
            }
        }
    });
}

// Delete article
export function deleteShopArticle(prev){
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    console.log('delete article on ',`${ROOT_URL}/deleteArticle`);
    $.ajax({
        type: "DELETE",
        url: `${ROOT_URL}/deleteArticle`,
        data: prev,
        crossDomain: true,
        success: function(s){
            if(s.message && s.message === 'article_deleted'){
                store.dispatch(store.dispatchArticle('DELETE_ARTICLE_SUCCESS',s));      //   UPDATE STATE AND DOM
            }
        }
    });
}


// Add QA article
export function fetchPutQAArticle(prev) {
    $.ajax({
        type: "POST",
        url: `${ROOT_URL}/getOne`,
        data: prev,
        success: function(s){
            if(s.message && s.message === 'qa_added'){
                store.dispatch(store.dispatchArticle('ADD_QA_SUCCESS',s.article));      //   UPDATE STATE AND DOM
            }
        }
    });

    return {
      type: CREATE_POST
    };
}

// Send private email about article
export function fetchPutQAPArticle(prev) {
    $.ajax({
        type: "POST",
        url: `${ROOT_URL}/sendPrv`,
        data: prev,
        success: function(s){
            if(s.message && s.message === 'qa_added'){
                store.dispatch(store.dispatchArticle('ADD_QA_SUCCESS',s.article));      //   UPDATE STATE AND DOM
            }
        }
    });

    return {
      type: CREATE_POST
    };
}