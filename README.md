# 🌱 Aplikasi Monitoring Kelembapan Tanah

Aplikasi monitoring kelembapan tanah real-time yang dibangun dengan React, TypeScript, dan Firebase. Aplikasi ini memberikan petani dan pekebun wawasan komprehensif tentang tingkat kelembapan tanah melalui visualisasi interaktif dan analisis data historis.

## 🔌 Kompatibilitas Sensor

Aplikasi ini kompatibel dengan berbagai jenis sensor kelembapan tanah, termasuk:
- **ESP32/ESP8266** dengan sensor kelembapan tanah analog/digital
- **Arduino** dengan modul sensor kelembapan
- **Raspberry Pi** dengan sensor I2C/SPI
- **Sensor analog** (FC-28, YL-69, dll.)
- **Sensor digital** (Capacitive Soil Moisture Sensor)
- **Sensor profesional** (TDR, FDR, dll.)

Data sensor dapat dikirim ke Firebase melalui HTTP API, MQTT, atau protokol komunikasi lainnya.

## ✨ Fitur

### 📊 Monitoring Real-time
- **Gauge Kelembapan Langsung**: Gauge visual menampilkan persentase kelembapan tanah saat ini
- **Indikator Status**: Status berwarna menunjukkan kondisi tanah (Sangat Kering, Kering, Baik, Lembab)
- **Update Real-time**: Refresh data otomatis dari Firebase

### 📈 Visualisasi Data
- **Grafik Interaktif**: Grafik garis menunjukkan tren kelembapan dari waktu ke waktu
- **Analisis Historis**: Lihat data berdasarkan hari, minggu, atau bulan
- **Ringkasan Statistik**: Rata-rata, minimum, dan maksimum nilai kelembapan

### 📱 Antarmuka Pengguna
- **Desain Responsif**: Berfungsi mulus di desktop dan perangkat mobile
- **UI Modern**: Antarmuka yang bersih, intuitif dengan animasi halus
- **Bahasa Indonesia**: Sepenuhnya dilokalisasi untuk pengguna Indonesia

### 🔍 Manajemen Data
- **Filter Fleksibel**: Filter data berdasarkan bulan dan tahun tertentu
- **Penyimpanan Data**: Penyimpanan cloud aman dengan Firebase Realtime Database
- **Penanganan Error**: Manajemen error yang kuat dan umpan balik pengguna

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1, TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2
- **Styling**: CSS Modules
- **Charts**: Recharts 3.1.2
- **Icons**: Lucide React 0.542.0
- **Routing**: React Router DOM 7.8.2
- **Backend**: Firebase 12.1.0 (Realtime Database)
- **Date Handling**: date-fns 4.1.0
- **Package Manager**: pnpm

## 🚀 Memulai

### Prasyarat

- Node.js (v18 atau lebih tinggi)
- pnpm (direkomendasikan) atau npm
- Proyek Firebase dengan Realtime Database diaktifkan

### Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd moisture-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # atau
   npm install
   ```

3. **Setup Environment**
   
   Buat file `.env` di direktori root dengan konfigurasi Firebase Anda:
   ```env
   VITE_FIREBASE_API_KEY=kunci_api_anda
   VITE_FIREBASE_AUTH_DOMAIN=domain_auth_anda
   VITE_FIREBASE_DATABASE_URL=url_database_anda
   VITE_FIREBASE_PROJECT_ID=id_proyek_anda
   VITE_FIREBASE_STORAGE_BUCKET=bucket_storage_anda
   VITE_FIREBASE_MESSING_SENDER_ID=id_messaging_anda
   VITE_FIREBASE_APP_ID=id_aplikasi_anda
   ```

4. **Jalankan development server**
   ```bash
   pnpm dev
   # atau
   npm run dev
   ```

5. **Buka browser**
   
   Navigasi ke `http://localhost:5173` untuk melihat aplikasi.

### Build untuk Production

```bash
pnpm build
# atau
npm run build
```

File yang sudah di-build akan berada di direktori `dist`.

## 📁 Struktur Proyek

```
moisture-app/
├── src/
│   ├── components/           # Komponen React
│   │   ├── layout/          # Komponen layout (Header, Footer, Moisture)
│   │   ├── pages/           # Komponen halaman (Home, History)
│   │   └── ui/              # Komponen UI yang dapat digunakan kembali
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Konfigurasi dan layanan Firebase
│   ├── types/               # Definisi tipe TypeScript
│   ├── constants/           # Konstanta aplikasi dan panduan
│   ├── routes/              # Konfigurasi routing
│   └── styles/              # Style global
├── public/                  # Asset statis
├── api/                     # Endpoint API
```

## 🔧 Konfigurasi

### Setup Firebase

1. Buat proyek Firebase baru di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan Realtime Database
3. Atur aturan database sesuai kebutuhan Anda
4. Salin konfigurasi Firebase ke file `.env`

### Struktur Database

Aplikasi mengharapkan struktur data Firebase berikut:

```json
{
  "current": {
    "moisture": 45.5,
    "timestamp": 1703123456789
  },
  "history": {
    "2024-01-15": {
      "moisture": 45.5,
      "timestamp": 1703123456789
    }
  }
}
```

### Integrasi Sensor

Untuk mengintegrasikan sensor kelembapan tanah dengan aplikasi ini:

1. **Setup Hardware**: Sambungkan sensor kelembapan ke ESP32/Arduino/Raspberry Pi
2. **Program Mikrokontroler**: Buat program untuk membaca data sensor dan mengirim ke Firebase
3. **Format Data**: Pastikan data dikirim dalam format JSON yang sesuai dengan struktur database
4. **Interval Pengiriman**: Atur interval pengiriman data (misalnya setiap 5-10 menit)

Contoh kode Arduino/ESP32 untuk mengirim data ke Firebase:
```cpp
// Contoh kode untuk ESP32
#include <WiFi.h>
#include <FirebaseESP32.h>

// Konfigurasi WiFi dan Firebase
#define WIFI_SSID "nama_wifi"
#define WIFI_PASSWORD "password_wifi"
#define FIREBASE_HOST "proyek-anda.firebaseio.com"
#define FIREBASE_AUTH "kunci_auth_anda"

FirebaseData firebaseData;

void setup() {
  // Inisialisasi WiFi dan Firebase
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void loop() {
  // Baca data sensor
  int sensorValue = analogRead(A0);
  float moisture = map(sensorValue, 0, 4095, 100, 0); // Konversi ke persentase
  
  // Kirim data ke Firebase
  Firebase.setFloat(firebaseData, "/current/moisture", moisture);
  Firebase.setInt(firebaseData, "/current/timestamp", millis());
  
  delay(300000); // Tunggu 5 menit
}
```

## 🎯 Penggunaan

### Halaman Utama
- Lihat tingkat kelembapan tanah saat ini dengan gauge interaktif
- Lihat indikator status real-time
- Akses panduan klasifikasi kelembapan
- Lihat tren kelembapan terbaru dalam grafik

### Halaman Riwayat
- Filter data berdasarkan hari, minggu, atau bulan
- Pilih bulan dan tahun tertentu
- Lihat statistik detail (rata-rata, min, max)
- Analisis tren dan pola historis

## 🎨 Kustomisasi

### Styling
- Modifikasi CSS modules di direktori komponen
- Update style global di `src/styles/global.css`
- Kustomisasi skema warna dan tema

### Threshold Kelembapan
- Sesuaikan threshold status kelembapan di komponen StatusItem
- Modifikasi klasifikasi panduan kelembapan

### Interval Data
- Ubah interval pengumpulan data di Firebase
- Sesuaikan rentang waktu dan interval grafik

## 🚀 Deployment

### Vercel (Direkomendasikan)
1. Hubungkan repository GitHub Anda ke Vercel
2. Tambahkan environment variables di dashboard Vercel
3. Deploy otomatis saat push ke branch main

### Platform Lain
- **Netlify**: Build command: `pnpm build`, Publish directory: `dist`
- **Firebase Hosting**: Gunakan `firebase deploy` setelah konfigurasi
- **GitHub Pages**: Konfigurasi untuk static site hosting

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/fitur-menarik`)
3. Commit perubahan Anda (`git commit -m 'Tambahkan fitur menarik'`)
4. Push ke branch (`git push origin feature/fitur-menarik`)
5. Buka Pull Request

## 📝 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🆘 Dukungan

Untuk dukungan dan pertanyaan:
- Buat issue di repository GitHub
- Periksa dokumentasi di komentar kode
- Review dokumentasi Firebase untuk masalah backend

Dibuat dengan ❤️ untuk praktik pertanian dan berkebun yang lebih baik.
