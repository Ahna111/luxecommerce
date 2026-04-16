import { useState, useEffect } from "react";
import { Product, CartItem } from "./types";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import { motion } from "motion/react";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Minimalist Leather Watch",
    description: "A sleek, timeless timepiece with a genuine Italian leather strap and sapphire crystal glass.",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
    category: "Accessories"
  },
  {
    id: "2",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium sound quality with advanced active noise cancellation and 30-hour battery life.",
    price: 299.00,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
    category: "Electronics"
  },
  {
    id: "3",
    name: "Organic Cotton Weekend Tee",
    description: "Soft, breathable organic cotton t-shirt with a relaxed fit for everyday comfort.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60",
    category: "Apparel"
  },
  {
    id: "4",
    name: "Ceramic Pour-Over Coffee Set",
    description: "Hand-crafted ceramic dripper and carafe for the perfect morning ritual.",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1544350223-99ff9c42744e?w=800&auto=format&fit=crop&q=60",
    category: "Home"
  },
  {
    id: "5",
    name: "Aluminum Mechanical Keyboard",
    description: "Tactile mechanical switches in a solid aircraft-grade aluminum chassis.",
    price: 159.00,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
    category: "Electronics"
  },
  {
    id: "6",
    name: "Recycled Canvas Backpack",
    description: "Durable, water-resistant backpack made from 100% recycled ocean plastic.",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
    category: "Accessories"
  }
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/success") {
      setShowSuccess(true);
      setCartItems([]);
      localStorage.removeItem("cart");
      // Clean up URL after 5 seconds
      setTimeout(() => {
        window.history.replaceState({}, document.title, "/");
        setShowSuccess(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart && !showSuccess) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [showSuccess]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar 
        cartItems={cartItems} 
        onRemoveFromCart={removeFromCart} 
        onUpdateQuantity={updateQuantity} 
      />
      
      <main className="container mx-auto px-4 py-12">
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 p-6 bg-green-50 border border-green-100 rounded-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-green-900 mb-2">Order Successful!</h2>
            <p className="text-green-700 text-sm">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          </motion.div>
        )}
        
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-4"
          >
            Curated Essentials
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover our collection of premium, sustainably sourced products designed for modern living.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} onAddToCart={addToCart} />
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 LuxeCommerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
