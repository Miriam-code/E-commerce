import React from 'react';
import {
  BooleanInput,
  Edit,
  NumberInput,
  PasswordInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

const UserEdits = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <NumberInput source="id" disabled />
        <TextInput source="prenom" />
        <TextInput source="nom" />
        <TextInput source="email" />
        <PasswordInput source="password" />
        <BooleanInput source="is_admin" />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdits;
