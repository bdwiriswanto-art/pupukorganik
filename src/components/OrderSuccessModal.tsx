import React from 'react';
import { CheckCircle2, MapPin, Truck, Printer, ArrowRight, X, Sprout, MessageSquare, MessageCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onShopAgain: () => void;
  onOpenShippingConsultation: (contextText: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onShopAgain,
  onOpenShippingConsultation,
}) => {
  if (!isOpen || !order) return null;

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 bg-emerald-900 text-white text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-emerald-300">
            Pesanan Tercatat
          </span>
          <h2 className="text-xl font-bold font-display mt-1">
            Terima Kasih! Pesanan MAX MORE Diterima
          </h2>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-stone-400 block text-[10px]">No. Invoice:</span>
              <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px]">Transfer Tujuan:</span>
              <span className="font-semibold text-emerald-800">
                BCA 3530954837 (BRIAN DWI RISWANTO)
              </span>
            </div>
          </div>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center shrink-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-stone-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-stone-500">
                      {item.weightVariant} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-stone-900 tabular-nums shrink-0">
                  {formatIDR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold">
              {order.deliveryType === 'pickup' ? (
                <>
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span>Pengambilan di Rumah (Semarang)</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-emerald-800" />
                  <span>Pengiriman Luar Kota ({order.city})</span>
                </>
              )}
            </div>
            <p className="text-stone-600 leading-relaxed">
              Pemesan: <strong className="text-stone-800">{order.customerName}</strong> ({order.phone})<br />
              Alamat: {order.address}
              {order.pickupSchedule ? ` · Jadwal: ${order.pickupSchedule}` : ''}
            </p>
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-bold text-stone-900">
              <span>Total Transfer BCA:</span>
              <span className="font-mono text-emerald-900 text-sm tabular-nums">
                {formatIDR(order.total)}
              </span>
            </div>
          </div>

          {order.deliveryType === 'luar_kota' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenShippingConsultation(
                  `Halo, saya sudah pesan Order ${order.id} untuk pengiriman luar kota ke ${order.address}, ${order.city}. Mohon info pilihan ekspedisi dan ongkirnya.`
                );
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Konsultasikan Ekspedisi & Ongkir Luar Kota</span>
            </button>
          )}

          <a
            href={`https://wa.me/6281395037157?text=${encodeURIComponent(
              `Halo MAX MORE, konfirmasi pesanan:\n` +
                `No. Invoice: ${order.id}\n` +
                `Nama: ${order.customerName} (${order.phone})\n` +
                `Pesanan: ${order.items.map((i) => `${i.quantity}x ${i.weightVariant}`).join(', ')}\n` +
                `Total Transfer BCA: ${formatIDR(order.total)}\n` +
                `Pengambilan/Kirim: ${order.deliveryType === 'pickup' ? 'Ambil di Rumah (Semarang)' : `Luar Kota - ${order.address}, ${order.city}`}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Konfirmasi ke WhatsApp (0813-9503-7157)</span>
          </a>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold flex items-center justify-center gap-2 border border-stone-200"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Bukti</span>
            </button>

            <button
              type="button"
              onClick={onShopAgain}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center justify-center gap-2"
            >
              <span>Selesai</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
