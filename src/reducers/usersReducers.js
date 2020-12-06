import { GET_USERS_SUCCESS } from "../actions/usersActions"

const INITIAL_STATE = {
  users: []
}

export const usersReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case GET_USERS_SUCCESS:
      return { ...state, users: action.payload }
    default:
      return state
  }
}
