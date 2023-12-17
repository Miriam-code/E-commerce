import React , { useContext } from 'react';
import env from 'react-dotenv';
import { CartContext } from '../AuthContext/Usercontext';

const Modal = ({ open, onClose, product }) => {

  const { addToCart } = useContext(CartContext); 

    if (!open) return null;

    function handleAddToCart(id, name, prix, image) {
      addToCart(id , name, prix , image ); // Utilisez la fonction addToCart du contexte pour ajouter un produit au panier
      onClose();
    }

    return (

      <div onClick={onClose} className='overlay' >

        <div onClick={(e) => {e.stopPropagation();}} className='modalContainer'>

          <img src={`${env.API_URL}/public/upload/products/${product.image}`} alt='productIMG'  />
          
          <div className='modalRight'>

            <p className='closeBtn' onClick={onClose}>
              X
            </p>

            <div className='contenut'>
              <h3>{product.name}</h3>
              <p>{product.prix}€</p>
              <p>{product.description}</p>
            </div>

            <div className='btnContainer'>

            <button variant="secondary" onClick={onClose}>NO</button>
            <button variant="danger" onClick={() => handleAddToCart( product.id , product.name, product.prix , product.image )} >AJOUTER PANIER</button>
            
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;