import React from 'react'

import { List, Datagrid, TextField, EditButton, DeleteButton, Filter, SearchInput, DateField} from 'react-admin';

const ItemsFilter = props => (
  <Filter {...props}>
    <SearchInput source="id"/>
    <SearchInput source="orderId" />
    <SearchInput source="createdAt"/>
    <SearchInput source="updatedAt"/>
  </Filter>
);

const OrdersItemsList = (props) => {  
  return (
    
    <List {... props} filters={<ItemsFilter />} >
      <Datagrid rowClick="show">
        <TextField source='id'/>
        <TextField source='orderId'/>
        <TextField source='productId' />
        <TextField source='quantity' />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
        <EditButton basepath='ordersItems'/>
        <DeleteButton basepath='ordersItems'/>
      </Datagrid>
    </List>
  )
}

export default OrdersItemsList;