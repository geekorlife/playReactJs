"use strict";

import ActionReduce from './action';

// Initial redux store, have to setup here in case of a bad state is passing
const INITIAL_STATE = {
    post_state : { posts: [], error: null, loading: false , db: false, createdAdId: null},
    product: [],
    zip: null,
    user: {id_shop: null, credential: null, shpnme: null},
    currentShop: {name: null, avatar: null, desc: null},
    poolRequest : []
};

/**
 * Main reducer
 * Return an immutable state from an action
 */
const actionState = (state = INITIAL_STATE, action) => {
    console.log('ACTION - ',action.type);
    //Switch action type
    switch (action.type) {
        case 'ADD_ARTICLE':
            return  ActionReduce.addArticle(state,action);

        case 'ADD_ARTICLE_SUCCESS':
            return  ActionReduce.addArticleSuccess(state,action);

        case 'ADD_QA':
            return  ActionReduce.addQA(state,action);

        case 'ADD_QA_SUCCESS':
            return  ActionReduce.addQASuccess(state,action);

        case 'ADD_QAP':
            return  ActionReduce.addQAP(state,action);

        case 'ADD_QAP_SUCCESS':
            return  ActionReduce.addQAPSuccess(state,action);

        case 'REMOVE_ARTICLE':
            return ActionReduce.removeArticle(state,action.id);

        case 'REMOVE_ARTICLE_SUCCESS':
            return ActionReduce.removeArticle(state,action.id);

        case 'GET_LIST_ARTICLE':
            return ActionReduce.getPageArticle(state,action);

        case 'GET_ARTICLE':
            return ActionReduce.getArticle(state,action);

        case 'GET_ARTICLE_SUCCESS':
            return ActionReduce.addArticleDB(state,action.art);

        case 'GET_ARTICLE_ADMIN':
            return ActionReduce.getArticleAdmin(state,action);

        case 'UPDATE_ARTICLE':
            return ActionReduce.updateArticle(state,action);

        case 'UPDATE_ARTICLE_SUCCESS':
            return ActionReduce.addQASuccess(state,action);

        case 'DELETE_ARTICLE':
            return ActionReduce.deleteArticle(state,action);

        case 'DELETE_ARTICLE_SUCCESS':
            return ActionReduce.deleteSuccess(state,action);

        case 'GET_LIST_ARTICLE_SUCCESS':
            return ActionReduce.addArticleDB(state,action.art);

        case 'INIT_ARTICLE':
            return ActionReduce.loadAllArticles(state,action.state);
            
        case 'RESET_PAGE_ARTICLE':
            return ActionReduce.resetPageArticle(state);

        case 'GET_LOCAL_ZIP':
            return ActionReduce.getLocalZip(state);

        case 'SET_LOCAL_ZIP':
            return ActionReduce.setLocalZip(state,action);

        case 'ASK_LOCAL_ZIP':
            return ActionReduce.askLocalZip(state,action);
            
        case 'PUSH_USER':
            return ActionReduce.addUser(state, action);

        case 'ADD_USER_SUCCESS':
            return ActionReduce.addUsrSuccess(state, action);

        case 'GET_USR_SUCCESS':
            return ActionReduce.getUsrSuccess(state, action);

        case 'GET_USR_DATA':
            return ActionReduce.getUsrData(state, action);

        case 'LOG_USER_SUCCESS':
            return ActionReduce.logUsrSuccess(state, action);

        case 'LOG_USER':
            return ActionReduce.logUsr(state, action.account);

        case 'LOG_OUT':
            return ActionReduce.logOut(state);

        case 'CHANGE_PASS':
            return ActionReduce.changePass(state, action);

        case 'UPDATE_PASS_SUCESS':
            return ActionReduce.changePassSuccess(state);

        case 'RESET_PASS_MSG':
            return ActionReduce.resetPassMsg(state);
            
        case 'DUPLICATE_VALUE':
            return ActionReduce.duplicateKey(state, action);

        case 'GET_SHOP_ARTICLE':
            return ActionReduce.getMyShopArticle(state, action);

        case 'GET_SHOP_SUCCESS_ARTICLE':
            return ActionReduce.addArticleDB(state,action.art);

        case 'DEL_SHOP_ARTICLE':
            return ActionReduce.deleteShopArticle(state, action);

        case 'UPDATE_SHOP_DATA_SUCESS':
            return ActionReduce.updateShopSuccess(state, action.data);

        case 'UPDATE_SHOP_DATA':
            return ActionReduce.updateShop(state, action);

        case 'ADD_POOL_REQUEST':

            return ActionReduce.addPullRequest(state,action);
        default:
            return state;
    }
};

export default actionState;