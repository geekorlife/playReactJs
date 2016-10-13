import React from 'react'
import { render } from 'react-dom'
import Product from './Product'
import { Provider } from 'react-redux';
import store from './reduce/store'

/*
Dispatch event in the redux store after a type and data object merging
*/
const dispatchArticle = (type,ob) => Object.assign({type}, ob);
const addArt = (addProd) => {
  store.dispatch(dispatchArticle('ADD_ARTICLE',addProd));
}

const remArt = (id) => {
  store.dispatch(dispatchArticle('REMOVE_ARTICLE',{id}));
}

render(
    <Product addArt={addArt} remArt={remArt} store={store}/>,
    document.getElementById('app')
)

store.subscribe(function(){
  render(
    <Product addArt={addArt} remArt={remArt} store={store} />,
    document.getElementById('app')
)
})
