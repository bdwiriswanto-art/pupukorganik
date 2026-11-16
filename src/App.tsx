import React, { useState } from 'react';
import { Product, WeightVariant, CartItem, Order } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DosageAndLiquidSection } from './components/DosageAndLiquidSection';
import { ConsultationSection } from './components/ConsultationSection';
import { ConsultationChatModal } from './components/ConsultationChatModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { CheckCircle2, Landmark, MapPin, Truck, MessageCircle } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialContext, setChatInitialContext] = useState<string | undefined>();

  const [discount, setDiscount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleAddToCart = (product: Product, variant: WeightVariant, quantity: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.selectedVariant.weight === variant.weight
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { productId: product.id, product, selectedVariant: variant, quantity }];
    });
    showToast(`${quantity}x ${product.name} (${variant.weight}) masuk keranjang.`);
  };

  const handleUpdateQuantity = (productId: string, variantWeight: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.selectedVariant.weight === variantWeight) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string, variantWeight: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedVariant.weight === variantWeight)
      )
    );
  };

  const handleApplyPromo = (code: string) => {
    const clean = code.toUpperCase().trim();
    if (clean === 'MAXMORE10' || clean === 'ORGANIK10') {
      const sub = cartItems.reduce((acc, i) => acc + i.selectedVariant.price * i.quantity, 0);
      setDiscount(Math.round(sub * 0.1));
      return true;
    }
    return false;
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenLiveChat = (context?: string) => {
    setChatInitialContext(context);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-800 selection:text-white">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-medium shadow-xl flex items-center gap-2 border border-stone-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      <main className="flex-1">
        {/* 1. Single-Photo Product Storefront Hero */}
        <Hero
          onAddToCart={handleAddToCart}
          onOpenConsultation={() => handleScrollToSection('konsultasi')}
          onOpenDosage={() => handleScrollToSection('dosis')}
        />

        {/* 2. Penghitungan Dosis & Cara Menjadikan Pupuk Cair */}
        <DosageAndLiquidSection onAddToCart={handleAddToCart} />

        {/* 3. Simple AI Plant Consultation */}
        <ConsultationSection
          onAddToCart={handleAddToCart}
          onOpenLiveChat={handleOpenLiveChat}
        />

        {/* 4. Official Payment & Pickup / Out-of-Town Delivery Info Strip */}
        <section id="pembayaran" className="py-12 bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Transfer BCA Only */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <Landmark className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-display">Pembayaran Transfer BCA</h3>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                    Hanya melalui rekening resmi:<br />
                    <strong className="font-mono text-stone-900">BCA 3530954837</strong><br />
                    a.n. <strong>BRIAN DWI RISWANTO</strong>
                  </p>
                </div>
              </div>

              {/* Pengambilan di Rumah Semarang */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-display">Proses Pengambilan di Rumah</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Jl. Banteng Utara No.14, Pandean Lamper, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50249
                  </p>
                </div>
              </div>

              {/* Konsultasi Pengiriman Luar Kota */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <Truck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-display">Pengiriman Luar Kota</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed mb-2.5">
                    Untuk pembeli di luar Semarang, tersedia konsultasi ekspedisi dan ongkos kirim terlebih dahulu.
                  </p>
                  <a
                    href={`https://wa.me/6281395037157?text=${encodeURIComponent(
                      'Halo MAX MORE, saya ingin konsultasi pengiriman luar kota.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Konsultasi via WhatsApp (0813-9503-7157) →</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer onScrollToSection={handleScrollToSection} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        discount={discount}
        onApplyPromo={handleApplyPromo}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discount={discount}
        onOrderCreated={(createdOrder) => {
          setActiveOrder(createdOrder);
          setIsCheckoutOpen(false);
          setIsPaymentGatewayOpen(true);
        }}
        onOpenShippingConsultation={(ctx) => handleOpenLiveChat(ctx)}
      />

      <PaymentGatewayModal
        order={activeOrder}
        isOpen={isPaymentGatewayOpen}
        onClose={() => setIsPaymentGatewayOpen(false)}
        onPaymentSuccess={(paidOrder) => {
          setActiveOrder(paidOrder);
          setIsPaymentGatewayOpen(false);
          setCartItems([]);
          setIsOrderSuccessOpen(true);
        }}
      />

      <OrderSuccessModal
        order={activeOrder}
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        onShopAgain={() => {
          setIsOrderSuccessOpen(false);
          handleScrollToSection('produk');
        }}
        onOpenShippingConsultation={(ctx) => handleOpenLiveChat(ctx)}
      />

      <ConsultationChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={chatInitialContext}
      />
    </div>
  );
}
