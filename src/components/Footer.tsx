import React from 'react';
import { Sprout, MapPin, Landmark, MessageCircle } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-800 text-emerald-300 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </span>
              <span className="text-base font-extrabold tracking-tight text-white font-display">
                MAX MORE
              </span>
            </div>
            <p className="flex items-start gap-1.5 text-[11px] text-stone-400 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Jl. Banteng Utara No.14, Pandean Lamper, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50249</span>
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-stone-400">
              <Landmark className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Transfer BCA 3530954837 a.n. BRIAN DWI RISWANTO</span>
            </p>
            <a
              href="https://wa.me/6281395037157"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp Pemesanan & Konsultasi: 0813-9503-7157</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <button onClick={() => onScrollToSection('produk')} className="hover:text-white transition-colors">
              Produk
            </button>
            <button onClick={() => onScrollToSection('dosis')} className="hover:text-white transition-colors">
              Dosis & Pupuk Cair
            </button>
            <button onClick={() => onScrollToSection('konsultasi')} className="hover:text-white transition-colors">
              Konsultasi Tanaman
            </button>
            <button onClick={() => onScrollToSection('pembayaran')} className="hover:text-white transition-colors">
              Pengambilan & Pembayaran
            </button>
          </div>
        </div>

        <div className="pt-5 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} MAX MORE – Organic Fertilizer.</p>
          <p>Pengambilan di Rumah (Semarang) & Konsultasi Pengiriman Luar Kota.</p>
        </div>
      </div>
    </footer>
  );
};
