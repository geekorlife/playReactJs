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

const ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://192.168.2.8:8080/api' : 'http://192.168.2.8:8080/api';

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

// Delete article
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