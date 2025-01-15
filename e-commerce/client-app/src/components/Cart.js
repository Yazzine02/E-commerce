import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom'; // For navigation

export function Cart() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const [cartTotal, setCartTotal] = useState(0); // Initialize cart total to 0
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is logged in
    const [userRole, setUserRole] = useState(null); // Role of the user

    const navigate = useNavigate();

    // Mock authentication check
    useEffect(() => {
        const role = localStorage.getItem('role'); // Replace with your JWT or auth token
        if (role) {
            setUserRole(role);
            if (role !== 'customer') {
                alert('Only customers can access the cart.');
                navigate('/login');
            }
            if (role == 'customer') {
                setIsAuthenticated(true);
            }
        }
    }, [navigate]);

    // Recalculate the total whenever cartItems change
    useEffect(() => {
        console.log('Cart Items:', cartItems); // Check for issues here
        const total = cartItems
            .filter((item) => !isNaN(item.price) && !isNaN(item.quantity)) // Exclude invalid data
            .reduce((sum, item) => sum + item.price * item.quantity, 0); // Calculate total
        setCartTotal(total);
    }, [cartItems]);

    // Handle the purchase action
    const handlePurchase = async () => {
        if (!isAuthenticated) {
            alert('You must be logged in to make a purchase.');
            navigate('/login'); // Redirect to login page
            return;
        }
        if (userRole !== 'customer') {
            alert('Only customers can make purchases.');
            return;
        }

        const userId = localStorage.getItem('userId');

        const orderRequest = {
            customerId: userId, // Replace with logged-in user's ID
            total: cartTotal,
            products: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        try {
            const response = await fetch('http://localhost:5273/api/Orders/CreateOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderRequest),
            });

            if (response.ok) {
                alert('Order placed successfully!');
            } else {
                const error = await response.text();
                alert(`Failed to place order: ${error}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again later.');
        }

    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 m-4">
                <h2 className="text-2xl font-bold mb-4">Panier</h2>
                <p className="text-gray-500">Votre panier est vide</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-4">
            <h2 className="text-2xl font-bold mb-4">Panier</h2>
            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col border-b pb-4">
                        <div className="flex items-center justify-between">
                            {/* Image on the left */}
                            <div className="flex items-center w-1/3">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </div>

                            {/* Title and description on the right */}
                            <div className="ml-4 w-2/3">
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-gray-600">
                                    {item.price}dh × {item.quantity}
                                </p>
                            </div>
                        </div>

                        {/* Quantity and remove options */}
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() =>
                                        updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                                    } // Ensure quantity is at least 1
                                    className="px-3 py-1 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 border-x">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-3 py-1 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>{cartTotal}dh</span>
                </div>
                <button
                    className="w-full mt-4 bg-blue-600 text-white text-lg font-bold py-3 px-5 rounded hover:bg-blue-700"
                    onClick={handlePurchase}
                >
                    Commander
                </button>
            </div>
        </div>
    );
}
