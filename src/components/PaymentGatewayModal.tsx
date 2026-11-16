import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, RefreshCw, MapPin, Landmark } from 'lucide-react';
import { Order } from '../types';

interface PaymentGatewayModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paidOrder: Order) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !order) return null;

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(order.accountNumber || '3530954837');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmTransfer = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/simulate-payment`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.order) {
        onPaymentSuccess(data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold font-display">Pembayaran Transfer BCA</h3>
              <p className="text-[10px] text-stone-400 font-mono">Order ID: {order.id}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-blue-900 text-white font-bold text-xs">
            BCA
          </span>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div className="text-center p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium block">Nominal Transfer:</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-900 tabular-nums block mt-1">
              {formatIDR(order.total)}
            </span>
            {order.deliveryType === 'luar_kota' && (
              <span className="text-[10px] text-stone-500 mt-1 block">
                *Ongkos kirim luar kota dikonfirmasi via konsultasi pengiriman
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-blue-800" />
                <span>Bank BCA</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Rekening Resmi
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-stone-300 font-mono text-base font-bold text-stone-900">
              <span className="tracking-wider">{order.accountNumber || '3530954837'}</span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="flex items-center gap-1 text-xs text-emerald-800 font-sans font-medium px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <div className="text-stone-700">
              <span className="text-stone-500">Atas Nama: </span>
              <strong className="text-stone-900 uppercase">{order.accountHolder || 'BRIAN DWI RISWANTO'}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5 text-stone-600">
            <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">
                {order.deliveryType === 'pickup' ? 'Pengambilan di Rumah (Semarang)' : `Konsultasi Pengiriman Luar Kota (${order.city})`}
              </p>
              <p className="mt-0.5 leading-relaxed">{order.address}</p>
            </div>
          </div>

          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={handleConfirmTransfer}
              disabled={isVerifying}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Konfirmasi...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Konfirmasi Sudah Transfer BCA</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 text-center"
            >
              Tutup Jendela
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
