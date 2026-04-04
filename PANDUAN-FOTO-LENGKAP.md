# 📸 PANDUAN LENGKAP KEBUTUHAN FOTO UNDANGAN PERNIKAHAN

## 🎯 RINGKASAN CEPAT

**Total Foto Minimum:** 8-10 foto  
**Total Foto Ideal:** 12-15 foto  
**Total Foto Maksimal:** 20-25 foto

---

## 📋 KEBUTUHAN FOTO BERDASARKAN SECTION

### 1. COVER IMAGE (1 foto) - WAJIB ⭐⭐⭐
**Lokasi:** Halaman pembuka (Cover Screen)  
**Jenis:** Foto couple/berdua  
**Spesifikasi:**
- Resolusi: 1920x1280px (landscape) atau lebih tinggi
- Format: JPG/PNG
- Ukuran file: Max 2MB (untuk loading cepat)
- Orientasi: Landscape (horizontal)

**Rekomendasi Foto:**
- ✅ Foto couple formal/prewedding terbaik
- ✅ Background blur/bokeh untuk fokus ke mempelai
- ✅ Pencahayaan bagus, tidak terlalu gelap
- ✅ Ekspresi bahagia, senyum natural
- ❌ Hindari foto terlalu ramai/banyak orang
- ❌ Hindari foto dengan background berantakan

**Contoh Pose:**
- Berdiri berdampingan, saling berpegangan tangan
- Duduk berdampingan dengan background alam
- Berdiri dengan background gedung/landmark

---

### 2. HERO IMAGE (1 foto) - OPSIONAL
**Lokasi:** Section hero (setelah cover dibuka)  
**Jenis:** Foto couple/berdua  
**Spesifikasi:**
- Resolusi: 1920x1280px atau lebih
- Format: JPG/PNG
- Ukuran file: Max 2MB

**Catatan:** 
- Saat ini menggunakan pattern Islamic sebagai background
- Jika ingin ganti dengan foto, gunakan foto couple yang berbeda dari cover
- Foto akan di-overlay dengan pattern, jadi pilih foto dengan kontras bagus

---

### 3. GALERI FOTO (6-20 foto) - WAJIB ⭐⭐⭐

#### A. KOMPOSISI IDEAL (12 foto total)

**Foto Couple/Berdua: 6-8 foto (50-60%)**
1. Foto prewedding outdoor (taman/pantai/gunung)
2. Foto prewedding indoor (studio/cafe)
3. Foto casual couple (jalan-jalan)
4. Foto formal couple (baju adat/kebaya)
5. Foto romantis (pelukan/pegangan tangan)
6. Foto candid couple (tertawa bersama)
7. Foto close-up couple (wajah)
8. Foto siluet couple (sunset/backlight)

**Foto Mempelai Pria Sendiri: 2-3 foto (20-25%)**
1. Foto portrait formal (jas/baju adat)
2. Foto casual (senyum natural)
3. Foto candid (sedang melakukan aktivitas)

**Foto Mempelai Wanita Sendiri: 2-3 foto (20-25%)**
1. Foto portrait formal (kebaya/gaun)
2. Foto casual (senyum natural)
3. Foto candid (sedang melakukan aktivitas)

**Foto Detail/Dekorasi: 1-2 foto (5-10%)** - OPSIONAL
1. Foto cincin/hantaran
2. Foto bunga/dekorasi

---

#### B. KOMPOSISI MINIMUM (8 foto total)

**Foto Couple/Berdua: 4-5 foto**
1. Foto prewedding outdoor
2. Foto prewedding indoor
3. Foto formal couple
4. Foto romantis couple
5. Foto candid couple

**Foto Mempelai Pria: 1-2 foto**
1. Foto portrait formal

**Foto Mempelai Wanita: 1-2 foto**
1. Foto portrait formal

---

#### C. KOMPOSISI MAKSIMAL (20 foto total)

**Foto Couple/Berdua: 12 foto**
- Berbagai pose dan lokasi
- Mix formal & casual
- Indoor & outdoor

**Foto Mempelai Pria: 4 foto**
- Portrait formal
- Casual
- Candid
- Close-up

**Foto Mempelai Wanita: 4 foto**
- Portrait formal
- Casual
- Candid
- Close-up

---

## 🎨 LAYOUT GALERI & SPAN CLASS

Galeri menggunakan CSS Grid dengan layout dinamis. Anda bisa mengatur ukuran foto dengan `span_class`:

### Ukuran Foto:
- **Default (kosong):** 1 kolom x 1 baris (foto kecil)
- **`col-span-2`:** 2 kolom x 1 baris (foto lebar)
- **`row-span-2`:** 1 kolom x 2 baris (foto tinggi)
- **`col-span-2 row-span-2`:** 2 kolom x 2 baris (foto besar)

