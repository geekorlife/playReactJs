import React from 'react'
import { render } from 'react-dom'
import Product from './Product'
import { Provider } from 'react-redux';
import store from './reduce/store';;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const addArt = (addProd) => {
  store.dispatch(store.dispatchArticle('ADD_ARTICLE',addProd));
}

const remArt = (id) => {
  store.dispatch(store.dispatchArticle('REMOVE_ARTICLE',{id}));
}

const App = () => (
  <MuiThemeProvider>
    <Product addArt={addArt} remArt={remArt}/>
  </MuiThemeProvider>
);


render(
    <App/>,
    document.getElementById('app')
)

store.subscribe(function(){
  render(
    <App/>,
    document.getElementById('app')
)
})