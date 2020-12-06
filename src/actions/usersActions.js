// action types
export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const USERS_ERROR = 'USERS_ERROR';

// action creators
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
