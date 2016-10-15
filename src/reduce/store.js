import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import promise from 'redux-promise';
import article_reducer from './article_reducer';

//var mainReducer = combineReducers(article_reducer, rest_reducer);

let store = createStore(article_reducer);

export default store;