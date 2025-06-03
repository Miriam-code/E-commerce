import React, { useContext, useState } from 'react';
import { CartContext } from '../AuthContext/Usercontext';
import { UserContext } from '../AuthContext/Usercontext';
import env from 'react-dotenv';
import { createOrder } from '../api/order';
import Footer from '../components/footer';

function Panier() {
  const { cart, updateCart } = useContext(CartContext);

  const total = cart.reduce((acc, product) => {
    const prixAsNumber = parseFloat(product.prix);

    if (!isNaN(prixAsNumber)) {
      return acc + prixAsNumber * product.amount;
    } else {
      console.error(`Le prix "${product.prix}" n'est pas un nombre valide.`);
      return acc;
    }
  }, 0);

  const { user } = useContext(UserContext);

  // État pour gérer l'affichage du message de confirmation
  const [commandeValidee, setCommandeValidee] = useState(false);

  const handleValiderPanier = async (event) => {
    event.preventDefault();

    const products = cart.map((product) => ({
      productId: product.id, // Remplacez ceci par l'ID du produit
      quantity: product.amount,
      prix: product.prix,
    }));

    const userId = user.id;

    try {
      await createOrder(products, userId).then((data) => {
        setCommandeValidee(true);
        updateCart([]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="banner-paralax">
        <h2> PANIER </h2>
      </div>

      {cart.length > 0 ? (
        <form className="cart" onSubmit={handleValiderPanier}>
          <h2> VOTRE PANIER </h2>
          <ul>
            {cart.map(({ id, name, image, prix, amount }) => (
              <div key={`${id}`} className="cart-items">
                <img
                  src={`${env.API_URL}/public/upload/products/${image}`}
                  alt="productIMG"
                />
                <p>
                  {name} | quantité : {amount} | prix unitaire : {prix} €{' '}
                </p>
              </div>
            ))}
          </ul>
          <h3>Total :{total}€</h3>
          <div className="collection">
            <button onClick={() => updateCart([])}>Vider le panier</button>
            <button type="submit"> Valider panier</button>
          </div>
        </form>
      ) : (
        <div className="carta">
          {commandeValidee ? (
            <h2>Votre commande est validée ! </h2>
          ) : (
            <h2>Votre panier est vide</h2>
          )}
        </div>
      )}
      <Footer />
    </>
  );
}

export default Panier;
