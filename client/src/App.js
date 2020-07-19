import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import dataProvider from './dataProvider';

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="items" list={ListGuesser} />
    </Admin>
  );
}

export default App;
