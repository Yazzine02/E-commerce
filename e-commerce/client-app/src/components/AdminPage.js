import React, { useState, useEffect } from 'react';
import DynamicTable from './Dynamic/DynamicTable';
import DynamicForm from './Dynamic/DynamicForm';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [activeSection, setActiveSection] = useState('Products');
    const [items, setItems] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');

        if (role !== 'admin') {
            alert('Only admins can access this page.');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        fetchItems();
    }, [activeSection]);

    const fetchItems = async () => {
        try {
            const response = await fetch(`http://localhost:5273/api/${activeSection}/Get`);
            const data = await response.json();
            setItems(data);
            if (data.length > 0) {
                setColumns(Object.keys(data[0])); // Extract columns from the first item
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleAdd = () => {
        setSelectedItem(null); // Clear selected item for a fresh form
        setIsFormVisible(true);
    };

    const handleModify = (item) => {
        setSelectedItem(item); // Populate form with selected item data
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this ${activeSection}?`)) {
            try {
                const response = await fetch(
                    `http://localhost:5273/api/${activeSection}/Delete/${id}`,
                    { method: 'DELETE' }
                );
                if (response.ok) {
                    setItems((prev) => prev.filter((item) => item.id !== id));
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            const method = selectedItem ? 'PUT' : 'POST'; // Determine if updating or adding
            const url = selectedItem
                ? `http://localhost:5273/api/${activeSection}/Update/${selectedItem.id}`
                : `http://localhost:5273/api/${activeSection}/Add`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsFormVisible(false); // Hide the form
                fetchItems(); // Refresh the table
            }
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div className="flex space-x-4 mb-6">
                {['Products', 'Categories', 'Users', 'Orders'].map((section) => (
                    <button
                        key={section}
                        onClick={() => {
                            setActiveSection(section);
                            setIsFormVisible(false); // Hide the form if switching sections
                        }}
                        className={`px-4 py-2 rounded ${activeSection === section ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {isFormVisible ? (
                <DynamicForm
                    model={selectedItem}
                    fields={columns}
                    onSave={handleSave}
                />
            ) : (
                <>
                    <button
                        onClick={handleAdd}
                        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add New {activeSection.slice(0, -1)}
                    </button>
                    <DynamicTable
                        data={items}
                        columns={columns}
                        onModify={handleModify}
                        onDelete={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default AdminPage;
