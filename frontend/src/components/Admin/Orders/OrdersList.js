import React from 'react'
import { List, Datagrid, TextField, EditButton, DeleteButton, Filter, SearchInput, DateField} from 'react-admin';

const OrdersFilter = props => (
  <Filter {...props}>
    <SearchInput source="id" />
    <SearchInput source="userId" />
    <SearchInput source="status" />
  </Filter>
);

const OrdersList = (props) => {  
  return (
    
    <List {... props} filters={<OrdersFilter />} >
      <Datagrid rowClick="show">
      <TextField source='id'/>
        <TextField source='userId'/>
        <TextField source='total' />
        <TextField source='status' />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
        <EditButton basepath='orders'/>
        <DeleteButton basepath='orders'/>
      </Datagrid>
    </List>
  )
}

export default OrdersList;