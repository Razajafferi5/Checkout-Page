import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  estimatedTax: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'payflow_cart_items_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product._id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.stock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotal = useMemo(() => {
    const raw = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return Number(raw.toFixed(2));
  }, [items]);

  const freeShippingThreshold = 150.0;
  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= freeShippingThreshold ? 0.0 : 9.99;
  }, [subtotal, items.length]);

  const estimatedTax = useMemo(() => {
    if (items.length === 0) return 0;
    return Number((subtotal * 0.0825).toFixed(2));
  }, [subtotal, items.length]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Number((subtotal + shipping + estimatedTax).toFixed(2));
  }, [subtotal, shipping, estimatedTax, items.length]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        estimatedTax,
        shipping,
        total,
        freeShippingThreshold,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
