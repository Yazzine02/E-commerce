import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import DealsSection from './components/DealsSection';
import { CartProvider } from './components/CartContext.js';
import { Cart } from './components/Cart.js';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage'; // Create an admin page component

// Authentication guard
const PrivateRoute = ({ element, allowedRoles }) => {
    const role = localStorage.getItem('role');
    return allowedRoles.includes(role) ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/" element={<DealsSection />} />
                        <Route path="/cart" element={<PrivateRoute element={<Cart />} allowedRoles={['customer']} />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin" element={<PrivateRoute element={<AdminPage />} allowedRoles={['admin']} />} />
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
