import React, { useState } from 'react';
import { Sparkles, Sprout, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';
import { PRESET_PLANT_CASES, MAX_MORE_PRODUCT } from '../data/products';
import { Product, WeightVariant } from '../types';

interface ConsultationSectionProps {
  onAddToCart: (product: Product, variant: WeightVariant, quantity: number) => void;
  onOpenLiveChat: (initialContext?: string) => void;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  onAddToCart,
  onOpenLiveChat,
}) => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('Sayuran & Hortikultura');
  const [symptoms, setSymptoms] = useState('');
  const [soilType, setSoilType] = useState('Tanah kebun biasa');

  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleApplyPreset = (preset: (typeof PRESET_PLANT_CASES)[0]) => {
    setPlantName(preset.plantName);
    setPlantType(preset.plantType);
    setSymptoms(preset.symptoms);
    setSoilType(preset.soilType);
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim() && !symptoms.trim()) return;

    setIsLoading(true);
    setDiagnosisResult(null);

    try {
      const response = await fetch('/api/gemini/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantName,
          plantType,
          symptoms,
          soilType,
        }),
      });
      const data = await response.json();
      setDiagnosisResult(
        data.diagnosis ||
          'Berikan 2–3 sendok makan MAX MORE Pupuk Padat Organik setiap 14 hari untuk menyuburkan tanah dan memulihkan perakaran.'
      );
    } catch {
      setDiagnosisResult(
        `🩺 DIAGNOSIS SINGKAT (${plantName || 'Tanaman'}):\nTanah mulai memadat dan kekurangan bahan organik aktif.\n\n📦 DOSIS PUPUK MAX MORE:\nTaburkan 2–3 sendok makan (30–50 gram) MAX MORE di sekitar pangkal batang setiap 2 minggu lalu siram air secukupnya.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecommended = () => {
    onAddToCart(MAX_MORE_PRODUCT, MAX_MORE_PRODUCT.variants[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section id="konsultasi" className="py-14 sm:py-16 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
              Layanan Gratis MAX MORE
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Konsultasi Tanaman & Dosis Pupuk AI
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-xl">
              Ceritakan keluhan tanaman Anda untuk mendapatkan analisis cepat dan takaran pemakaian pupuk MAX MORE yang tepat.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenLiveChat()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-semibold text-emerald-300 transition-colors self-start md:self-auto whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Buka Chat Dokter Tanaman</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Form */}
          <div className="lg:col-span-5 bg-stone-950/90 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs text-stone-400 font-medium mb-2.5">Contoh keluhan cepat:</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {PRESET_PLANT_CASES.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>

              <form onSubmit={handleDiagnose} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Nama Tanaman:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Cabai, Durian, Monstera, Padi"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Jenis:</label>
                    <select
                      value={plantType}
                      onChange={(e) => setPlantType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Sayuran & Hortikultura">Sayuran / Cabai</option>
                      <option value="Pohon Buah">Pohon Buah</option>
                      <option value="Tanaman Hias Pot">Tanaman Hias</option>
                      <option value="Padi & Palawija">Padi / Jagung</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Kondisi Tanah:</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Tanah kebun biasa">Kebun Biasa</option>
                      <option value="Tanah keras / padat">Keras / Padat</option>
                      <option value="Media pot / polybag">Pot / Polybag</option>
                      <option value="Tanah asam bekas kimia">Bekas Kimia / Asam</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Gejala / Keluhan:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Misal: daun kuning, bunga rontok, pertumbuhan lambat..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menganalisis Tanaman...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Cek Diagnosis & Dosis MAX MORE</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 bg-stone-950/60 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between">
            {isLoading ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center">
                <Sprout className="w-10 h-10 text-emerald-400 animate-pulse mb-3" />
                <p className="text-sm font-semibold text-white">Menyiapkan Resep Agronomi MAX MORE...</p>
                <p className="text-xs text-stone-400 mt-1">Menghitung takaran paling aman dan efektif.</p>
              </div>
            ) : diagnosisResult ? (
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hasil Konsultasi: {plantName}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenLiveChat(`Tanya lanjut tentang ${plantName}: ${symptoms}`)}
                      className="text-xs text-stone-300 hover:text-white underline"
                    >
                      Tanya Lanjutan
                    </button>
                  </div>

                  <div className="text-xs text-stone-200 leading-relaxed whitespace-pre-line bg-stone-900/70 p-4 rounded-xl border border-stone-800 max-h-[260px] overflow-y-auto">
                    {diagnosisResult}
                  </div>
                </div>

                {/* 1-Click Add to Cart */}
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">{MAX_MORE_PRODUCT.name}</p>
                    <p className="text-[11px] text-emerald-200">
                      Kemasan awal praktis: {MAX_MORE_PRODUCT.variants[0].weight} · Rp{' '}
                      {MAX_MORE_PRODUCT.variants[0].price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRecommended}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      added
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {added ? '✓ Ditambahkan' : '+ Tambah ke Keranjang'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center px-4">
                <Sprout className="w-10 h-10 text-emerald-500/60 mb-3" />
                <h3 className="text-base font-bold text-stone-200 mb-1">
                  Konsultasi Masalah Tanaman Secara Langsung
                </h3>
                <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                  Pilih contoh kasus atau tulis kondisi tanaman Anda di formulir sebelah kiri untuk mengetahui penyebab gejala dan dosis pupuk padat organik MAX MORE yang tepat.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
