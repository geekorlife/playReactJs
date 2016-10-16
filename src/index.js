import React from 'react'
import { render } from 'react-dom'
import Product from './Product'
import { Provider } from 'react-redux';
import store from './reduce/store'

const addArt = (addProd) => {
  console.log('ADD ARTICEL FROM INDEX');
  store.dispatch(store.dispatchArticle('ADD_ARTICLE',addProd));
}

const remArt = (id) => {
  store.dispatch(store.dispatchArticle('REMOVE_ARTICLE',{id}));
}

render(
    <Product addArt={addArt} remArt={remArt}/>,
    document.getElementById('app')
)

store.subscribe(function(){
  render(
    <Product addArt={addArt} remArt={remArt}/>,
    document.getElementById('app')
)
})
