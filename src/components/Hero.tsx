import React, { useState } from 'react';
import { ShoppingBag, Check, Sparkles, Star, Truck, MessageCircle, Calculator } from 'lucide-react';
import { MAX_MORE_PRODUCT, MAX_MORE_SPECS } from '../data/products';
import { Product, WeightVariant } from '../types';

interface HeroProps {
  onAddToCart: (product: Product, variant: WeightVariant, quantity: number) => void;
  onOpenConsultation: () => void;
  onOpenDosage: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onAddToCart,
  onOpenConsultation,
  onOpenDosage,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<WeightVariant>(MAX_MORE_PRODUCT.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleAdd = () => {
    onAddToCart(MAX_MORE_PRODUCT, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const whatsappText = [
    'Halo MAX MORE, saya ingin Beli Langsung:',
    '',
    `Produk: ${MAX_MORE_PRODUCT.name}`,
    `Kemasan: ${selectedVariant.weight}`,
    `Jumlah: ${quantity}`,
    `Total Harga: ${formatIDR(selectedVariant.price * quantity)}`,
    '',
    'Pembayaran: Transfer BCA 3530954837 a.n. BRIAN DWI RISWANTO',
    'Pengambilan / Pengiriman: Ambil di Rumah (Semarang) / Konsultasi Kirim Luar Kota',
    'Apakah stok masih tersedia ??',
    'Terimakasih',
  ].join('\n');

  const whatsappOrderUrl = `https://wa.me/6281395037157?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section id="produk" className="bg-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: THE SINGLE PHOTO */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full flex-1 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm min-h-[320px]">
              <img
                src={MAX_MORE_PRODUCT.image}
                alt={MAX_MORE_PRODUCT.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                  Solusi Nutrisi Organik
                </p>
                <p className="text-sm font-medium text-stone-100 mt-0.5">
                  Bisa diaplikasikan padat (tabur) maupun dilarutkan menjadi pupuk cair (kocor).
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Exact Specs & Direct Purchase */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <div>
              {/* Quiet metadata line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="font-semibold text-emerald-800">Solusi Nutrisi Organik untuk Tanah Lebih Subur</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono tabular-nums">{MAX_MORE_PRODUCT.rating}</span>
                  <span className="text-stone-400">({MAX_MORE_PRODUCT.reviewsCount} ulasan)</span>
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-[1.15] font-display mb-3"
                style={{ textWrap: 'balance' }}
              >
                {MAX_MORE_PRODUCT.name}
              </h1>

              <p className="text-sm text-stone-600 leading-relaxed mb-5">
                {MAX_MORE_PRODUCT.shortDesc}
              </p>

              {/* Key Nutrient Specifications Requested by User */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 mb-3 border-b border-stone-200/80 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">NPK Total</span>
                    <span className="font-bold text-emerald-900 font-mono text-sm tabular-nums">&gt; 6%</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">C-Organik</span>
                    <span className="font-bold text-emerald-900 font-mono text-sm tabular-nums">&gt; 27%</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Rasio C/N</span>
                    <span className="font-bold text-emerald-900 font-mono text-sm tabular-nums">&lt; 14</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">pH Tanah</span>
                    <span className="font-bold text-emerald-900 font-mono text-sm tabular-nums">6</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-stone-700">
                  {MAX_MORE_SPECS.map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weight Variant Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-stone-800 uppercase tracking-wider">
                    Pilih Kemasan:
                  </span>
                  <button
                    type="button"
                    onClick={onOpenDosage}
                    className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Hitung Dosis & Cara Jadi Pupuk Cair →</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MAX_MORE_PRODUCT.variants.map((variant) => {
                    const active = selectedVariant.weight === variant.weight;
                    return (
                      <button
                        key={variant.weight}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-emerald-800 bg-emerald-50/60 ring-1 ring-emerald-800'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <span className="block text-xs font-bold text-stone-900">
                          {variant.weight.split('(')[0].trim()}
                        </span>
                        <span className="block text-[11px] text-stone-500 truncate">
                          {variant.weight.match(/\(([^)]+)\)/)?.[1] || ''}
                        </span>
                        <span className="block text-xs font-bold font-mono text-emerald-900 tabular-nums mt-1">
                          {formatIDR(variant.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Price & Purchase Controls */}
            <div className="pt-5 border-t border-stone-200 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-stone-500 block">Total Harga</span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-stone-900 tabular-nums">
                    {formatIDR(selectedVariant.price * quantity)}
                  </span>
                </div>

                <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-10 flex items-center justify-center text-stone-700 hover:text-stone-900 font-bold"
                    aria-label="Kurangi jumlah"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-stone-900 tabular-nums text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-10 flex items-center justify-center text-stone-700 hover:text-stone-900 font-bold"
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    isAdded
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-900 active:scale-[0.99]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Masuk Keranjang</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>+ Keranjang</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Beli Langsung (WhatsApp)</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-stone-500">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Konsultasi Tanaman Gratis →</span>
                </button>
                <span className="inline-flex items-center gap-1 text-stone-500">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Ambil di Rumah (Semarang) · Konsultasi Luar Kota</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
