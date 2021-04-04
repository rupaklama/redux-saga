// we actually need to import in certain Effects from Redux-Saga
// This Effects allow us to do different things with either the STORE
// like creating Actions or listening for Actions.

// import { takeEvery } from 'redux-saga/effects';
// Use this when: You want to watch for EVERY time a specific redux action creator was dispatched.
// Use case: Getting / fetching a list of data from an API
// 'takeEvery' helper/effect is the most familiar and provides a behavior similar to redux-thunk

// NOTE: takes every matching action & run the given saga (non-blocking)

// 'takeEvery' allows multiple fetchData instances to be started concurrently, non-blocking
// to perform multiple operations or Sagas at the same time like as an async operations
// At a given moment, we can start a new fetchData task while there are still
// one or more previous fetchData tasks which have not yet terminated

import {
  takeEvery,
  call,
  fork,
  put,
  takeLatest,
  take,
} from 'redux-saga/effects';

// NOTE: EFFECT CREATORS

// 'select': returns the full state of the application

// 'cancel': cancels the saga execution

// 'call' effect - We can make asynchronous calls using the call Effect like api request
// It functions as await syntax to wait for function or promise to finish.
// run a method, Promise or other Sage(blocking)

// 'fork' effect - In general, fork is useful when a saga needs to start a non-blocking task.
// Non-blocking here means: the caller starts the task and continues
// executing without waiting for it to complete.
// performs a non-blocking call to a generator or a function that returns a promise.
// It is useful to call fork on each of the sagas you want to run when you start
// your application since it will run all the saga concurrently(non-blocking)

// NOTE: In the context of Redux Saga, all the Watcher Sagas will be forked from
// ROOT Saga - watchGetUsersRequest Saga.
// All our logic code are separated into different forks or units
// to avoid errors with one fork to another.

// 'delay' effect - is like setTimeout method in saga
// block execution for a predefined number of milliseconds

// 'put' effect - is to dispatch an action to our reducer(non-blocking)

// 'debounce' effect - the purpose of debounce is to prevent calling saga until the actions
// are settled off. Meaning, until the actions we listen on will not be dispatched for a
// given period. For example, dispatching autocomplete/api request action will be processed only after
// 100mms passed from when the user stopped typing.

// 'throttle' effect - the purpose of throttle is to ignore incoming actions for a given
// period while processing a task. For example, dispatching autocomplete/api request action will be
// processed every 100ms since throttle ignores consecutive autocomplete/api request for some time,
// we ensure that user won't flood our server with requests.

// NOTE: Effect combinators

// race(effects) - A race between multiple sagas. When one of the sagas finishes, all
// other sagas are canceled. similar to Promise.race()
// Note: fork & race are used for managing concurrently between Sagas

// all(effects) - run multiple effects in parallel & wait for all of them to complete
// similar to Promise.all

// all our users action creators
import * as actions from '../actions/usersActions';

// base api URLs
import * as api from '../api/usersApi';

// Worker Saga: is running all the 'Side Effects' it was meant to do
// Worker Saga - A Generator Function for Watcher Saga below
// for 'getUsersRequest' action creator
function* getUsers() {
  try {
    const result = yield call(api.fetchUsers);
    // console.log(result);
    // put is to dispatch an action to our reducer
    yield put(actions.getUsersSuccess({ users: result.data.data }));
  } catch (e) {
    yield put(
      actions.usersError({
        error: 'An error occurred when trying to get the user',
      })
    );
  }
}

// Watcher Saga - A Generator Function
// The Watcher Saga is typically the ROOT Saga to export & mount on the Store
// Watcher Saga sees every action that is dispatched to the redux store.
// If it matches the action it is told to handle, it will assign it to its Worker Saga

// This will watch every time 'getUsersRequest' action creator is being dispatch
// & perform operation on this action by calling Worker Saga above.
function* watchGetUsersRequest() {
  // yield is to pause & return the value from 'takeEvery effect' async operation
  yield takeEvery(actions.GET_USERS_REQUEST, getUsers); // action creator & Worker Saga
}
// NOTE: In the context of Redux-Saga, 'takeEvery' is doing non-blocking operation
// Under the hood, 'takeEvery' is running 'while(true)' loop &
// constantly watching for whatever Action creators we pass in
// function* testing() {
//   while(true) {
//     yield 1;
//     // return; generator ends here
//     yield 2;
//     yield 3; // loop will start again
//   }
// }

// import { take } from 'redux-saga/effects';
// 'take' effect is kind a works same as 'takeEvery' but ONE AT A TIME
//  wait for a redux actions to be dispatched into the store (blocking)
// Finish first action then execute second one approach

// Worker Saga
// extracting data from action creator which got dispatch
function* deleteUser({ userId }) {
  try {
    yield call(api.deleteUser, userId);

    // calling getUsers Worker Saga which will update users state in Redux store
    yield call(getUsers);
  } catch (e) {
    yield put(
      actions.usersError({
        error: 'An error occurred when trying to delete the user',
      })
    );
  }
}

// Watcher saga
function* watchDeleteUserRequest() {
  // once 'DELETE_USER_REQUEST' action has been dispatched, we enter into this while loop
  // Below here, calling deleteUser Worker Saga which will then call api to delete user
  // In the mean time, this Watcher Saga is ignoring any additional delete user request actions
  // So, we need to wait entire delete saga to resolve
  while (true) {
    // can not pass in a Worker Saga into `take effect' since it's a lower level helper
    // which simply returns an action that got dispatch
    const action = yield take(actions.DELETE_USER_REQUEST);
    // with the data from the dispatched action above, we can actually use
    // `yield call` to call the Worker Saga
    yield call(deleteUser, {
      // calling deleteUser saga with arg
      userId: action.payload.userId,
    });
  }
}

// If we want to only get the response of the latest request fired
// (e.g. to always display the latest version of data) we can use the 'takeLatest' helper/effect

// import { takeLatest } from 'redux-saga/effects';
// NOTE: Unlike takeEvery, takeLatest allows only one fetchData task to run at any moment.
// And it will be the latest started task. If a previous task is still running when
// another fetchData task is started, the previous task will be automatically cancelled.
// NOTE: takes every matching action & run the given Saga, but cancels every previous saga
// that is still running(blocking)

// Worker saga
// Redux Action gets passed into Redux Worker Saga as an arg that we specify in Watcher Saga
function* createUser(action) {
  // extracting data from action creator which got dispatch
  // yield console.log(action)
  try {
    yield call(api.createUser, {
      // adding one more arg for user data object
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
    });

    // calling getUsers Worker Saga which will update users state in Redux store
    yield call(getUsers);
  } catch (e) {
    yield put(
      actions.usersError({
        error: 'An error occurred when trying to create the user',
      })
    );
  }
}

// Watcher Saga
function* watchCreateUserRequest() {
  yield takeLatest(actions.CREATE_USER_REQUEST, createUser);
}

// If you have multiple Sagas watching for different actions,
// you can create multiple watchers with those built-in helpers,
// which will behave like there was fork used to spawn them
// (we'll talk about fork later. For now, consider it to be an Effect that
// allows us to start multiple sagas in the background).

// To hook up our userSagas into the Redux STORE
const userSagas = [
  // we want to return a Fork processes of our Watcher Sagas to perform non-blocking calls
  fork(watchGetUsersRequest),
  fork(watchCreateUserRequest),
  fork(watchDeleteUserRequest),
];

export default userSagas;
