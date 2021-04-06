import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { createUserRequest } from '../actions/usersActions';

const NewUserForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // useDispatch hook to dispatch an action creator
  const dispatch = useDispatch();
  
  // this hook takes an arrow func with arg state & which part of state we want from combineReducers
  const users = useSelector(state => state.users);
  console.log(users.error);

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(firstName, LastName)

    dispatch(createUserRequest({ firstName, lastName }));

    setFirstName('');
    setLastName('');
  };
  
  const handleCloseAlert = () => {
    dispatch(usersError({ error: '' }));
  };

  return (
    <Alert color='danger' isOpen={!!users.error} toggle={handleCloseAlert}>
        {users.error}
      </Alert>
    
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>First Name</Label>
        <Input
          type='text'
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder='First name'
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Last Name</Label>
        <Input
          type='text'
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder='Last name'
          required
        />
      </FormGroup>

      <FormGroup>
        <Button block outline type='submit' color='primary'>
          Create
        </Button>
      </FormGroup>
    </Form>
  );
};

export default NewUserForm;
