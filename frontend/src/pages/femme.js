import React from 'react';
import { NavLink } from 'react-router-dom';
import armani from '../img/marques/armani.png'
import boss from '../img/marques/boss.png'
import burberry from '../img/marques/burberry.png'
import mk from '../img/marques/mk.png'
import Footer from '../components/footer';

const Femme = () => {
  
    return (

      <>

      <div className="banner-paralax">
        <h2>FEMME</h2>
      </div>

      <div className='collection'>

        <div className="card">
        <div className="bg">
          <NavLink to="/armaniF"exact="true"> <img src={armani} alt='logoBrand'/></NavLink>
        </div>
        <div className="blob"></div>
        </div>

        <div className="card">
        <div className="bg">
          <NavLink to="/bossF"exact="true"> <img src={boss} alt='logoBrand'/> </NavLink>
        </div>
        <div className="blob"></div>
        </div>

        <div className="card">
        <div className="bg">
          <NavLink to="/burberryF"exact="true"> <img src={burberry} alt='logoBrand'/></NavLink>
        </div>
        <div className="blob"></div>
        </div>

        <div className="card">
        <div className="bg">
          <NavLink to="/mkF"exact="true"> <img src={mk}alt='logoBrand'/> </NavLink>
        </div>
        <div className="blob"></div>
        </div>

      </div>
      <Footer/>

      </>

  
    );
  };
  
  export default Femme;