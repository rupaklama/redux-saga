import axios from 'axios';

export const fetchUsers = () => {
  return axios.get('/users', {
    // request body object
    params: {
      limit: 1000 // users
    }
  })
}
