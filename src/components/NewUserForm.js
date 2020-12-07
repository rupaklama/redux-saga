import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { createUserRequest } from '../actions/usersActions';

const NewUserForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // useDispatch hook to dispatch an action creator
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(firstName, LastName)

    dispatch(createUserRequest({ firstName, lastName }));

    setFirstName('');
    setLastName('');
  };

  return (
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
