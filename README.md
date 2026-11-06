# site-preview-capture

Script otomatis untuk mengambil tangkapan layar (screenshot) website pada berbagai resolusi perangkat (desktop, tablet, mobile) dengan kualitas Retina (2x/3x DPR) untuk kebutuhan mockup design preview.

## Persyaratan
- Node.js (v18+)
- Google Chrome terpasang di sistem (`/Applications/Google Chrome.app`)

## Instalasi Dependensi
```bash
cd /Users/user/.gemini/antigravity/scratch/site-preview-capture
npm install
```

## Penggunaan

### 1. Menjalankan CLI Langsung
```bash
./cli.js https://example.com
```

### 2. Opsi Perintah
```bash
# Menentukan folder output
./cli.js https://example.com --out ./mockups

# Screenshot halaman penuh (full page)
./cli.js https://example.com --full

# Memilih perangkat tertentu saja
./cli.js https://example.com --devices mobile,desktop

# Menambahkan jeda waktu render (misal: 1000ms untuk animasi/hydration)
./cli.js https://example.com --delay 1000
```

### 3. Menggunakan Sebagai Modul Node.js
```javascript
const { captureSitePreviews } = require('./capture');

async function main() {
  const results = await captureSitePreviews({
    url: 'https://example.com',
    outDir: './output',
    fullPage: false,
    delayMs: 500,
    deviceNames: ['desktop', 'tablet', 'mobile']
  });
  console.log(results);
}

main();
```

## Spesifikasi Perangkat
| Perangkat | Resolusi Viewport | Skala Layar (DPR) | Output Gambar (Pixel) |
| :--- | :--- | :--- | :--- |
| **Desktop** | 1440 x 900 | 2x | 2880 x 1800 |
| **Tablet** | 768 x 1024 | 2x | 1536 x 2048 |
| **Mobile** | 375 x 812 | 3x | 1125 x 2436 |
