import React, { useEffect } from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserRequest, getUsersRequest } from '../actions/usersActions';

const UsersList = () => {
  // useDispatch hook to dispatch an action creator
  const dispatch = useDispatch();

  // this hook takes an arrow func with arg state & which part of state we want from combineReducers
  const { users } = useSelector(state => state.users);
  // console.log(users.users);

  // dispatching action creator to make api request when component renders
  useEffect(() => {
    dispatch(getUsersRequest());
  }, [dispatch]);

  // delete user
  // const handleDeleteUser = (userId) => {
  //   dispatch(deleteUserRequest(userId))
  // }

  return (
    // sort by first name, if first name is same then sort by last name
    <ListGroup>
      {users.users
        .sort((a, b) => {
          if (a.firstName > b.firstName) {
            return 1;
          } else if (a.firstName < b.firstName) {
            return -1;
          } else if (a.lastName > b.lastName) {
            return 1;
          } else if (a.lastName < b.lastName) {
            return -1;
          }
          return 0;
        })
        .map(user => (
          <ListGroupItem key={user.id}>
            <section style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1, margin: 'auto 0' }}>
                {user.firstName} {user.lastName}
              </div>

              <div>
                <Button
                  outline
                  color='danger'
                  onClick={e => dispatch(deleteUserRequest(user.id))}
                >
                  Delete
                </Button>
              </div>
            </section>
          </ListGroupItem>
        ))}
    </ListGroup>
  );
};

export default UsersList;
