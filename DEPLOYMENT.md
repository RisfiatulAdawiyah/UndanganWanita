# Deployment ke Vercel

## Status Optimasi

### ✅ Yang Sudah Dioptimasi:
- Lazy loading untuk komponen besar
- Code splitting dengan manual chunks
- CSS minification (97KB → 18KB gzip)
- Terser minification dengan drop console
- Cache headers untuk assets
- Responsive design untuk semua ukuran layar

### ⚠️ Rekomendasi Sebelum Deploy:

#### 1. Optimasi Gambar (PENTING!)
Gambar saat ini terlalu besar (1.3MB - 2.3MB per file). Lakukan:

```bash
# Install sharp untuk optimasi gambar
npm install -D sharp

# Atau gunakan online tools:
# - TinyPNG (https://tinypng.com)
# - Squoosh (https://squoosh.app)
```

**Target ukuran:**
- Hero images: < 200KB (gunakan WebP format)
- Couple photos: < 150KB per foto
- Icons/patterns: < 50KB

#### 2. Gunakan WebP Format
Ganti semua PNG dengan WebP untuk ukuran 70% lebih kecil:
- couple1.png → couple1.webp
- couple2.png → couple2.webp
- dll.

## Langkah Deploy ke Vercel

### 1. Install Vercel CLI (Opsional)
```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard (Recommended)

1. Push code ke GitHub/GitLab/Bitbucket
2. Buka https://vercel.com
3. Klik "New Project"
4. Import repository Anda
5. Set konfigurasi:
   - **Framework Preset:** Vite
   - **Root Directory:** desain
   - **Build Command:** npm run build
   - **Output Directory:** dist

### 3. Environment Variables

Tambahkan di Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploy via CLI (Alternative)

```bash
cd desain
vercel
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? wedding-invitation
- Directory? ./
- Override settings? No

## Post-Deployment Checklist

- [ ] Test di mobile devices
- [ ] Test autoplay musik (mungkin diblokir browser)
- [ ] Verify Supabase connection
- [ ] Test RSVP form submission
- [ ] Check image loading speed
- [ ] Test navigation menu
- [ ] Verify responsive design

## Performance Tips

### Lighthouse Score Target:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Monitoring:
- Gunakan Vercel Analytics untuk monitoring
- Check Web Vitals di Vercel Dashboard

## Troubleshooting

### Musik tidak autoplay:
- Normal behavior di Chrome/Safari
- User harus interact dulu dengan page
- Sudah ada fallback handling

### Images loading lambat:
- Optimasi gambar ke WebP
- Gunakan lazy loading (sudah implemented)
- Consider CDN untuk images

### Build gagal:
```bash
# Clear cache dan rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Custom Domain (Opsional)

1. Beli domain di Namecheap/GoDaddy
2. Di Vercel Dashboard → Settings → Domains
3. Add domain dan ikuti instruksi DNS

## Estimasi Performa Saat Ini

**Bundle Size:**
- JavaScript: ~273 KB (gzip)
- CSS: ~18 KB (gzip)
- Images: ~12 MB (PERLU OPTIMASI!)

**Load Time (estimasi):**
- First Contentful Paint: ~1.5s
- Time to Interactive: ~3s
- Full Load: ~8s (karena gambar besar)

**Setelah Optimasi Gambar:**
- First Contentful Paint: ~1s
- Time to Interactive: ~2s
- Full Load: ~3s ✅

## Support

Jika ada masalah deployment, check:
- Vercel deployment logs
- Browser console untuk errors
- Network tab untuk failed requests
