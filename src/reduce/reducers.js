import {
    removeArticle, 
    addArticle, 
    postIsLoading, 
    loadAllArticles, 
    addArticleSuccess,
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
    logUsr,
    logUsrSuccess,
    duplicateKey
} from './action';

const INITIAL_STATE = {
    post_state : { posts: [], error: null, loading: false , db: false, createdAdId: null},
    product: [],
    zip: null,
    user: {id_shop: null, credential: null, shpnme: null}
};

const actionState = (state = INITIAL_STATE, action) => {
    console.log('ACTION - ',action.type);
    switch (action.type) {
        case 'ADD_ARTICLE':
            return  addArticle(state,action);
        case 'ADD_ARTICLE_SUCCESS':
            return  addArticleSuccess(state,action);
        case 'ADD_QA':
            return  addQA(state,action);
        case 'ADD_QA_SUCCESS':
            return  addQASuccess(state,action);
        case 'ADD_QAP':
            return  addQAP(state,action);
        case 'ADD_QAP_SUCCESS':
            return  addQAPSuccess(state,action);
        case 'REMOVE_ARTICLE':
            return removeArticle(state,action.id);
        case 'REMOVE_ARTICLE_SUCCESS':
            return removeArticle(state,action.id);
        case 'GET_LIST_ARTICLE':
            return getPageArticle(state,action);
        case 'GET_ARTICLE':
            return getArticle(state,action);
        case 'GET_ARTICLE_SUCCESS':
            return addArticleDB(state,action.art);
        case 'GET_ARTICLE_ADMIN':
            return getArticleAdmin(state,action);
        case 'UPDATE_ARTICLE':
            return updateArticle(state,action);
        case 'UPDATE_ARTICLE_SUCCESS':
            return addQASuccess(state,action);
        case 'DELETE_ARTICLE':
            return deleteArticle(state,action);
        case 'DELETE_ARTICLE_SUCCESS':
            return deleteSuccess(state,action);
        case 'GET_LIST_ARTICLE_SUCCESS':
            return addArticleDB(state,action.art);
        case 'INIT_ARTICLE':
            return loadAllArticles(state,action.state);
        case 'RESET_PAGE_ARTICLE':
            return resetPageArticle(state);
        case 'GET_LOCAL_ZIP':
            return getLocalZip(state);
        case 'SET_LOCAL_ZIP':
            return setLocalZip(state,action);
        case 'PUSH_USER':
            return addUser(state, action);
        case 'ADD_USER_SUCCESS':
            return addUsrSuccess(state, action);
        case 'GET_USR_SUCCESS':
            return getUsrSuccess(state, action);
        case 'GET_USR_DATA':
            return getUsrData(state, action);
        case 'LOG_USER_SUCCESS':
            return logUsrSuccess(state, action);
        case 'LOG_USER':
            return logUsr(state, action.account);
        case 'DUPLICATE_VALUE':
            console.log('duplciate ket detected');
            var d = duplicateKey(state, action);
            return d;
        default:
            return state;
    }
};

export default actionState;