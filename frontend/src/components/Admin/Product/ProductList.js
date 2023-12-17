import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Filter,
  SearchInput,
  FunctionField
} from 'react-admin';

const ProductFilter = props => (
  <Filter {...props}>
    <SearchInput source="id" />
    <SearchInput source="prix" />
    <SearchInput source="genre" />
    <SearchInput source="marque" />
  </Filter>
);

const ProductList = (props) => {  

  const ImageField = (props) => <FunctionField {...props}
    
        render={record =>

            <img
                src={`http://localhost:3000/public/upload/products/${record.image}`}
                style={{width: '100px', height: '100px'}}
                alt={'ProductIMG'}
            />
        }
  />


  return (

    <>
    <h2>All Products</h2>
    <List {... props} filters={<ProductFilter />} >
      <Datagrid rowClick="show">
        <ImageField source='image' />
        <TextField source='genre' />
        <TextField source='marque' />
        <TextField source='name' />
        <TextField source='description' />
        <TextField source='prix' />
        <TextField source='id' />
        <EditButton basepath='products'/>
        <DeleteButton basepath='products'/>
      </Datagrid>
    </List>

    <h2>Homme</h2>

    <List {... props} title="/ Homme" filter={{genre: 'homme' }} filters={<ProductFilter />}> 
      <Datagrid rowClick="show">
        <ImageField source='image' />
        <TextField source='genre' />
        <TextField source='marque' />
        <TextField source='name' />
        <TextField source='description' />
        <TextField source='prix' />
        <TextField source='id' />
        <EditButton basepath='products'/>
        <DeleteButton basepath='products'/>
      </Datagrid>
    </List>

    <h2>Femme</h2>
    <List {... props} title="/ Femme" filter={{ genre: 'femme' }} filters={<ProductFilter />} >
      <Datagrid rowClick="show">
        <ImageField source='image' />
        <TextField source='genre' />
        <TextField source='marque' />
        <TextField source='name' />
        <TextField source='description' />
        <TextField source='prix' />
        <TextField source='id' />
        <EditButton basepath='products'/>
        <DeleteButton basepath='products'/>
      </Datagrid>
    </List>
  </>
  )
}


export default ProductList;