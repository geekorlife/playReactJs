import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from '.';

let store = createStore(reducer);

export default store;