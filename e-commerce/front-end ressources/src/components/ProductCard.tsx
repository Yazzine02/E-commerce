import React, { useState } from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function ProductCard(product: Product) {
  const { dispatch } = useCart();
  const { title, price, image, rating, reviews, stock } = product;
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (stock === 0) return;
    
    setIsAdding(true);
    dispatch({ type: 'ADD_ITEM', payload: product });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative pb-[100%] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{title}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">({reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
            <p className="text-sm text-gray-500">{stock} in stock</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || isAdding}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAdding
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {stock > 0 ? 'Add' : 'Out of Stock'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}