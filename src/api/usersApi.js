import axios from 'axios';

export const fetchUsers = () => {
  return axios.get('/users', {
    // request body object
    params: {
      limit: 1000 // users
    }
  })
}

export const createUser = ({firstName, lastName}) => {
  return axios.post('/users', {
    firstName, lastName
  })
}

export const deleteUser = (userId) => {
  return axios.delete(`/users/${userId}`)
}
