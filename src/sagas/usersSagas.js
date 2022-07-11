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
// Use this when: You want to call a function or a promise but want to wait for that function or promise 
// to finish running before executing the next line of code.
  
// Use case: In conjunction with "take" and blocking saga, or;
// Calling a promise within a worker saga that queries an API endpoint.

// 'apply': It works just like a 'call' except it changes the scope of 'call'

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

// 'spawn' effect - creates a new process, similar to fork- caller is not interrupted
// new process is not effected if caller erros or cancelled, this is the main difference between spawn vs fork

// 'delay' effect - is like setTimeout method in saga
// block execution for a predefined number of milliseconds

// 'put' effect - is to dispatch an action to our reducer(non-blocking)
// Use this when: You want to dispatch a redux action from within a REDUX SAGA.
// Use case: Any time you want to update your redux state - usually after a call to an API resolves 
// and you want to update your redux state with the resulting data from the API.

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

// all(effects) - run multiple effects in parallel & wait for all of them to complete similar to Promise.all
// combines numerous take statements into one 
// code execution resumes when all actions have been dispatched

// base api URLs
import * as api from '../api/usersApi';

// all our users action creators & types
import { GET_USERS_REQUEST } from '../actions/usersAction';


// Action creators here to analyze
export const getUsersSuccess = ({ users }) => ({
  type: GET_USERS_SUCCESS,
  payload: { users }
})

// create user
export const createUserRequest = ({ firstName, lastName }) => ({
  type: CREATE_USER_REQUEST,
  payload: { firstName, lastName }
})

// delete user
export const deleteUserRequest = (userId) => ({
 type: DELETE_USER_REQUEST,
 payload: { userId }
})

// error
export const usersError = ({error}) => ({
  type: USERS_ERROR,
  payload: { error }
})


// Example
function* testing() {
  // while true loop
  while (true) {
    yield 1;
    yield 2;
    yield 3;
  }
}

// Generator function returns an Iterator object
const iterator = testing();
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next()); // This will loop or start again & execute the 'yield 1' again

// Note - Under the hood ALL EFFECTS in Redux Saga, this is exactly how Redux Watcher Sagas are
// constantly watching for Redux Actions(types) Objects that were dispatched.
// Redux Watcher Sagas are all running within these While(true) loop

// NOTE - In the Context of Redux Saga, 
// the Generator Function does not block the UI (async operation) while waiting for Functions to run. 
// We are essentially controlling when to Enter or Exit a Function like with in
// Looping Generator Function with the while (true) loop

// api calls
const fetchUsers = () => {
  return axios.get('/users', {
    // request body object
    params: {
      limit: 1000, // users
    },
  });
};

