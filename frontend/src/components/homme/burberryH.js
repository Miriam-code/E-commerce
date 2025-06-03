import React from 'react';
import { useEffect, useState } from 'react';
import { getProducts } from '../../api/product';
import env from 'react-dotenv';
import Modal from '../modal';
import Footer from '../footer';

function BurberryH() {
  const [products, setProducts] = useState([]);
  const [openProductModals, setOpenProductModals] = useState({});

  useEffect(() => {
    getProducts()
      .then((allProducts) => {
        const filteredProducts = allProducts.filter(
          (product) =>
            product.genre === 'homme' && product.marque === 'burberry',
        );
        setProducts(filteredProducts);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleOpenModal = (productId) => {
    // Mettez à jour l'état pour ouvrir le modal spécifique à cet article
    setOpenProductModals((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };

  const handleCloseModal = (productId) => {
    // Mettez à jour l'état local pour fermer le modal spécifique à cet article
    setOpenProductModals((prevState) => ({
      ...prevState,
      [productId]: false,
    }));
  };

  return (
    <>
      <div className="banner-paralax">
        <h2>BURBERRY / HOMME </h2>
      </div>

      <section>
        {products && products.length > 0
          ? products.map((product) => {
              const isModalOpen = openProductModals[product.id] || false;

              return (
                <div className="cardprod" key={product.id}>
                  <img
                    src={`${env.API_URL}/public/upload/products/${product.image}`}
                    alt="productIMG"
                  />
                  <div className="cardcontent">
                    <h3>{product.name}</h3>
                    <p>{product.prix}€</p>
                  </div>
                  <button onClick={() => handleOpenModal(product.id)}>
                    Voir détails
                  </button>
                  <Modal
                    open={isModalOpen}
                    onClose={() => handleCloseModal(product.id)}
                    product={product}
                  ></Modal>
                </div>
              );
            })
          : null}
      </section>
      <Footer />
    </>
  );
}

export default BurberryH;
