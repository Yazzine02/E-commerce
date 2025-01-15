import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        Id: '',
        Name: '',
        Description: '',
        Price: '',
        ImageUrl: '',
        CategoryId: '',
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5273/api/Products/all', {
                methog: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5273/api/Categories/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories. Please try again later.');
        }
    };

    const handleAddProduct = async (e) => {
        try {
            const productData = new URLSearchParams({
                Name: newProduct.Name,
                Description: newProduct.Description,
                Price: parseFloat(newProduct.Price),
                ImageUrl: newProduct.ImageUrl,
                CategoryId: parseInt(newProduct.CategoryId),
            });

            const response = await fetch(`http://localhost:5273/api/Products/Add?${productData}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setNewProduct({
                Id: '',
                Name: '',
                Description: '',
                Price: '',
                ImageUrl: '',
                CategoryId: '',
            });
            fetchProducts();
        } catch (error) {
            setError('Failed to add product. Please try again.');
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = async (product) => {
        try {
            const editData = new URLSearchParams({
                Id: product.Id,
                Name: product.Name,
                Description: product.Description,
                Price: product.Price,
                ImageUrl: product.ImageUrl,
                CategoryId: product.CategoryId,
            });

            const response = await fetch(
                `http://localhost:5273/api/Products/Update?${editData}`,
                {
                    method: 'PUT',
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            setError('Failed to edit product. Please try again.');
            console.error('Error editing product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(
                    `http://localhost:5273/api/Products/Delete?Id=${productId}`,
                    {
                        method: 'DELETE',
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                fetchProducts();
            } catch (error) {
                setError('Failed to delete product. Please try again.');
                console.error('Error deleting product:', error);
            }
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setNewProduct({
            Id: '',
            Name: '',
            Description: '',
            Price: '',
            ImageUrl: '',
            CategoryId: '',
        });
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

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
            < Sidebar />
            {/* Main Content */}
            <div className="categories-page">
                <h1>Products Management</h1>

                {error && (
                    <div className="notification error">
                        {error}
                    </div>
                )}

                <div className="table-container">
                    {products.length === 0 ? (
                        <p className="no-data">No products found</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.Id}>
                                        <td>{product.Name}</td>
                                        <td>{product.Description}</td>
                                        <td>{product.Price} DH</td>
                                        <td>{product.CategoryId?.Name}</td>
                                        <td>
                                            {product.ImageUrl && (
                                                <img
                                                    src={product.ImageUrl}
                                                    alt={product.Name}
                                                    className="category-image"
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn edit-btn"
                                                onClick={() => setEditingProduct(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn delete-btn"
                                                onClick={() => handleDeleteProduct(product.Id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <div className="form-container">
                    <form onSubmit={handleAddProduct}>
                        <div className="form-group">
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={editingProduct ? editingProduct.Name : newProduct.Name}
                                    onChange={(e) =>
                                        editingProduct
                                            ? setEditingProduct({ ...editingProduct, Name: e.target.value })
                                            : setNewProduct({ ...newProduct, Name: e.target.value })
                                    }
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Description:
                                <textarea
                                    value={editingProduct ? editingProduct.Description : newProduct.Description}
                                    onChange={(e) =>
                                        editingProduct
                                            ? setEditingProduct({ ...editingProduct, Description: e.target.value })
                                            : setNewProduct({ ...newProduct, Description: e.target.value })
                                    }
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Price:
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingProduct ? editingProduct.Price : newProduct.Price}
                                    onChange={(e) =>
                                        editingProduct
                                            ? setEditingProduct({ ...editingProduct, Price: e.target.value })
                                            : setNewProduct({ ...newProduct, Price: e.target.value })
                                    }
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Image URL:
                                <input
                                    type="text"
                                    value={editingProduct ? editingProduct.ImageUrl : newProduct.ImageUrl}
                                    onChange={(e) =>
                                        editingProduct
                                            ? setEditingProduct({ ...editingProduct, ImageUrl: e.target.value })
                                            : setNewProduct({ ...newProduct, ImageUrl: e.target.value })
                                    }
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Category:
                                <select
                                    value={editingProduct ? editingProduct.CategoryId : newProduct.CategoryId}
                                    onChange={(e) =>
                                        editingProduct
                                            ? setEditingProduct({ ...editingProduct, CategoryId: e.target.value })
                                            : setNewProduct({ ...newProduct, CategoryId: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.Id} value={category.Id}>
                                            {category.Name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="button-group">
                            {editingProduct && (
                                <button type="button" className="btn" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn primary-btn"
                                onClick={() => editingProduct ? handleEditProduct(editingProduct) : handleAddProduct()}
                            >
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
        </div>
        

            <style jsx>{`
                /* Page Layout */
                .categories-page {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                }

                .loading {
                    text-align: center;
                    padding: 20px;
                    font-size: 18px;
                    color: #666;
                }

                .no-data {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-style: italic;
                }

                h1, h2 {
                    color: #333;
                    margin-bottom: 20px;
                }

                /* Table Styles */
                .table-container {
                    margin-bottom: 30px;
                    overflow-x: auto;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: white;
                }

                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }

                th {
                    background-color: #f8f9fa;
                    color: #333;
                    font-weight: bold;
                }

                tr:hover {
                    background-color: #f5f5f5;
                }

                /* Image Styles */
                .category-image {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 4px;
                }

                /* Button Styles */
                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 8px;
                    font-weight: 500;
                    transition: background-color 0.3s ease;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .edit-btn {
                    background-color: #007bff;
                    color: white;
                }

                .edit-btn:hover {
                    background-color: #0056b3;
                }

                .delete-btn {
                    background-color: #dc3545;
                    color: white;
                }

                .delete-btn:hover {
                    background-color: #c82333;
                }

                /* Form Styles */
                .form-container {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #333;
                    font-weight: 500;
                }

                input, textarea, select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }

                input:focus, textarea:focus, select:focus {
                    border-color: #007bff;
                    outline: none;
                }

                textarea {
                    height: 100px;
                    resize: vertical;
                }

                .primary-btn {
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    font-size: 16px;
                }

                .primary-btn:hover {
                    background-color: #218838;
                }

                .button-group {
                    margin-top: 20px;
                    text-align: right;
                }

                /* Notification Styles */
                .notification {
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    font-weight: 500;
                }

                .notification.error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .categories-page {
                        padding: 10px;
                    }

                    th, td {
                        padding: 8px;
                    }

                    .btn {
                        padding: 6px 12px;
                        font-size: 14px;
                    }

                    .category-image {
                        width: 40px;
                        height: 40px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductsPage;