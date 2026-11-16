import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "15mb" }));

const STORE_ADDRESS =
  "Jl. Banteng Utara No.14, Pandean Lamper, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50249";

interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  deliveryType: "pickup" | "luar_kota";
  address: string;
  city: string;
  pickupSchedule?: string;
  paymentMethod: "transfer_bca";
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
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string;
  paidAt?: string;
}

const orders = new Map<string, OrderRecord>();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API: Plant Consultation with Gemini AI
app.post("/api/gemini/consultation", async (req, res) => {
  try {
    const { plantName, plantType, symptoms, soilType, landArea } = req.body;

    const systemInstruction = `Anda adalah Dokter Tanaman & Spesialis Agronomi Organik dari brand MAX MORE – Organic Fertilizer (Solusi Nutrisi Organik untuk Tanah Lebih Subur).
Karakter Anda: Ramah, ringkas, jelas, dan solutif.
Spesifikasi Resmi MAX MORE – Organic Fertilizer:
- Kandungan NPK total lebih dari 6%.
- C-Organik lebih dari 27%.
- Rasio C/N kurang dari 14.
- pH 6.
- Mengandung mineral esensial lengkap: Na, Cu, Ca, Zn, Mg, Fe, S, dan B.
- Membantu memperbaiki kualitas tanah, mendukung pertumbuhan tanaman, dan menjaga kesuburan tanah secara berkelanjutan.
- Kemasan tersedia: 2 kg (Rp 20.000) dan 5 kg (Rp 40.000). Bisa diaplikasikan padat (tabur) maupun dilarutkan menjadi pupuk cair (kocor: 10-20 gram per 1 liter air).
- Lokasi pengambilan rumah: ${STORE_ADDRESS}. Bisa konsultasi untuk pengiriman luar kota. Pembayaran hanya melalui Transfer BCA 3530954837 a.n. BRIAN DWI RISWANTO.

Berikan jawaban yang singkat, padat, terstruktur rapi dalam 3 bagian:
1. 🩺 DIAGNOSIS SINGKAT: Jelaskan penyebab utama keluhan tanaman (misal defisiensi hara NPK/mineral mikro seperti Ca, Mg, Fe, Zn, B, atau tanah padat/asam).
2. 📦 DOSIS PUPUK MAX MORE (PADAT & CAIR): Berikan takaran spesifik baik untuk aplikasi tabur padat maupun cara melarutkannya menjadi pupuk cair/kocor (gram/liter air) sesuai tanaman.
3. 💡 TIPS PERAWATAN: 2-3 langkah perawatan harian agar tanaman cepat pulih.
Gunakan format poin-poin singkat agar mudah dibaca.`;

    const promptText = `Halo Dokter Tanaman MAX MORE, mohon konsultasikan tanaman saya:
- Tanaman: ${plantName || "Tanaman"} (${plantType || "Umum"})
- Keluhan: ${symptoms || "Pertumbuhan lambat, daun menguning, atau tanah keras"}
- Kondisi Tanah: ${soilType || "Tanah kebun / pot biasa"}
- Skala: ${landArea || "Kebun rumah"}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ parts: [{ text: promptText }] }],
        config: { systemInstruction },
      });
    } catch (apiError: any) {
      console.warn("Gemini first attempt error, retrying...", apiError?.message);
      await new Promise((r) => setTimeout(r, 600));
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ parts: [{ text: promptText }] }],
        config: { systemInstruction },
      });
    }

    return res.json({
      success: true,
      diagnosis:
        response?.text ||
        "Tanaman Anda membutuhkan nutrisi NPK total >6%, C-Organik >27%, serta mineral makro-mikro lengkap dari MAX MORE – Organic Fertilizer.",
    });
  } catch (error: any) {
    console.error("Gemini Consultation Error:", error);

    const plant = req.body.plantName || "Tanaman Anda";
    const symptomDesc = req.body.symptoms || "daun menguning dan tanah memadat";
    const customAdvice = `🩺 **DIAGNOSIS SINGKAT (${plant}):**
Keluhan *${symptomDesc}* umumnya disebabkan oleh menurunnya C-Organik tanah serta kekurangan unsur hara makro (NPK) dan mineral mikro (Mg, Fe, Ca, B, Zn).

📦 **DOSIS PUPUK MAX MORE (PADAT & CAIR):**
- **Aplikasi Padat (Tabur):** Berikan 25–50 gram (2–3 sdm) per pot atau 150–250 gram per pohon di sekeliling tajuk setiap 14 hari.
- **Aplikasi Pupuk Cair (Kocor):** Larutkan 15 gram **MAX MORE** per 1 Liter air (150 gram per 10 Liter air), aduk dan diamkan 12–24 jam, lalu siramkan 200 ml ke area akar setiap minggu.

💡 **TIPS PERAWATAN:**
1. Gemburkan permukaan tanah sebelum aplikasi agar oksigen dan mineral (Na, Cu, Ca, Zn, Mg, Fe, S, B) cepat terserap akar.
2. Siram air secukupnya dan pastikan drainase media tanam lancar.`;

    return res.json({
      success: true,
      diagnosis: customAdvice,
      isFallback: true,
    });
  }
});

// API: Quick follow-up chat with Agronomist & Shipping Consultation AI
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        systemInstruction: `Anda adalah asisten konsultan tanaman dan pemesanan MAX MORE – Organic Fertilizer.
Informasi Resmi:
- Produk: MAX MORE – Organic Fertilizer (2 kg Rp 20.000, 5 kg Rp 40.000).
- Alamat pengambilan di rumah: ${STORE_ADDRESS}.
- Pengiriman luar kota: Bisa konsultasi pengiriman luar kota Semarang lewat WhatsApp 0813-9503-7157 (bantu estimasikan kebutuhan berat & sarankan konfirmasi kota tujuan + ongkir kargo terbaik).
- Pembayaran: Hanya menerima Transfer Bank BCA 3530954837 atas nama BRIAN DWI RISWANTO.
Jawab dengan singkat, padat, ramah, dan membantu.`,
      },
    });

    const response = await chat.sendMessage({
      message: message || "Halo MAX MORE",
    });

    return res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.json({
      success: true,
      reply: `Untuk pengambilan di rumah silakan datang ke ${STORE_ADDRESS}. Untuk konsultasi pemesanan & pengiriman luar kota silakan hubungi WhatsApp 0813-9503-7157. Pembayaran hanya melalui Transfer BCA 3530954837 a.n. BRIAN DWI RISWANTO.`,
      isFallback: true,
    });
  }
});

// API: Create Order (Transfer BCA only + Pickup or Out-of-town Consultation)
app.post("/api/orders/create", (req, res) => {
  try {
    const {
      customerName,
      phone,
      deliveryType,
      address,
      city,
      pickupSchedule,
      items,
      subtotal,
      discount,
      total,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Keranjang belanja kosong." });
    }

    const orderId = `MM-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const isPickup = deliveryType !== "luar_kota";

    const order: OrderRecord = {
      id: orderId,
      customerName: customerName || "Pelanggan Terhormat",
      phone: phone || "-",
      deliveryType: isPickup ? "pickup" : "luar_kota",
      address: isPickup ? STORE_ADDRESS : address || "-",
      city: isPickup ? "Kota Semarang" : city || "-",
      pickupSchedule: isPickup ? pickupSchedule || "Konfirmasi via WhatsApp" : undefined,
      paymentMethod: "transfer_bca",
      bankName: "BCA",
      accountNumber: "3530954837",
      accountHolder: "BRIAN DWI RISWANTO",
      items,
      subtotal,
      discount: discount || 0,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    orders.set(orderId, order);

    return res.json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API: Simulate Payment Success
app.post("/api/orders/:orderId/simulate-payment", (req, res) => {
  const { orderId } = req.params;
  const order = orders.get(orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: "Pesanan tidak ditemukan." });
  }

  order.status = "paid";
  order.paidAt = new Date().toISOString();
  orders.set(orderId, order);

  return res.json({
    success: true,
    message: "Pembayaran berhasil diverifikasi!",
    order,
  });
});

// API: Get Order
app.get("/api/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const order = orders.get(orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: "Pesanan tidak ditemukan." });
  }
  return res.json({ success: true, order });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MAX MORE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
