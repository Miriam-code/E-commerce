import React from 'react';
import {
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  FileInput,
  FunctionField,
  ImageField,
} from 'react-admin';
import axios from 'axios';

const UserEdits = (props) => {
  const ImageF = (props) => (
    <FunctionField
      {...props}
      render={(record) => (
        <img
          src={`http://localhost:3000/public/upload/products/${record.image}`}
          style={{ width: '100px', height: '100px' }}
          alt="ProductIMG"
        />
      )}
    />
  );

  const handleUpdate = async (data) => {
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
      await axios.put(`http://localhost:3000/product/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleUpdate}>
        <NumberInput source="id" disabled />
        <TextInput source="name" />
        <TextInput source="description" />
        <TextInput source="prix" />
        <TextInput source="genre" />
        <TextInput source="marque" />
        <ImageF source="image" />
        <FileInput source="image" label="Image">
          <ImageField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  );
};

export default UserEdits;
