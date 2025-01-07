import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import DealsSection from './components/DealsSection';
import { CartProvider } from './components/CartContext.js';
import { Cart } from './components/Cart.js';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage'; // Create an admin page component

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
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
