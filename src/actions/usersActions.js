// action types
export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const USERS_ERROR = 'USERS_ERROR';

// action creators to get users
// normal syntax of action creator which returns an object
export const getUsersRequest = () => {
 return {
  type: GET_USERS_REQUEST
 }
}

// same as above but different syntax
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
