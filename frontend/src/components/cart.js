import React, { useContext } from 'react';
import { useState } from 'react';
import { CartContext } from '../AuthContext/Usercontext';
import env from 'react-dotenv';
import { BiCartAlt } from 'react-icons/bi';

const Cart = () => {
  const { cart, updateCart } = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(false);

  const total = cart.reduce((acc, product) => {
    const prixAsNumber = parseFloat(product.prix);

    if (!isNaN(prixAsNumber)) {
      return acc + prixAsNumber * product.amount;
    } else {
      console.error(`Le prix "${product.prix}" n'est pas un nombre valide.`);
      return acc;
    }
  }, 0);

  return isOpen ? (
    <div className="lmj-cart">
      <button
        className="lmj-cart-toggle-button"
        onClick={() => setIsOpen(false)}
      >
        Fermer
      </button>
      {cart.length > 0 ? (
        <div className="cart">
          <h2>Panier</h2>
          <ul>
            {cart.map(({ id, name, image, prix, amount }) => (
              <div key={`${id}`} className="cart-items">
                <img
                  src={`${env.API_URL}/public/upload/products/${image}`}
                  alt="productIMG"
                />
                <p>
                  {name} {prix} € x {amount}
                </p>
              </div>
            ))}
          </ul>
          <h3>Total :{total}€</h3>
          <button onClick={() => updateCart([])}>Vider le panier</button>
        </div>
      ) : (
        <div className="vide">
          <h2>Panier</h2>
          <p>Votre panier est vide</p>
        </div>
      )}
    </div>
  ) : (
    <div className="lmj-cart-closed">
      <button
        className="lmj-cart-toggle-button"
        onClick={() => setIsOpen(true)}
      >
        <BiCartAlt />
      </button>
    </div>
  );
};

export default Cart;
