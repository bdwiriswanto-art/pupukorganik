import React, { useState } from 'react';
import { X, ArrowRight, MapPin, Truck, Landmark, MessageSquare } from 'lucide-react';
import { CartItem, Order } from '../types';

const STORE_ADDRESS =
  'Jl. Banteng Utara No.14, Pandean Lamper, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50249';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discount: number;
  onOrderCreated: (order: Order) => void;
  onOpenShippingConsultation: (contextText: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discount,
  onOrderCreated,
  onOpenShippingConsultation,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'luar_kota'>('pickup');
  const [pickupSchedule, setPickupSchedule] = useState('Hari ini / Besok (Konfirmasi WhatsApp)');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.selectedVariant.price * item.quantity,
    0
  );

  const total = Math.max(0, subtotal - discount);

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setErrorMessage('Mohon isi nama lengkap dan nomor WhatsApp Anda.');
      return;
    }
    if (deliveryType === 'luar_kota' && (!address.trim() || !city.trim())) {
      setErrorMessage('Mohon isi alamat lengkap dan kota tujuan untuk konsultasi pengiriman luar kota.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryType,
        address: deliveryType === 'pickup' ? STORE_ADDRESS : address.trim(),
        city: deliveryType === 'pickup' ? 'Kota Semarang' : city.trim(),
        pickupSchedule: deliveryType === 'pickup' ? pickupSchedule.trim() : undefined,
        items: cartItems.map((item) => ({
          id: item.productId,
          name: item.product.name,
          weightVariant: item.selectedVariant.weight,
          price: item.selectedVariant.price,
          quantity: item.quantity,
        })),
        subtotal,
        discount,
        total,
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        onOrderCreated(data.order);
      } else {
        setErrorMessage(data.error || 'Gagal membuat pesanan.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Koneksi terputus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              Pemesanan MAX MORE & Transfer BCA
            </h3>
            <p className="text-xs text-stone-500">
              Ambil di Rumah (Semarang) atau Konsultasi Pengiriman Luar Kota
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Data Pemesan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Nama Lengkap:</label>
              <input
                type="text"
                required
                placeholder="Nama Anda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">Nomor WhatsApp:</label>
              <input
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 font-mono focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          {/* Pilihan Proses Pengambilan / Pengiriman */}
          <div>
            <label className="block text-stone-700 font-bold uppercase tracking-wider mb-2">
              1. Proses Pengambilan / Pengiriman:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  deliveryType === 'pickup'
                    ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-stone-900">Pengambilan di Rumah</span>
                  <span className="block text-[11px] text-stone-500 mt-0.5">
                    Ambil langsung di Gayamsari, Kota Semarang (Gratis Ongkir)
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('luar_kota')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  deliveryType === 'luar_kota'
                    ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-stone-900">Kirim Luar Kota (Konsultasi)</span>
                  <span className="block text-[11px] text-stone-500 mt-0.5">
                    Bisa konsultasi ekspedisi & tarif ongkir terbaik ke kota Anda
                  </span>
                </div>
              </button>
            </div>

            {deliveryType === 'pickup' ? (
              <div className="mt-3 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider block">
                    Alamat Pengambilan di Rumah:
                  </span>
                  <p className="font-semibold text-stone-900 mt-0.5 leading-relaxed">
                    {STORE_ADDRESS}
                  </p>
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Rencana Jadwal Ambil:</label>
                  <input
                    type="text"
                    value={pickupSchedule}
                    onChange={(e) => setPickupSchedule(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-3 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Kota / Kabupaten Tujuan:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kab. Demak / Solo / Surabaya"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Alamat Lengkap Tujuan:</label>
                    <input
                      type="text"
                      required
                      placeholder="Jalan, RT/RW, Kecamatan"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-stone-600">
                  <span>Ongkos kirim luar kota dikonsultasikan sesuai berat pesanan & tujuan.</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenShippingConsultation(
                        `Saya mau konsultasi pengiriman luar kota ke ${city || 'kota saya'} untuk pesanan MAX MORE (${cartItems.map((i) => `${i.quantity}x ${i.selectedVariant.weight}`).join(', ')}).`
                      );
                    }}
                    className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold whitespace-nowrap"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Konsultasi Ongkir Sekarang →</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Metode Pembayaran: Hanya Transfer BCA */}
          <div>
            <label className="block text-stone-700 font-bold uppercase tracking-wider mb-2">
              2. Metode Pembayaran Resmi (Hanya Transfer BCA):
            </label>
            <div className="p-4 rounded-xl border border-emerald-800 bg-emerald-50/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-blue-900 text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                  BCA
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">Transfer Bank BCA</p>
                  <p className="text-xs text-stone-700 font-mono mt-0.5">
                    No. Rek: <strong>3530954837</strong> · a.n. <strong>BRIAN DWI RISWANTO</strong>
                  </p>
                </div>
              </div>
              <Landmark className="w-5 h-5 text-emerald-800 shrink-0 hidden sm:block" />
            </div>
          </div>

          {/* Ringkasan Tagihan */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal Produk:</span>
              <span className="font-mono text-stone-900">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Pengambilan / Pengiriman:</span>
              <span className="font-medium text-emerald-800">
                {deliveryType === 'pickup' ? 'Ambil di Rumah Semarang (Rp 0)' : 'Luar Kota (Konsultasi Ongkir)'}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon:</span>
                <span className="font-mono">-{formatIDR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Transfer BCA:</span>
              <span className="font-mono text-emerald-900 text-base tabular-nums">{formatIDR(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{isSubmitting ? 'Memproses Pesanan...' : 'Buat Pesanan & Lihat Rekening BCA'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
