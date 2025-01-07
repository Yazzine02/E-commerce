import React, { useState } from 'react';

const DynamicForm = ({ model, fields, onSave }) => {
    const [formData, setFormData] = useState(model || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Pass the form data to the parent
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
                <div key={field} className="form-group">
                    <label className="block font-semibold mb-1">{field}:</label>
                    <input
                        type="text"
                        name={field}
                        value={formData[field] || ''}
                        onChange={handleChange}
                        className="border rounded px-4 py-2 w-full"
                        required
                    />
                </div>
            ))}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Save
            </button>
        </form>
    );
};

export default DynamicForm;
