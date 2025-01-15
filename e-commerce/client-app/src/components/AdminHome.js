import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories when the component is mounted
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5273/api/Categories/all'); // Vérifiez l'URL de votre API

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCategories(data); // Assurez-vous que les données sont bien structurées
        } catch (error) {
            setError('Impossible de charger les catégories. Veuillez réessayer plus tard.');
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const Sidebar = () => (
        <div style={{ width: '250px', backgroundColor: '#343a40', color: 'white', padding: '15px', height: '100vh' }}>
            <h2>Medical App</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link to="/adminCategories" style={{ color: 'white', textDecoration: 'none' }}>Categories</Link></li>
                <li><Link to="/adminProducts" style={{ color: 'white', textDecoration: 'none' }}>Products</Link></li>
                <li><Link to="/adminOrders" style={{ color: 'white', textDecoration: 'none' }}>Orders</Link></li>
            </ul>
        </div>
    );

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <div style={{ fontSize: '24px', color: '#007bff' }}>Chargement...</div>
                    </div>
                ) : error ? (
                    <div style={{ margin: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
                        <strong>Erreur :</strong> {error}
                    </div>
                ) : (
                    <div>
                        <h1>Categories:</h1>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.Id}>{category.Name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
