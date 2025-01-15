import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import DealsSection from './components/DealsSection';
import { CartProvider } from './components/CartContext.js';
import { Cart } from './components/Cart.js';
import LoginPage from './components/LoginPage';
import AdminHome from './components/AdminHome';
import AdminCategories from './components/AdminCategories';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';

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
                        <Route path="/admin" element={<AdminHome />} />
                        <Route path="/adminCategories" element={<AdminCategories/> }/>
                        <Route path="/adminProducts" element={<AdminProducts/> }/>
                        <Route path="/adminOrders" element={<AdminOrders/> }/>
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