### Rekomendasi Layout (12 foto):

```
Foto 1: col-span-2 row-span-2  (Foto couple terbaik - BESAR)
Foto 2: default                 (Foto pria)
Foto 3: default                 (Foto wanita)
Foto 4: col-span-2              (Foto couple - LEBAR)
Foto 5: default                 (Foto couple)
Foto 6: row-span-2              (Foto wanita - TINGGI)
Foto 7: default                 (Foto pria)
Foto 8: col-span-2              (Foto couple - LEBAR)
Foto 9: default                 (Foto couple)
Foto 10: default                (Foto couple)
Foto 11: row-span-2             (Foto pria - TINGGI)
Foto 12: default                (Foto couple)
```

**Tips Layout:**
- Foto terbaik/favorit → gunakan `col-span-2 row-span-2` (besar)
- Foto landscape → gunakan `col-span-2` (lebar)
- Foto portrait → gunakan `row-span-2` (tinggi)
- Foto biasa → default (kecil)

---

## 📐 SPESIFIKASI TEKNIS FOTO

### Resolusi Minimum:
- **Foto Landscape:** 1200x800px
- **Foto Portrait:** 800x1200px
- **Foto Square:** 1000x1000px

### Resolusi Ideal:
- **Foto Landscape:** 1920x1280px
- **Foto Portrait:** 1280x1920px
- **Foto Square:** 1500x1500px

### Format File:
- ✅ JPG (recommended)
- ✅ PNG
- ❌ WEBP (belum support di semua browser lama)
- ❌ GIF (tidak cocok untuk foto)

### Ukuran File:
- **Per foto:** Max 2MB
- **Total semua foto:** Max 30MB
- **Rekomendasi:** 500KB - 1MB per foto (sudah cukup bagus)

### Kualitas:
- **Kompresi:** 80-90% (balance antara kualitas & ukuran)
- **Sharpness:** Jangan terlalu tajam (terlihat tidak natural)
- **Brightness:** Cukup terang, tidak terlalu gelap
- **Contrast:** Sedang, tidak terlalu tinggi

---

## 🎭 TIPS MEMILIH FOTO YANG BAGUS

### ✅ FOTO YANG BAGUS:
1. **Fokus tajam** - Wajah tidak blur
2. **Pencahayaan bagus** - Tidak terlalu gelap/terang
3. **Ekspresi natural** - Senyum tulus, tidak kaku
4. **Background bersih** - Tidak berantakan
5. **Komposisi bagus** - Rule of thirds
6. **Warna seimbang** - Tidak terlalu saturated
7. **Resolusi tinggi** - Tidak pecah/pixelated

### ❌ HINDARI FOTO:
1. **Blur/tidak fokus** - Wajah kabur
2. **Terlalu gelap** - Underexposed
3. **Terlalu terang** - Overexposed
4. **Background berantakan** - Banyak distraksi
5. **Ekspresi kaku** - Senyum dipaksakan
6. **Resolusi rendah** - Pixelated
7. **Foto selfie** - Kualitas biasanya kurang bagus
8. **Foto dengan watermark** - Tidak profesional

---

## 🎨 TEMA & KONSEP FOTO

### Konsep 1: ELEGANT & FORMAL
- Foto studio dengan lighting profesional
- Baju formal (jas, kebaya, gaun)
- Background solid atau minimalis
- Pose formal dan elegan

### Konsep 2: NATURAL & CASUAL
- Foto outdoor (taman, pantai, gunung)
- Baju casual (kemeja, dress)
- Background alam
- Pose natural dan candid

### Konsep 3: TRADITIONAL & CULTURAL
- Foto dengan baju adat
- Background tradisional
- Pose formal dengan sentuhan budaya

### Konsep 4: ROMANTIC & INTIMATE
- Foto close-up couple
- Pose romantis (pelukan, pegangan tangan)
- Background blur/bokeh
- Lighting warm/golden hour

**Rekomendasi:** Mix 2-3 konsep untuk variasi

---

## 📊 CHECKLIST FOTO LENGKAP

### WAJIB (Minimum 8 foto):
- [ ] 1 foto cover (couple terbaik)
- [ ] 4-5 foto couple untuk galeri
- [ ] 1-2 foto mempelai pria
- [ ] 1-2 foto mempelai wanita

### IDEAL (12-15 foto):
- [ ] 1 foto cover
- [ ] 6-8 foto couple (berbagai pose & lokasi)
- [ ] 2-3 foto mempelai pria
- [ ] 2-3 foto mempelai wanita
- [ ] 1-2 foto detail/dekorasi (opsional)

