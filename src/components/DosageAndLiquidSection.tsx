import React, { useState } from 'react';
import { Calculator, Droplets, Sprout, Check, ShoppingBag } from 'lucide-react';
import { MAX_MORE_PRODUCT } from '../data/products';
import { Product, WeightVariant } from '../types';

interface DosageAndLiquidSectionProps {
  onAddToCart: (product: Product, variant: WeightVariant, quantity: number) => void;
}

export const DosageAndLiquidSection: React.FC<DosageAndLiquidSectionProps> = ({
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'padat' | 'cair'>('padat');

  // State for Solid Dosage Calculator
  const [cropType, setCropType] = useState<'pot' | 'sayur' | 'buah' | 'padi'>('sayur');
  const [inputMode, setInputMode] = useState<'tanaman' | 'lahan'>('tanaman');
  const [plantCount, setPlantCount] = useState<number>(20);
  const [areaM2, setAreaM2] = useState<number>(100);
  const [soilCondition, setSoilCondition] = useState<'normal' | 'kurang'>('normal');

  // State for Liquid Fertilizer Converter
  const [liquidMode, setLiquidMode] = useState<'kocor' | 'fermentasi'>('kocor');
  const [waterLiters, setWaterLiters] = useState<number>(10);

  const [addedFeedback, setAddedFeedback] = useState(false);

  // Calculations for Solid Dosage
  const rates: Record<'pot' | 'sayur' | 'buah' | 'padi', { perPlantGram: number; perM2Gram: number; interval: string; label: string }> = {
    pot: { perPlantGram: 30, perM2Gram: 150, interval: 'Setiap 14 hari', label: '2 sdm (30g) / pot' },
    sayur: { perPlantGram: 40, perM2Gram: 200, interval: 'Setiap 14 hari', label: '3 sdm (40g) / tanaman' },
    buah: { perPlantGram: 250, perM2Gram: 250, interval: 'Setiap 30 hari', label: '250g / pohon melingkar' },
    padi: { perPlantGram: 25, perM2Gram: 150, interval: 'Saat olah tanah & 25 HST', label: '150g / m² lahan' },
  };

  const selectedRate = rates[cropType];
  const multiplier = soilCondition === 'kurang' ? 1.25 : 1;
  const rawGramsSolid =
    inputMode === 'tanaman'
      ? plantCount * selectedRate.perPlantGram * multiplier
      : areaM2 * selectedRate.perM2Gram * multiplier;
  const totalGramsSolid = Math.max(30, Math.round(rawGramsSolid));
  const totalKgSolid = totalGramsSolid / 1000;

  // Calculations for Liquid Fertilizer (Menjadikan Pupuk Cair)
  const gramPerLiter = liquidMode === 'kocor' ? 15 : 20;
  const totalGramsLiquid = Math.max(15, Math.round(waterLiters * gramPerLiter));
  const totalSdmLiquid = Math.round(totalGramsLiquid / 15);
  const molassesMl = liquidMode === 'fermentasi' ? Math.round(waterLiters * 10) : 0;
  const plantsServedLiquid = Math.round((waterLiters * 1000) / 200); // 200 ml per tanaman

  // Choose recommended pack based on active calculation
  const neededGrams = activeTab === 'padat' ? totalGramsSolid : totalGramsLiquid;
  const getRecommendedPack = (): { variant: WeightVariant; qty: number } => {
    if (neededGrams <= 2000) {
      return { variant: MAX_MORE_PRODUCT.variants[0], qty: 1 }; // 2 kg
    }
    const sacks5kg = Math.max(1, Math.ceil(neededGrams / 5000));
    return { variant: MAX_MORE_PRODUCT.variants[1], qty: sacks5kg }; // 5 kg
  };

  const recommended = getRecommendedPack();

  const handleAddRecommended = () => {
    onAddToCart(MAX_MORE_PRODUCT, recommended.variant, recommended.qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <section id="dosis" className="py-12 sm:py-16 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
              Panduan Dosis & Aplikasi
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display tracking-tight">
              Penghitungan Dosis & Cara Menjadikan Pupuk Cair
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Hitung kebutuhan takaran MAX MORE untuk tabur padat maupun larutkan menjadi pupuk cair (kocor) agar nutrisi lebih cepat diserap akar.
            </p>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex p-1 bg-stone-200/80 rounded-xl shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('padat')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'padat'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-800" />
              <span>Dosis Tabur Padat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cair')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'cair'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-emerald-800" />
              <span>Jadikan Pupuk Cair</span>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 sm:p-8">
          {activeTab === 'padat' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Inputs Left */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    1. Pilih Jenis Tanaman:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'pot', title: 'Tanaman Pot', sub: 'Hias / Aroid' },
                      { id: 'sayur', title: 'Sayuran / Cabai', sub: 'Hortikultura' },
                      { id: 'buah', title: 'Pohon Buah', sub: 'Durian / Mangga' },
                      { id: 'padi', title: 'Padi / Lahan', sub: 'Palawija' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCropType(c.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          cropType === c.id
                            ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <span className="block text-xs font-bold text-stone-900">{c.title}</span>
                        <span className="block text-[11px] text-stone-500 mt-0.5">{c.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                        2. Satuan Hitung:
                      </label>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setInputMode('tanaman')}
                          className={`underline ${inputMode === 'tanaman' ? 'text-emerald-800 font-bold' : 'text-stone-400'}`}
                        >
                          Per Tanaman
                        </button>
                        <span className="text-stone-300">/</span>
                        <button
                          type="button"
                          onClick={() => setInputMode('lahan')}
                          className={`underline ${inputMode === 'lahan' ? 'text-emerald-800 font-bold' : 'text-stone-400'}`}
                        >
                          Luas (m²)
                        </button>
                      </div>
                    </div>

                    {inputMode === 'tanaman' ? (
                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          max={50000}
                          value={plantCount}
                          onChange={(e) => setPlantCount(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 font-mono text-sm focus:outline-none focus:border-emerald-700"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-stone-400">
                          Tanaman / Pot
                        </span>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          max={100000}
                          value={areaM2}
                          onChange={(e) => setAreaM2(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 font-mono text-sm focus:outline-none focus:border-emerald-700"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-stone-400">
                          m²
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                      3. Kondisi Tanah Saat Ini:
                    </label>
                    <select
                      value={soilCondition}
                      onChange={(e) => setSoilCondition(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs bg-white focus:outline-none focus:border-emerald-700"
                    >
                      <option value="normal">Normal / Terawat (Dosis Standar)</option>
                      <option value="kurang">Tanah Keras / Kurang Subur (+25%)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
                  <strong className="text-stone-900">Cara Aplikasi Padat:</strong> Taburkan merata di sekitar perakaran atau benamkan tipis 2–3 cm lalu siram air agar NPK (&gt;6%), C-Organik (&gt;27%), dan mineral (Na, Cu, Ca, Zn, Mg, Fe, S, B) langsung aktif.
                </div>
              </div>

              {/* Result Right */}
              <div className="lg:col-span-5 bg-stone-900 text-white rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Estimasi Kebutuhan MAX MORE
                  </span>

                  <div className="mt-3 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
                        {totalGramsSolid >= 1000
                          ? `${totalKgSolid.toFixed(2).replace(/\.00$/, '')}`
                          : totalGramsSolid.toLocaleString('id-ID')}
                      </span>
                      <span className="text-base font-bold text-stone-300">
                        {totalGramsSolid >= 1000 ? 'kg' : 'gram'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      Takaran standar: <span className="text-stone-200 font-medium">{selectedRate.label}</span> · {selectedRate.interval}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs space-y-1 mb-5">
                    <span className="text-stone-400 block text-[11px]">Saran Pembelian Kemasan:</span>
                    <p className="font-bold text-white">
                      {recommended.qty}× {recommended.variant.weight}
                    </p>
                    <p className="font-mono text-emerald-300 font-semibold tabular-nums">
                      {formatIDR(recommended.variant.price * recommended.qty)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddRecommended}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    addedFeedback
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Masuk Keranjang</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>+ Masukkan Paket ke Keranjang</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Liquid Inputs & Instructions Left */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    1. Metode Pencairan Pupuk:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setLiquidMode('kocor')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        liquidMode === 'kocor'
                          ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      <span className="block text-xs font-bold text-stone-900">
                        Kocor Cepat (15g / Liter)
                      </span>
                      <span className="block text-[11px] text-stone-500 mt-0.5">
                        Aduk rata & langsung siram ke akar, praktis untuk rutin mingguan.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLiquidMode('fermentasi')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        liquidMode === 'fermentasi'
                          ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      <span className="block text-xs font-bold text-stone-900">
                        Pupuk Cair Fermentasi (20g / Liter)
                      </span>
                      <span className="block text-[11px] text-stone-500 mt-0.5">
                        Diamkan 24 jam dengan sedikit gula merah agar nutrisi terlarut maksimal.
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    2. Volume Air yang Disiapkan (Liter):
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    {[1, 5, 10, 20, 100].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setWaterLiters(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                          waterLiters === v
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {v} L
                      </button>
                    ))}
                    <div className="relative flex-1 min-w-[120px]">
                      <input
                        type="number"
                        min={1}
                        max={2000}
                        value={waterLiters}
                        onChange={(e) => setWaterLiters(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-stone-900 font-mono text-xs focus:outline-none focus:border-emerald-700"
                      />
                      <span className="absolute right-2.5 top-1.5 text-[11px] text-stone-400">
                        Liter
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step-by-step Liquid Making Guide */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-700">
                  <p className="font-bold text-stone-900">Langkah Menjadikan MAX MORE Pupuk Cair:</p>
                  <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                    <li>
                      Masukkan <strong className="text-emerald-900 font-mono">{totalGramsLiquid >= 1000 ? `${(totalGramsLiquid / 1000).toFixed(2).replace(/\.00$/, '')} kg` : `${totalGramsLiquid} gram`}</strong> ({totalSdmLiquid} sdm) pupuk padat <strong>MAX MORE</strong> ke dalam <strong className="font-mono">{waterLiters} Liter</strong> air bersih (non-kaporit).
                    </li>
                    {liquidMode === 'fermentasi' && (
                      <li>
                        Tambahkan <strong className="text-emerald-900 font-mono">{molassesMl} ml</strong> gula merah cair / molase, aduk rata, lalu diamkan 24 jam di tempat teduh.
                      </li>
                    )}
                    <li>
                      Aduk merata selama 1–2 menit. Siramkan larutan ke tanah sekitar pangkal akar (<strong className="font-mono">200 ml / tanaman</strong>). Sisa endapan organik dapat ditebar ke media pot sebagai humus.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Liquid Result Right */}
              <div className="lg:col-span-5 bg-stone-900 text-white rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Takaran Racik Pupuk Cair
                  </span>

                  <div className="mt-3 mb-4 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
                        {totalGramsLiquid >= 1000
                          ? `${(totalGramsLiquid / 1000).toFixed(2).replace(/\.00$/, '')}`
                          : totalGramsLiquid.toLocaleString('id-ID')}
                      </span>
                      <span className="text-base font-bold text-stone-300">
                        {totalGramsLiquid >= 1000 ? 'kg' : 'gram'} MAX MORE
                      </span>
                    </div>
                    <p className="text-xs text-stone-300">
                      Dilarutkan ke <strong className="text-white font-mono">{waterLiters} Liter</strong> air · Cukup untuk sekitar <strong className="text-emerald-300 font-mono">{plantsServedLiquid} tanaman</strong> (200 ml/tanaman).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs space-y-1 mb-5">
                    <span className="text-stone-400 block text-[11px]">Kemasan yang Sesuai:</span>
                    <p className="font-bold text-white">
                      {recommended.qty}× {recommended.variant.weight}
                    </p>
                    <p className="font-mono text-emerald-300 font-semibold tabular-nums">
                      {formatIDR(recommended.variant.price * recommended.qty)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddRecommended}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    addedFeedback
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Masuk Keranjang</span>
                    </>
                  ) : (
                    <>
                      <Sprout className="w-4 h-4" />
                      <span>+ Beli Kemasan Sesuai Takaran</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
};
