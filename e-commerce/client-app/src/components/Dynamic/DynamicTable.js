import React from 'react';

const DynamicTable = ({ data, columns, onModify, onDelete }) => {
    if (!data.length) {
        return <p>No data available.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        {columns.map((col) => (
                            <th key={col} className="border border-gray-300 px-4 py-2">
                                {col}
                            </th>
                        ))}
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            {columns.map((col) => (
                                <td key={col} className="border border-gray-300 px-4 py-2">
                                    {item[col]}
                                </td>
                            ))}
                            <td className="border border-gray-300 px-4 py-2 space-x-2">
                                <button
                                    onClick={() => onModify(item)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                >
                                    Modify
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
