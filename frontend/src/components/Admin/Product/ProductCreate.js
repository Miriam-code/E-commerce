import React from 'react';
import { Create, SimpleForm, TextInput, FileInput, ImageField } from 'react-admin';
import axios from 'axios'; 

const ProductCreate = (props) => {

  const handleCreate = async (data) => {

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('prix', data.prix);
    formData.append('genre', data.genre);
    formData.append('marque', data.marque);

    // Ajoutez le fichier image au FormData
    if (data.image && data.image.rawFile) {

      formData.append('image', data.image.rawFile);
    }

    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:3000/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });


    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleCreate}>
        <TextInput source="name" />
        <TextInput source="description" />
        <TextInput source="prix" />
        <TextInput source="genre" />
        <TextInput source="marque" />
        <FileInput source="image" label="Image" accept="image/*">
          <ImageField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default ProductCreate;








