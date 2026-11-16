export interface WeightVariant {
  weight: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  categoryLabel: string;
  shortDesc: string;
  image: string;
  rating: number;
  reviewsCount: number;
  cnRatio: string;
  organicMatter: string;
  ph: string;
  npkAnalysis: string;
  microbes: string[];
  dosageGuide: string;
  variants: WeightVariant[];
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedVariant: WeightVariant;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  deliveryType: 'pickup' | 'luar_kota';
  address: string;
  city: string;
  pickupSchedule?: string;
  paymentMethod: 'transfer_bca';
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  items: Array<{
    id: string;
    name: string;
    weightVariant: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}
