import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  EmailField,
  DeleteButton,
  Filter,
  SearchInput,
  DateField,
} from 'react-admin';

const UserFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="email" />
    <SearchInput source="nom" />
    <SearchInput source="prenom" />
  </Filter>
);

const UserList = (props) => {
  return (
    <List {...props} filters={<UserFilter />}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="prenom" />
        <TextField source="nom" />
        <TextField source="is_admin" />
        <EmailField source="email" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
        <EditButton basepath="users" />
        <DeleteButton basepath="users" />
      </Datagrid>
    </List>
  );
};

export default UserList;
