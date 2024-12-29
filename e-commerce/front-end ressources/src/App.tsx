import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import { CartProvider } from './context/CartContext';
import { Product } from './types';

const products: Product[] = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    category: "Audio",
    stock: 15,
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    title: "Smart Watch Series 5",
    description: "Advanced smartwatch with health monitoring features",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
    category: "Wearables",
    stock: 8,
    rating: 4.8,
    reviews: 259
  },
  {
    id: 3,
    title: "Professional Camera Kit",
    description: "Professional DSLR camera with multiple lenses",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    category: "Cameras",
    stock: 5,
    rating: 4.7,
    reviews: 184
  },
  {
    id: 4,
    title: "Designer Backpack",
    description: "Stylish backpack with laptop compartment",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    category: "Accessories",
    stock: 0,
    rating: 4.3,
    reviews: 95
  }
];

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Hero />
        <ProductList products={products} title="Featured Products" />
        
        <footer className="bg-gray-900 text-gray-300 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">About Us</h3>
                <p className="text-sm">We offer the best electronics at competitive prices. Our commitment to quality and customer service sets us apart.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Shop</a></li>
                  <li><a href="#" className="hover:text-white">Categories</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <ul className="space-y-2 text-sm">
                  <li>Email: support@store.com</li>
                  <li>Phone: (555) 123-4567</li>
                  <li>Address: 123 Store St, City, Country</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
              © 2024 Store. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;