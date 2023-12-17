import { Show, SimpleShowLayout, TextField , FunctionField} from 'react-admin';
import React from 'react';

const ProductShow = () => {

    const ImageField = (props) => <FunctionField {...props}
    
        render={record =>

            <img
                src={`http://localhost:3000/public/upload/products/${record.image}`}
                style={{width: '200px', height: '200px'}}
                alt={'ProductIMG'}
            />
        }
   />

    return (
        <Show>
            <SimpleShowLayout>
            <TextField source='id' />
            <TextField source='name' />
            <TextField source='description' />
            <TextField source='prix' />
            <TextField source='genre' />
            <TextField source='marque' />
            <ImageField/>
            </SimpleShowLayout>
        </Show>
    )
};

export default ProductShow;