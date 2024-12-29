import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Header from './components/Header';
import DealsSection from './components/DealsSection';
import { Cart } from './components/Cart';
import LoginPage from './components/LoginPage'; // Importez le composant LoginPage

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<DealsSection />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginPage />} /> {/* Ajoutez la route pour la page d'authentification */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
