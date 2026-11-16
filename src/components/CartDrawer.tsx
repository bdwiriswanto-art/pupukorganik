import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MapPin, Tag, ShieldCheck, Sprout } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, variantWeight: string, delta: number) => void;
  onRemoveItem: (productId: string, variantWeight: string) => void;
  onProceedToCheckout: () => void;
  discount: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discount,
  onApplyPromo,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.selectedVariant.price * item.quantity,
    0
  );

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = onApplyPromo(inputCode.trim());
    if (success) {
      setPromoMessage({ text: 'Kupon promo berhasil diterapkan!' });
    } else {
      setPromoMessage({ text: 'Kode promo tidak valid.', error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-900 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                Keranjang MAX MORE
              </h3>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span>
              <strong className="text-stone-900">Pengambilan di Rumah (Semarang)</strong> atau konsultasi pengiriman luar kota · Pembayaran <strong className="text-stone-900">Transfer BCA</strong>.
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 stroke-[1.5] text-stone-300 mb-3" />
                <p className="text-sm font-semibold text-stone-700">Keranjang Masih Kosong</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Pilih varian kemasan 2 kg atau 5 kg MAX MORE untuk memulai pembelian.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant.weight}`}
                  className="flex gap-3.5 p-3.5 rounded-xl border border-stone-200 bg-white"
                >
                  <div className="w-12 h-12 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center shrink-0">
                    <Sprout className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 truncate font-display">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.productId, item.selectedVariant.weight)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-0.5"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium">
                        Kemasan: {item.selectedVariant.weight}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs font-bold font-mono text-emerald-900 tabular-nums">
                        {formatIDR(item.selectedVariant.price * item.quantity)}
                      </p>

                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.selectedVariant.weight, -1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-xs tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.selectedVariant.weight, 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
              <form onSubmit={handleApply} className="flex gap-2 text-xs">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Kode promo: MAXMORE10"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 text-stone-800 placeholder-stone-400 uppercase font-mono text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-medium text-xs transition-colors"
                >
                  Pakai
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.error ? 'text-red-600' : 'text-emerald-700'}`}>
                  {promoMessage.text}
                </p>
              )}

              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-stone-800 tabular-nums">
                    {formatIDR(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Promo:</span>
                    <span className="font-mono font-semibold tabular-nums">
                      -{formatIDR(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Pembayaran:</span>
                  <span className="font-mono text-emerald-900 text-base tabular-nums">
                    {formatIDR(Math.max(0, subtotal - discount))}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Lanjut ke Pembayaran BCA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Transfer BCA 3530954837 a.n. BRIAN DWI RISWANTO</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
