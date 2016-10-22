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
        console.log('GET ALL DB FECH',response.data);
        store.dispatch(store.dispatchArticle(INIT_ARTICLE,{state:response.data}));      //   UPDATE STATE AND DOM
    })
    .catch(function (error) {
        console.log(error);
    });

    return {
      type: FETCH_POSTS
    };
}

export function fetchPageArticle(fromPage){
    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };
    
    axios.get(`${ROOT_URL}/page`, {params: fromPage}, configUpload)
    .then(function (response) {
        console.log('get page article reponse',response.data);
        store.dispatch(store.dispatchArticle('GET_LIST_ARTICLE_SUCCESS',{art:response.data}));      //   UPDATE STATE AND DOM
    })
    .catch(function (error) {
        console.log(error);
    });

    return {
      type: CREATE_POST
    };
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
        img: prev.img 
    };

    var configUpload = {
        responseType: 'arraybuffer',
        onDownloadProgress: function (e) {
            console.log("This just in... ", e);
        }
    };

    axios.post(`${ROOT_URL}/add`, prev, configUpload)
    .then(function (response) {
        console.log('response',response);
        store.dispatch(store.dispatchArticle(ADD_ARTICLE_SUCCESS,prevArt));      //   UPDATE STATE AND DOM
    })
    .catch(function (error) {
        console.log(error);
    });

    return {
      type: CREATE_POST
    };
}