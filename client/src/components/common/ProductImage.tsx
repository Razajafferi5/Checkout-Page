import React, { useState } from 'react';
import { Headphones, Watch, Keyboard, Laptop, ShieldCheck, HardDrive, Camera, Lamp } from 'lucide-react';
import { getProductPlaceholderSvg } from '../../utils/productPlaceholders';

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = 'Hardware',
  className = '',
  loading = 'eager',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || getProductPlaceholderSvg(category, alt));
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = () => {
    // If the remote Unsplash/CDN image fails, switch seamlessly to the luxury vector placeholder
    const placeholder = getProductPlaceholderSvg(category, alt);
    if (imgSrc !== placeholder) {
      setImgSrc(placeholder);
    } else {
      setHasError(true);
    }
  };

  const getCategoryIcon = () => {
    const c = category.toLowerCase();
    const n = alt.toLowerCase();
    if (c.includes('audio') || n.includes('headphone')) return <Headphones className="w-12 h-12 text-champagne" />;
    if (c.includes('wearable') || n.includes('watch')) return <Watch className="w-12 h-12 text-champagne" />;
    if (n.includes('keyboard')) return <Keyboard className="w-12 h-12 text-champagne" />;
    if (n.includes('stand') || n.includes('mat')) return <Laptop className="w-12 h-12 text-champagne" />;
    if (n.includes('hub') || n.includes('drive')) return <HardDrive className="w-12 h-12 text-champagne" />;
    if (n.includes('camera') || n.includes('webcam')) return <Camera className="w-12 h-12 text-champagne" />;
    if (n.includes('light')) return <Lamp className="w-12 h-12 text-champagne" />;
    return <ShieldCheck className="w-12 h-12 text-champagne" />;
  };

  if (hasError) {
    return (
      <div className="w-full h-full min-h-[160px] max-h-72 p-6 flex flex-col items-center justify-center text-center bg-stone-warm/30 dark:bg-white/5 rounded-xl border border-stone-warm dark:border-white/10 space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 flex items-center justify-center border border-champagne/40 shadow-subtle">
          {getCategoryIcon()}
        </div>
        <div className="pt-1">
          <span className="font-serif font-bold text-sm text-charcoal dark:text-ivory block truncate max-w-[200px]">
            {alt}
          </span>
          <span className="text-[10px] font-mono text-champagne-dark dark:text-champagne uppercase tracking-wider block">
            Verified Hardware Asset
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 editorial-shimmer rounded-xl opacity-60 pointer-events-none" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
};
