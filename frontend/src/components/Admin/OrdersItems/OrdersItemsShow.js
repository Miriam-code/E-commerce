import { DateField, Show, SimpleShowLayout, TextField } from 'react-admin';
import React from 'react';

const OrdersItemsShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="orderId" />
        <TextField source="productId" />
        <TextField source="quantity" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
      </SimpleShowLayout>
    </Show>
  );
};

export default OrdersItemsShow;
