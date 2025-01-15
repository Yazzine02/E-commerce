import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        Name: '',
        Description: '',
        ImageUrl: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5273/api/Categories/all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const formattedCategories = data.map(category => ({
                Id: category.Id,
                Name: category.Name,
                Description: category.Description,
                ImageUrl: category.ImageUrl
            }));
            console.log('Formatted categories:', formattedCategories);
            setCategories(formattedCategories);
        } catch (error) {
            setError('Failed to fetch categories. Please try again later.');
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    };

    const resetForm = () => {
        setNewCategory({
            Name: '',
            Description: '',
            ImageUrl: '',
        });
        setEditingCategory(null);
    };

    const handleAddCategory = async () => {
        if (!newCategory.Name.trim()) {
            showNotification('error', 'Category name is required');
            return;
        }

        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                Name: newCategory.Name,
                Description: newCategory.Description,
                ImageUrl: newCategory.ImageUrl
            });

            const response = await fetch(`http://localhost:5273/api/Categories/Add?${queryParams}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (typeof data === 'string' && data.includes('Error')) {
                throw new Error(data);
            }

            showNotification('success', 'Category added successfully');
            resetForm();
            await fetchCategories();
        } catch (error) {
            showNotification('error', error.message || 'Failed to add category');
            console.error('Error adding category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setNewCategory({
            Name: category.Name,
            Description: category.Description,
            ImageUrl: category.ImageUrl,
        });
    };

    const handleEditCategory = async () => {
        if (!editingCategory || !newCategory.Name.trim()) {
            showNotification('error', 'Invalid category data');
            return;
        }

        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                Id: editingCategory.Id,
                Name: newCategory.Name,
                Description: newCategory.Description,
                ImageUrl: newCategory.ImageUrl
            });

            const response = await fetch(`http://localhost:5273/api/Categories/Update?${queryParams}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (typeof data === 'string' && data.includes('Error')) {
                throw new Error(data);
            }

            showNotification('success', 'Category updated successfully');
            resetForm();
            await fetchCategories();
        } catch (error) {
            showNotification('error', error.message || 'Failed to update category');
            console.error('Error editing category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5273/api/Categories/Delete?Id=${categoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (typeof data === 'string' && data.includes('Error')) {
                throw new Error(data);
            }

            showNotification('success', 'Category deleted successfully');
            await fetchCategories();
        } catch (error) {
            showNotification('error', error.message || 'Failed to delete category');
            console.error('Error deleting category:', error);
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
            <div className="categories-page">
                <h1>Categories</h1>

                {notification.message && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.Id}>
                                    <td>{category.Name}</td>
                                    <td>{category.Description}</td>
                                    <td>
                                        {category.ImageUrl && (
                                            <img
                                                src={category.ImageUrl}
                                                alt={category.Name}
                                                className="category-image"
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn edit-btn"
                                            onClick={() => handleEditClick(category)}
                                            disabled={isLoading}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn delete-btn"
                                            onClick={() => handleDeleteCategory(category.Id)}
                                            disabled={isLoading}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-container">
                    <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                    <div className="form-group">
                        <label>
                            Name:
                            <input
                                type="text"
                                value={newCategory.Name}
                                onChange={(e) => setNewCategory({ ...newCategory, Name: e.target.value })}
                                disabled={isLoading}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Description:
                            <textarea
                                value={newCategory.Description}
                                onChange={(e) => setNewCategory({ ...newCategory, Description: e.target.value })}
                                disabled={isLoading}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Image URL:
                            <input
                                type="text"
                                value={newCategory.ImageUrl}
                                onChange={(e) => setNewCategory({ ...newCategory, ImageUrl: e.target.value })}
                                disabled={isLoading}
                            />
                        </label>
                    </div>
                    <div className="button-group">
                        <button
                            className="btn primary-btn"
                            onClick={editingCategory ? handleEditCategory : handleAddCategory}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : editingCategory ? 'Update' : 'Add'} Category
                        </button>
                        {editingCategory && (
                            <button
                                className="btn secondary-btn"
                                onClick={resetForm}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
        </div>
        

            <style jsx>{`
                .categories-page {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .notification {
                    padding: 10px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                }

                .notification.success {
                    background-color: #d4edda;
                    color: #155724;
                }

                .notification.error {
                    background-color: #f8d7da;
                    color: #721c24;
                }

                .error-message {
                    padding: 10px;
                    margin-bottom: 20px;
                    background-color: #f8d7da;
                    color: #721c24;
                    border-radius: 4px;
                }

                .table-container {
                    margin-bottom: 30px;
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }

                th {
                    background-color: #f8f9fa;
                }

                .category-image {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 4px;
                }

                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 8px;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .edit-btn {
                    background-color: #007bff;
                    color: white;
                }

                .delete-btn {
                    background-color: #dc3545;
                    color: white;
                }

                .form-container {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 4px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }

                input, textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                textarea {
                    height: 100px;
                }

                .primary-btn {
                    background-color: #28a745;
                    color: white;
                }

                .secondary-btn {
                    background-color: #6c757d;
                    color: white;
                }

                .button-group {
                    margin-top: 20px;
                }
            `}</style>
        </div>
    );
};

export default CategoriesPage;