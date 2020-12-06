// we actually need to import in certain Effects from Redux-Saga
// This Effects allow us to do different things with either the STORE 
// like creating Actions or listening for Actions. 

// import { takeEvery } from 'redux-saga/effects';
// 'takeEvery' effect - it listens for every Action of specific type we pass to it
// takeEvery is the most familiar and provides a behavior similar to redux-thunk

// 'takeEvery' allows multiple fetchData instances to be started concurrently, non-blocking
// to perform multiple operations or Sagas at the same time like as an async operations
// At a given moment, we can start a new fetchData task while there are still 
// one or more previous fetchData tasks which have not yet terminated

import { takeEvery, call, fork, put } from 'redux-saga/effects';

// 'call' effect - We can make asynchronous calls using the call Effect like api request

// 'fork' effect - In general, fork is useful when a saga needs to start a non-blocking task. 
// Non-blocking here means: the caller starts the task and continues 
// executing without waiting for it to complete.

// NOTE: In the context of Redux Saga, all the Watcher Sagas will be forked from 
// ROOT Saga - watchGetUsersRequest Saga. 
// All our logic code are separated into different forks or units 
// to avoid errors to one fork to another. 

// 'delay' effect - is like setTimeout method in saga

// 'put' effect - is to dispatch an action to our reducer 

// all our users action creators
import * as actions from '../actions/usersActions';

// base api URLs
import * as api from '../api/usersApi';

// Worker Saga - A Generator Function for Watcher Saga below 
// for 'getUsersRequest' action creator
function* getUsers() {
  try {
    const result = yield call(api.fetchUsers)
    console.log(result)
    // put is to dispatch an action to our reducer 
    yield put(actions.getUsersSuccess({ users: result.data.data }))

  } catch (e) {
    
  }
}

// Watcher Saga - A Generator Function 
// This will watch every time 'getUsersRequest' action creator is being dispatch
// & perform operation on this action by calling Worker Saga above. 
function* watchGetUsersRequest() {
  // yield is to pause & return the value from 'takeEvery effect' async operation
  yield takeEvery(actions.GET_USERS_REQUEST, getUsers) // action creator & Worker Saga
}
// NOTE: In the context of Redux-Saga, 'takeEvery' is doing non-blocking operation
// Under the good, 'takeEvery' is running 'while(true)' loop & 
// constantly watching for whatever Action creators we pass in
// function* testing() {
//   while(true) {
//     yield 1;
//     // return; generator ends here
//     yield 2;
//     yield 3; // loop will start again 
//   }
// }

// To hook up our userSagas into the Redux STORE
const userSagas = [
  // we want to return a Fork processes of our Watcher Sagas to perform non-blocking calls
  fork(watchGetUsersRequest)
]

export default userSagas;

// import { take } from 'redux-saga/effects';
// 'take' effect is kind a works same as 'takeEvery' 
// Only difference is we would write our func respectively 

// If we want to only get the response of the latest request fired 
// (e.g. to always display the latest version of data) we can use the 'takeLatest' helper/effect

// import { takeLatest } from 'redux-saga/effects';
// NOTE: Unlike takeEvery, takeLatest allows only one fetchData task to run at any moment. 
// And it will be the latest started task. If a previous task is still running when 
// another fetchData task is started, the previous task will be automatically cancelled.

// If you have multiple Sagas watching for different actions, 
// you can create multiple watchers with those built-in helpers, 
// which will behave like there was fork used to spawn them 
// (we'll talk about fork later. For now, consider it to be an Effect that 
// allows us to start multiple sagas in the background).


