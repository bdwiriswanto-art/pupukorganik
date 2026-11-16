import React from 'react';
import { ShoppingBag, Sprout, Sparkles, Calculator } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onScrollToSection,
}) => {
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onScrollToSection('produk')}
          className="flex items-center gap-2 text-left group shrink-0 whitespace-nowrap"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <Sprout className="w-4 h-4" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-stone-900 font-display whitespace-nowrap">
            MAX MORE
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onScrollToSection('produk')}
            className="hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Produk
          </button>
          <button
            onClick={() => onScrollToSection('dosis')}
            className="flex items-center gap-1.5 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 py-1"
          >
            <Calculator className="w-3.5 h-3.5 text-stone-500" />
            <span>Dosis & Pupuk Cair</span>
          </button>
          <button
            onClick={() => onScrollToSection('konsultasi')}
            className="flex items-center gap-1.5 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 py-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Konsultasi</span>
          </button>
          <button
            onClick={() => onScrollToSection('pembayaran')}
            className="hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Pembayaran
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="Buka Keranjang Belanja"
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-950 active:scale-[0.98] rounded-lg transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Keranjang</span>
            {totalItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 font-bold text-xs flex items-center justify-center tabular-nums">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
