import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getUsersRequest } from './actions/usersActions';

function App({ getUsersRequest }) {
  useEffect(() => {
    getUsersRequest() 
  }, [getUsersRequest])

  return (
    <div>
      <h1>Redux Saga</h1>
      
    </div>
  );
}

// Even though if there's no state/data, still need to pass in first arg to the connect func
// first arg is always mapStateToProps func, pass null instead if no state/data
// Second arg is the Action Creator object
export default connect(null, { getUsersRequest })(App);
