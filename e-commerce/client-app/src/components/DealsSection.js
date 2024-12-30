import React, { useState, useEffect } from 'react';
import '../styles/DealsSection.css';
import { useCart } from './CartContext';

const DealsSection = () => {
    const API_URL = "http://localhost:5273/";

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when a category is selected
    useEffect(() => {
        if (selectedCategory) {
            fetchProductsByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}api/Categories/GetCategories`);
            const data = await response.json();
            // Transform the data to match your UI structure
            const transformedCategories = data.map(category => ({
                id: category.Id.toString(),
                title: category.Name,
                img: category.ImageUrl
            }));
            setCategories(transformedCategories);
            setIsLoading(false);
        } catch (err) {
            setError('Error fetching categories');
            setIsLoading(false);
        }
    };

    const fetchProductsByCategory = async (categoryId) => {
        try {
            const response = await fetch(`${API_URL}api/Products/GetProductsByCategory/${categoryId}`);
            const data = await response.json();

            // Transform the data to match your UI structure
            const transformedProducts = data.map(product => ({
                id: product.id || product.Id,
                title: product.name || product.Name,
                img: product.imageUrl || product.ImageUrl,
                description: product.description || product.Description,
                price: product.price || product.Price,
            }));

            setProducts(prev => ({
                ...prev,
                [categoryId]: transformedProducts
            }));
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error fetching products');
        }
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedProduct(null);
    };

    // Rest of your existing handlers remain the same
    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleBackClick = () => {
        if (selectedProduct) {
            setSelectedProduct(null);
        } else {
            setSelectedCategory(null);
        }
    };

    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
        alert('Produit ajouté au panier !');
    };

    const handleViewCart = () => {
        alert('Panier: ' + cartItems.map(item => item.title).join(', '));
    };

    if (isLoading) {
        return <div className="min-h-screen p-6 bg-gray-100">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen p-6 bg-gray-100">Error: {error}</div>;
    }

    if (selectedProduct) {
        return (
            <div className="min-h-screen p-6 bg-gray-100">
                <button onClick={handleBackClick} className="btn btn-back mb-6">← Retour</button>

                <div className="product-detail-container">
                    <div className="product-image-container">
                        <img src={selectedProduct.img} alt={selectedProduct.title} className="product-image" />
                    </div>

                    <div className="product-info-container">
                        <h1 className="product-title">{selectedProduct.title}</h1>
                        <p className="product-description">{selectedProduct.description}</p>
                        <div className="product-price">{selectedProduct.price} DH</div>
                        <div className="mt-auto">
                            <button onClick={() => handleAddToCart(selectedProduct)} className="btn btn-primary w-full">Ajouter au panier</button>
                        </div>
                    </div>
                </div>

                {/* Button to view cart */}
                <button onClick={handleViewCart} className="btn btn-cart mt-6">Voir le panier</button>
            </div>
        );
    }

    if (selectedCategory) {
        return (
            <div className="min-h-screen p-6 bg-gray-100">
                <button onClick={handleBackClick} className="mb-6 text-blue-600 hover:text-blue-800 flex items-center">← Back</button>
                <div className="flex flex-wrap gap-6">
                    {products[selectedCategory]?.map((product, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition w-1/2 sm:w-1/3 lg:w-1/4" onClick={() => handleProductClick(product)}>
                            <img src={product.img} alt={product.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold">{product.title}</h3>
                                <p className="text-gray-600">{product.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <div className="flex flex-wrap gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition w-1/2 sm:w-1/3 lg:w-1/4" onClick={() => handleCategoryClick(category.id)}>
                        <img src={category.img} alt={category.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">{category.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={handleViewCart} className="btn btn-cart mt-6">Voir le panier</button>
        </div>
    );
};

export default DealsSection;