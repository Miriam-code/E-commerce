import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from '../components/Admin/AuthProvider';
import simpleRestProvider from 'ra-data-simple-rest';
import AdminLoginPage from '../components/Admin/AdminloginPage';

// USERS
import UserList from '../components/Admin/User/UserList';
import UserEdits from '../components/Admin/User/UserEdits';
import UserShow from '../components/Admin/User/UserShow.js';
import UserCreate from '../components/Admin/User/UserCreate';

//PRODUCTS
import ProductList from '../components/Admin/Product/ProductList';
import ProductEdits from '../components/Admin/Product/ProductEdits';
import ProductShow from '../components/Admin/Product/ProductShow';
import ProductCreate from '../components/Admin/Product/ProductCreate';

//ORDERS
import OrdersList from '../components/Admin/Orders/OrdersList';
import OrdersShow from '../components/Admin/Orders/OrdersShow';

//ORDERS ITEMS
import OrdersItemsList from '../components/Admin/OrdersItems/OrdersItemsList';
import OrdersItemsShow from '../components/Admin/OrdersItems/OrdersItemsShow';


const AdminPage = () => {

  const dataProvider = simpleRestProvider('http://localhost:3000/admin')

  return (
      <Admin
          basename="/admin"
          dataProvider={dataProvider}
          authProvider={authProvider}
          loginPage={AdminLoginPage}
      >
        <Resource name='users' options={{label: 'Users'}} list={UserList} edit={UserEdits} show={UserShow} create={UserCreate}/>
        <Resource name='products' options={{label:'All Products'}} list={ProductList} edit={ProductEdits} show={ProductShow} create={ProductCreate}/>
        <Resource name='orders' options={{label:'Orders'}} list={OrdersList} show={OrdersShow}/>
        <Resource name='ordersItems' options={{label:'Orders Items'}} list={OrdersItemsList} show={OrdersItemsShow}/>
      </Admin>
  )
}

export default AdminPage;