### MAKSIMAL (20-25 foto):
- [ ] 1 foto cover
- [ ] 12-15 foto couple
- [ ] 4-5 foto mempelai pria
- [ ] 4-5 foto mempelai wanita
- [ ] 2-3 foto detail/dekorasi

---

## 🔧 CARA UPLOAD FOTO

### Via Supabase Dashboard (Saat ini):
1. Login ke Supabase Dashboard
2. Buka Storage → wedding-images
3. Upload foto satu per satu
4. Copy URL foto
5. Masukkan ke database table `gallery_photos`

### Via Admin Dashboard (Coming in Phase 3):
- Upload langsung dari admin panel
- Drag & drop multiple files
- Auto resize & compress
- Preview sebelum upload
- Atur urutan dengan drag & drop

---

## 💡 TIPS TAMBAHAN

### Persiapan Foto:
1. **Pilih fotografer profesional** untuk hasil terbaik
2. **Lakukan prewedding** 1-2 bulan sebelum acara
3. **Pilih 2-3 lokasi berbeda** untuk variasi
4. **Siapkan 2-3 set baju** (formal, casual, traditional)
5. **Foto saat golden hour** (pagi/sore) untuk lighting terbaik

### Editing Foto:
1. **Konsisten color grading** - Semua foto tone warna sama
2. **Jangan over-edit** - Tetap natural
3. **Crop dengan baik** - Komposisi seimbang
4. **Compress sebelum upload** - Gunakan tools seperti TinyPNG
5. **Backup foto original** - Simpan versi high-res

### Urutan Foto di Galeri:
1. Mulai dengan foto couple terbaik (besar)
2. Variasi antara couple, pria, wanita
3. Mix formal & casual
4. Akhiri dengan foto romantis/memorable

---

## 📱 CONTOH SKENARIO

### Skenario A: Budget Terbatas (8 foto)
```
Cover: 1 foto couple formal
Galeri:
- 2 foto couple prewedding
- 2 foto couple casual
- 1 foto couple romantis
- 1 foto pria formal
- 1 foto wanita formal
```

### Skenario B: Standard (12 foto)
```
Cover: 1 foto couple terbaik
Galeri:
- 3 foto couple outdoor
- 2 foto couple indoor
- 1 foto couple romantis
- 2 foto pria (formal + casual)
- 2 foto wanita (formal + casual)
- 1 foto detail cincin
```

### Skenario C: Premium (20 foto)
```
Cover: 1 foto couple terbaik
Galeri:
- 5 foto couple outdoor (berbagai pose)
- 3 foto couple indoor
- 2 foto couple formal
- 2 foto couple casual
- 4 foto pria (formal, casual, candid, close-up)
- 4 foto wanita (formal, casual, candid, close-up)
```

---

## ❓ FAQ

**Q: Berapa foto minimum yang harus ada?**  
A: Minimum 8 foto (1 cover + 7 galeri). Tapi ideal 12-15 foto.

**Q: Apakah harus ada foto sendiri-sendiri?**  
A: Tidak wajib, tapi sangat direkomendasikan untuk variasi. Minimal 1-2 foto per mempelai.

**Q: Berapa rasio foto couple vs sendiri?**  
A: Ideal 60% couple, 20% pria, 20% wanita.

**Q: Boleh semua foto couple saja?**  
A: Boleh, tapi kurang variasi. Lebih baik ada mix.

**Q: Ukuran file foto terlalu besar, bagaimana?**  
A: Compress menggunakan tools online seperti TinyPNG, Compressor.io, atau Squoosh.

**Q: Foto blur/pecah saat di-upload, kenapa?**  
A: Kemungkinan resolusi terlalu rendah. Gunakan minimal 1200x800px.

**Q: Bisa upload foto dari HP?**  
A: Bisa, tapi pastikan kualitas bagus (tidak selfie kamera depan).

**Q: Berapa lama proses upload semua foto?**  
A: Tergantung koneksi internet. Estimasi 5-10 menit untuk 12 foto.

---

## 🎯 KESIMPULAN

**Rekomendasi Terbaik:**
- **Total:** 12-15 foto
- **Couple:** 6-8 foto (berbagai pose & lokasi)
- **Pria:** 2-3 foto
- **Wanita:** 2-3 foto
- **Detail:** 1-2 foto (opsional)

**Prioritas:**
1. ⭐⭐⭐ Cover image (1 foto couple terbaik)
2. ⭐⭐⭐ Foto couple untuk galeri (minimal 4 foto)
3. ⭐⭐ Foto mempelai sendiri (minimal 1 per orang)
4. ⭐ Foto detail/dekorasi (opsional)

**Ingat:**
- Kualitas > Kuantitas
- Variasi pose & lokasi
- Konsisten color grading
- Compress sebelum upload
- Atur layout dengan span_class

---

Semoga panduan ini membantu! 🎉💒✨
