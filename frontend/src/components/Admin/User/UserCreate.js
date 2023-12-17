import React from 'react'
import { BooleanInput, Create, PasswordInput, SimpleForm, TextInput } from 'react-admin'

const UserCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
          <TextInput source='prenom' />
          <TextInput source='nom' />
          <TextInput source='email' />
          <PasswordInput source='password'/>
          <BooleanInput source='is_admin'/>
      </SimpleForm>
    </Create>
  )
}

export default UserCreate;