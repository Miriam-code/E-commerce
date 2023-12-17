import React, { createContext, useState } from 'react';
import { getUserInfo } from '../api/auth';

const UserContext = createContext();
const CartContext = createContext();

const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [cart, updateCart] = useState([]); 
    
    // récuperer les données de l'user 

    const saveUser = async () => {
        
        const token = localStorage.getItem('token');

        await getUserInfo(token)
        .then((data) => {
            
            setUser(data);
        })
        .catch((e) => {
            console.log(e);
        })
    }

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token');
;
    }

    // panier

    const addToCart = (id , name, prix , image ) => {

        const currentProductSaved = cart.find((product) => product.name === name)
  
        if (currentProductSaved) {
  
          const cartFilteredCurrentProduct = cart.filter(
            (product) => product.name !== name
          )
          updateCart([
            ...cartFilteredCurrentProduct,
            {id , name, image ,prix, amount: currentProductSaved.amount + 1 }         
          ]) 
          
        } else {
          updateCart([...cart, { id,name,image,prix, amount: 1 }])
          
        }
    }

    return (
        <UserContext.Provider value={{ user, saveUser, logoutUser }}>
            <CartContext.Provider value={{ addToCart,cart, updateCart }}>
                {children}
            </CartContext.Provider>
        </UserContext.Provider>
    )
}

export { UserContext , UserProvider , CartContext  }