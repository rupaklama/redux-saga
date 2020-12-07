import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// Using other function from Redux - createStore ()
// to put all Reducers into the Redux Store object & create Global State object
// applyMiddleware - to add redux saga middleware
import { createStore, applyMiddleware } from 'redux';

// redux dev tool
import { composeWithDevTools } from 'redux-devtools-extension';

// redux saga
import createSagaMiddleware from 'redux-saga';

// provider component
import { Provider } from 'react-redux';

// our root saga
import rootSaga from './sagas';


// reducers
import reducers from './reducers';

import App from './App';
import reportWebVitals from './reportWebVitals';

// declare initial Global state object
const initialState = {};

// saga middleware
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

// STORE is the collections of different Reducers & global state object.
const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

// NOTE: After applyMiddleware gets called, we are going to run & add in all our Sagas
sagaMiddleware.run(rootSaga) // to run our root saga

// setting up base URL for axios to make api request
// In axios, to enable passing of cookies, we use the withCredentials: true option.
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://rem-rest-api.herokuapp.com/api';

// Wrap the App component with the Provider component.
// pass in a single prop - store which takes in all the reducers
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
