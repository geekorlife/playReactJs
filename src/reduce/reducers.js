import {removeArticle, addArticle, postIsLoading, loadAllArticles, addArticleSuccess} from './action';

const INITIAL_STATE = {
    post_state : { posts: [], error: null, loading: false , db: false},
    product: []
};

const actionState = (state = INITIAL_STATE, action) => {
    console.log('articleState ACTION - ',action.type);
    console.log('state.product AFTER',state);
    switch (action.type) {
        case 'ADD_ARTICLE':
            return  addArticle(state,action);
        case 'ADD_ARTICLE_SUCCESS':
            return  addArticleSuccess(state,action);
        case 'REMOVE_ARTICLE':
            return removeArticle(state,action.id);
        case 'REMOVE_ARTICLE_SUCCESS':
            return removeArticle(state,action.id);
        case 'INIT_ARTICLE':
            return loadAllArticles(state,action.state);
        default:
            return postIsLoading(state, false);
    }
};

export default actionState;