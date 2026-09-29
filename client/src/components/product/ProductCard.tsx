import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { ShoppingCart, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { showNotification } = useNotification();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    setAdded(true);
    showNotification('success', `Added "${product.name}" to cart.`);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:border-slate-300">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide text-slate-700 shadow-sm border border-slate-200/60">
          {product.category}
        </div>
        {product.stock <= 5 && (
          <div className="absolute top-3 right-3 bg-rose-500/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-amber-400 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
          <span className="text-[11px] font-medium text-slate-400 ml-1">4.9 (48)</span>
        </div>

        <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold text-slate-600">{product.currency}</span>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md shadow-brand-500/20 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
