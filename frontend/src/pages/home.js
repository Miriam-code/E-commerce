import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../api/product';
import env from 'react-dotenv';
import Modal from '../components/modal';
import montre from '../img/montre.png';
import Footer from '../components/footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [openProductModals, setOpenProductModals] = useState({});

  useEffect(() => {
    getProducts()
      .then((allProducts) => {
        const newproducts = allProducts.slice(0, 4);
        setProducts(newproducts);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  //afficher le bon produit dans le modal
  const handleOpenModal = (productId) => {
    // Mettez à jour l'état local pour ouvrir le modal spécifique à cet article
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
    <div>
      <div className="banner-paralax">
        <h2 id="paralax">LE LUXE ACCESSIBLE À TOUS ! </h2>
      </div>

      <div className="collection">
        <NavLink to="/homme">
          <button className="btn-12">
            <span>Collection Homme &rarr;</span>
          </button>
        </NavLink>
        <NavLink to="/femme">
          <button className="btn-12">
            <span>Collection Femme &rarr;</span>
          </button>
        </NavLink>
      </div>
      <h1 className="content__title">Nouvelle Collection été </h1>
      <h3 className="content__author">2025</h3>
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
      <div className="qui">
        <div className="cont">
          <h2>QUI SOMMES-NOUS?</h2>
          <p>
            Watch Brussels est une entreprise spécialisée dans la vente de
            montres de luxe. Nous proposons une réduction allant de 50% à 70% du
            prix initial. Nous collaborons avec les fournisseurs des marques, ce
            qui nous permet de proposer des prix cassés à notre clientèle. Tous
            nos produits sont 100% authentiques et certifiés.
          </p>
          <h2>NOS SERVICES</h2>
          <p>
            Chaque montre est fournie avec : - Son certificat d'authenticité -
            Une facture - Une garantie de 2 ans sur le mécanisme à dater du jour
            de l'achat (voir conditions sur le certificat d'authenticité)
          </p>
        </div>
        <img src={montre} alt="montre" />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
