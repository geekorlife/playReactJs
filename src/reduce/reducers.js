import {
    removeArticle, 
    addArticle, 
    postIsLoading, 
    loadAllArticles, 
    addArticleSuccess,
    addArticleDB,
    getPageArticle,
    getPageArticleSuccess,
    resetPageArticle
} from './action';

const INITIAL_STATE = {
    post_state : { posts: [], error: null, loading: false , db: false},
    product: []
};

const actionState = (state = INITIAL_STATE, action) => {
    console.log('articleState ACTION - ',action.type);
    switch (action.type) {
        case 'ADD_ARTICLE':
            return  addArticle(state,action);
        case 'ADD_ARTICLE_SUCCESS':
            return  addArticleSuccess(state,action);
        case 'REMOVE_ARTICLE':
            return removeArticle(state,action.id);
        case 'REMOVE_ARTICLE_SUCCESS':
            return removeArticle(state,action.id);
        case 'GET_LIST_ARTICLE':
            return getPageArticle(state,action);
        case 'GET_LIST_ARTICLE_SUCCESS':
            return addArticleDB(state,action.art);
        case 'INIT_ARTICLE':
            return loadAllArticles(state,action.state);
        case 'RESET_PAGE_ARTICLE':
            return resetPageArticle(state);
        default:
            return state;
    }
};

export default actionState;