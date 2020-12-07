import React from 'react';

import NewUserForm from './components/NewUserForm';
import UsersList from './components/UsersList';

function App() {
  return (
    // To make your element able to adapt to screens and windows of various sizes
    // without adding a horizontal scrollbar, you need to understand the usage of
    // two more properties: max-width and min-width. Both of these properties override the fixed width.
    // The CSS max-width property defines the widest possible point for a responsive element,
    // which means it can get narrower but never wider than specified value - 600px
    // CSS min-width works in an exact opposite manner: it specifies the narrowest possible point.
    // An element can get as wide as it needs to, but never smaller than defined by the value of min-width.
    <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
      <h1>Saga User List App</h1>

      <NewUserForm />
      <UsersList />
    </div>
  );
}

export default App;
