import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './App.css';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';
import Profile from './pages/profile';
//FEMME
import Femme from './pages/femme';
import ArmaniF from './components/femme/armaniF';
import BossF from './components/femme/bossF';
import BurberryF from './components/femme/burberryF';
import MkF from './components/femme/mkF';
//HOMME
import Homme from './pages/homme';
import MkH from './components/homme/mkH';
import BurberryH from './components/homme/burberryH';
import BossH from './components/homme/bossH';
import ArmaniH from './components/homme/armaniH';
//PANIER
import Panier from './pages/panier';
import CustomNavbar from './components/navbar';
import { UserContext } from './AuthContext/Usercontext';
import Cart from './components/cart';

const RoutesApp = () => {
  const { saveUser } = useContext(UserContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      saveUser();
    }
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <CustomNavbar />
      {currentPath !== '/panier' && <Cart />}
      <Routes>
        <Route path="/register" element={token ? <Home /> : <Register />} />
        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/femme" element={<Femme />} />
        <Route path="/armaniF" element={<ArmaniF />} />
        <Route path="/bossF" element={<BossF />} />
        <Route path="/burberryF" element={<BurberryF />} />
        <Route path="/mkF" element={<MkF />} />
        <Route path="/homme" element={<Homme />} />
        <Route path="/armaniH" element={<ArmaniH />} />
        <Route path="/bossH" element={<BossH />} />
        <Route path="/burberryH" element={<BurberryH />} />
        <Route path="/mkH" element={<MkH />} />
        <Route path="/panier" element={<Panier />} />
      </Routes>
    </>
  );
};

export default RoutesApp;
