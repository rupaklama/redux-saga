import { all } from 'redux-saga/effects';
// 'all' effect is to resolve multiple promises at the same time
// & act only once when all promises get resolved 

import usersSagas from './usersSagas';

// our sagas 
export default function* rootSaga() {
  // 'all' effect combinator
  // run multiple effects in parallel & wait for all of them to complete 
  // similar to Promise.all
  yield all([
    // spread operator here to create a new array from this usersSagas array we imported
    // all the forked processes will be running in parallel & waiting for all of them to be resolved 
    ...usersSagas
  ])
}

// Redux Saga is a library  that aims to make application side effects
// mainly asynchronous things like data fetching & impure things like accessing browser cache
// easier to manage, more efficient to execute, easy to rest & better at handling failures. 

// The mental model is that a saga is like a separate thread in your application that's solely 
// responsible for side effects. redux-saga is a redux middleware, which means this thread 
// can be started, paused and cancelled from the main application with normal redux actions, 
// it has access to the full redux application state and it can dispatch redux actions as well.

// Redux Saga is a function that conditionally runs & the condition that it depends on when 
// it runs is based on whether or not a specific Action is coming into the Saga middleware. 
// For example, when Action creator like fetch api request gets fired, only then Saga gets executed. 
// No action creator fired, Saga won't gets executed. 

// NOTE: any async operations happen inside our app which is not related to our Component State
// but related to Application as a whole or some parts of our App - should be move into SAGA. 

// Redux Saga uses Generator Function to 'PAUSE' functions to give us control when we want to
// continue executions with our block of code or do something first. 
// We can perform 'LAZY Evaluation' which delays or pause functions until its value
// is needed, making our App more memory efficient. 

// NOTE: INITIAL EXECUTION
// Reducers fire first, then Sagas receive the actions. From there, 
// Sagas can fire off new Actions which in turn hit the Reducers & other Sagas as well. 
