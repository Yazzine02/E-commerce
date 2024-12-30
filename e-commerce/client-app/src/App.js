import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DealsSection from './components/DealsSection';
import { CartProvider } from './components/CartContext.js';
import { Cart } from './components/Cart.js';
import LoginPage from './components/LoginPage';

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/" element={<DealsSection />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;