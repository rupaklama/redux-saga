import { GET_USERS_SUCCESS, USERS_ERROR } from "../actions/usersActions"

const INITIAL_STATE = {
  users: [],
  error: ''
}

export const usersReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case GET_USERS_SUCCESS:
      return { ...state, users: action.payload.users }
    case USERS_ERROR:
      console.log(action.payload)
      return { ...state, error: action.payload.error }
    default:
      return state
  }
}
