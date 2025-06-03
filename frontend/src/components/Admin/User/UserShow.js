import {
  BooleanField,
  DateField,
  EmailField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';
import React from 'react';

const UserShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="password" />
        <TextField source="nom" />
        <TextField source="prenom" />
        <BooleanField source="is_admin" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
      </SimpleShowLayout>
    </Show>
  );
};

export default UserShow;
