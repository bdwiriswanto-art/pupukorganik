import { Product } from '../types';

export const MAX_MORE_PRODUCT: Product = {
  id: 'max-more-organic-solid',
  name: 'MAX MORE – Organic Fertilizer',
  categoryLabel: 'Solusi Nutrisi Organik untuk Tanah Lebih Subur',
  shortDesc:
    'Membantu memperbaiki kualitas tanah, mendukung pertumbuhan tanaman, dan menjaga kesuburan tanah secara berkelanjutan. Dapat diaplikasikan langsung secara padat (tabur) maupun dilarutkan menjadi pupuk cair (kocor).',
  image: '/src/assets/images/max_more_organic_fertilizer_1794819707936.jpg',
  rating: 4.9,
  reviewsCount: 840,
  cnRatio: '< 14',
  organicMatter: '> 27%',
  ph: '6',
  npkAnalysis: 'NPK Total > 6% · Mineral: Na, Cu, Ca, Zn, Mg, Fe, S, B',
  microbes: ['Na', 'Cu', 'Ca', 'Zn', 'Mg', 'Fe', 'S', 'B'],
  dosageGuide: 'Padat: 25–50g / pot atau 150–250g / pohon. Cair (Kocor): 15g per 1 Liter air.',
  variants: [
    { weight: '2 kg (Pack Kebun)', price: 20000, stock: 240 },
    { weight: '5 kg (Zak Praktis)', price: 40000, stock: 120 },
  ],
};

export const MAX_MORE_SPECS = [
  'Kandungan NPK total lebih dari 6%.',
  'C-Organik lebih dari 27%.',
  'Rasio C/N kurang dari 14.',
  'pH 6.',
  'Mengandung mineral lain: Na, Cu, Ca, Zn, Mg, Fe, S, dan B.',
];

export const PRESET_PLANT_CASES = [
  {
    title: 'Daun Cabai Kuning & Keriting',
    plantName: 'Cabai Rawit / Merah',
    plantType: 'Sayuran & Hortikultura',
    symptoms: 'Daun muda menguning, tepi daun melengkung, dan bunga mudah rontok.',
    soilType: 'Tanah polybag mulai padat',
  },
  {
    title: 'Bunga Pohon Buah Rontok',
    plantName: 'Durian / Mangga / Jambu',
    plantType: 'Pohon Buah',
    symptoms: 'Bunga keluar banyak tetapi rontok sebelum jadi buah, daun tua kusam.',
    soilType: 'Tanah pekarangan keras',
  },
  {
    title: 'Tanaman Hias Daun Pucat',
    plantName: 'Monstera / Aglonema',
    plantType: 'Tanaman Hias Pot',
    symptoms: 'Ujung daun mengering cokelat, tunas baru lambat tumbuh, media pot memadat.',
    soilType: 'Media pot konvensional',
  },
];
