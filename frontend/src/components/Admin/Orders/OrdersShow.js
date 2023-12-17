import { DateField, Show, SimpleShowLayout, TextField } from 'react-admin';
import React from 'react';

const OrdersShow = () => {

    return (
        <Show>
            <SimpleShowLayout>
            <TextField source='id'/>
            <TextField source='userId'/>
            <TextField source='total' />
            <TextField source='status' />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            </SimpleShowLayout>
        </Show>
    )
};

export default OrdersShow;
