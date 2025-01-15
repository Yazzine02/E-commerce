import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5273/api/Orders/GetOrders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API Response:', response.data);
            setOrders(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!orderId) {
            console.error('Invalid order ID');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5273/api/Orders/DeleteOrder?Id=${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setOrders(orders.filter(order => order.id !== orderId));
            setError(null);
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Failed to delete order. Please try again later.');
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
        },
        title: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
        },
        error: {
            color: '#dc3545',
            textAlign: 'center',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
        },
        loading: {
            textAlign: 'center',
            padding: '20px',
            color: '#666',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            margin: '20px 0',
            backgroundColor: '#fff',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
        },
        th: {
            padding: '12px 15px',
            textAlign: 'left',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#f8f9fa',
            color: '#333',
            textTransform: 'uppercase',
            fontSize: '14px',
        },
        td: {
            padding: '12px 15px',
            textAlign: 'left',
            borderBottom: '1px solid #ddd',
        },
        button: {
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#dc3545',
            color: 'white',
            transition: 'background-color 0.3s ease',
        },
        noData: {
            textAlign: 'center',
            padding: '20px',
            color: '#666',
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
            <div style={styles.container}>
                <h1 style={styles.title}>Orders Management</h1>
                {error && <div style={styles.error}>{error}</div>}
                {loading ? (
                    <div style={styles.loading}>Loading orders...</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>User ID</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={`order-${order.id}`}>
                                        <td style={styles.td}>{order.Id}</td>
                                        <td style={styles.td}>{order.CustomerId}</td>
                                        <td style={styles.td}>{formatDate(order.OrderDate)}</td>
                                        <td style={styles.td}>
                                            {typeof order.Total === 'number'
                                                ? `${order.Total.toFixed(2)} DH`
                                                : '0.00 DH'}
                                        </td>
                                        <td>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.button}
                                                onClick={() => handleDeleteOrder(order.Id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={styles.noData}>
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        
    );
};

export default OrdersPage;