// Worker Saga: is running all the 'Side Effects' it was meant to do
// Worker Saga - A Generator Function for Watcher Saga below
// for 'getUsersRequest' action creator
function* workerGetUsers() {
  // Use this 'call' effect when: You want to call a function or a promise but want to wait for that function or promise
  // to finish running before executing the next line of code.
  try {
    // const result = yield call(api.fetchUsers);
    const result = yield call(fetchUsers);
    // console.log(result);
    // put is to dispatch an action to our reducer
    // yield put(actions.getUsersSuccess({ users: result.data.data }));
    
    // Use 'put' when: You want to dispatch a redux action creator from within a redux saga to update our Redux State
    yield put(getUsersSuccess({ users: result.data.data }));
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
// Watcher Saga sees every Redux Actions(types) Objects that is dispatched to the redux store.
// If it matches the action it is told to handle, it will assign it to its Worker Saga

// This will watch every time 'GET_USERS_REQUEST' action type is being dispatch
// & perform operation on this action by calling Worker Saga above.
function* watchGetUsersRequest() {
  // yield is to pause & return the value from 'takeEvery effect' async operation
  yield takeEvery(GET_USERS_REQUEST, workerGetUsers); // action type & our Worker Saga function
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

// api call 
const createUser = ({ firstName, lastName }) => {
  return axios.post('/users', {
    firstName,
    lastName,
  });
};


// If we want to only get the response of the latest request fired
// (e.g. to always display the latest version of data) we can use the 'takeLatest' helper/effect

// import { takeLatest } from 'redux-saga/effects';
// NOTE: Unlike takeEvery, takeLatest allows only one fetchData task to run at any moment.
// And it will be the latest started task. If a previous task is still running when
// another fetchData task is started, the previous task will be automatically cancelled.
// NOTE: takes every matching action & run the given Saga, but cancels every previous saga
// that is still running(blocking)

// Use 'takeLatest' when: There's the potential for a redux action to be dispatched multiple times in a short period and 
// could potentially initiate the running of multiple instances of the same saga - use takeLatest 
// to ONLY take the latest currently running saga for the associated dispatched redux action.

// Use cases: Creating or updating a record, or;
// If you have a complex app that queries the same API endpoint from multiple components at the same time - 
// for example if you have a navbar that displays the currently logged in user's name, 
// but the user is viewing a 'settings' page to view their personal details meaning both the navbar and 
// the settings page will query the same API endpoint - you'll generally want to take the latest call for that data.

// Worker saga
// Redux Action gets passed into Redux Worker Saga as an arg that we specify in Watcher Saga
// NOTE - This is the first Saga we come across where we need to EXTRACT some properties from the Redux Action Object that was dispatched.
// NOTE - In Watcher Saga, the Redux Action Object is actually passed in to the Worker Saga - (CREATE_USER_REQUEST, workerCreateUser)

function* workerCreateUser(action) { // 'action' Object is actually passed in to the Worker Saga
  // extracting data from action creator which got dispatch
  // console.log(action) - {type: "CREATE_USER_REQUEST", payload: {…}}
  // yield; // need to return at least one value in generator function
  
  try {
    // On call effect - we can add additional arguments to our Action as a Second Arg Object - action object
    yield call(createUser, { // api endpoint above
      // accessing payload of Action Object -  {type: "CREATE_USER_REQUEST", payload: {…}} &
      // passing as args on Request Body object for network request
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
    });

    // calling 'workerGetUsers' Worker Saga which will refresh & update Users State Slice with the New User in Redux store
    // This New User will be added in Users State Slice & displayed in UI
    // Display the updated data
    yield call(workerGetUsers);
  } catch (e) {
    // Use 'put' effect when: You want to dispatch a redux action from within a redux saga.
    // Use case: Any time you want to update your redux state - usually after a call to an API resolves and 
    // you want to update your redux state with the resulting data from the API.
    yield put(
      usersError({
        error: 'An error occurred when trying to create the user',
      })
    );
  }
}

// Watcher Saga
function* watchCreateUserRequest() {
  // NOTE - When observing Redux Actions with 'take', 'takeEvery' and 'takeLatest' effects,
  // the Redux Action with its payload is actually passed into the Worker Saga above
  yield takeLatest(CREATE_USER_REQUEST, workerCreateUser);
}


// delete api
const deleteUser = userId => {
  return axios.delete(`/users/${userId}`);
};

// import { take } from 'redux-saga/effects';
// 'take' effect is kind a works same as 'takeEvery' but ONE AT A TIME
//  wait for a redux actions to be dispatched into the store (blocking)
// Finish first action then execute second one approach

// Worker Saga
// { userId } - extracting from (workerDeleteUser, {userId: action.payload.userId}) in Watcher Saga
function* workerDeleteUser({ userId }) {
  try {
    // calling api & passing in user ID 
    yield call(deleteUser, userId);

    // calling 'workerGetUsers' Worker Saga which will update users state in Redux store
    // To get updated list of Users
    yield call(workerGetUsers);
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
    // can not pass in a Worker Saga into `take effect' since it's a lower level helper/effect
    // which simply returns an Action that got dispatch
    const action = yield take(DELETE_USER_REQUEST); // CANNOT PASS WORKER SAGA as second arg here since it's a lower level helper/effect
    // NOTE - take returns Action Object which was just dispatched
    // with the data from the dispatched action above, we can actually use
    // `yield call` to call the Worker Saga
    yield call(workerDeleteUser, {
      // On call effect - we can add additional arguments as a Second arg for First arg - Worker Saga or Action object
      // Passing in User id in Worker Saga from Action Object's payload 
      userId: action.payload.userId,
    });
  }
}

// If you have multiple Sagas watching for different Actions Types,
// you can create multiple watchers with those built-in helpers,
// which will behave like there was fork used to spawn them
// (we'll talk about fork later. For now, consider it to be an Effect that
// allows us to start multiple sagas in the background).

// Fork - To start multiple sagas in the background
const userSagas = [
  // we want to return a Fork processes of our Watcher Sagas to perform non-blocking calls or
  // run Watcher Sagas in parallels/async without interfering other Sagas.
  // Any Errors that occurs with all these Fork processes, we can catch it independently without
  // effecting other multiple Sagas Fork processes
  fork(watchGetUsersRequest),
  fork(watchCreateUserRequest),
  fork(watchDeleteUserRequest),
];

export default userSagas;
