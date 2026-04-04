# Setup Background Music Storage

## Error yang Terjadi
```
StorageApiError: new row violates row-level security policy
```

Error ini terjadi karena bucket `wedding-music` belum memiliki RLS policy yang benar untuk upload file.

## Solusi: Jalankan SQL Script

### Langkah 1: Buka Supabase Dashboard
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik menu **SQL Editor** di sidebar kiri

### Langkah 2: Jalankan SQL Script
1. Klik tombol **New Query**
2. Copy semua isi file `supabase/setup-music-storage.sql`
3. Paste ke SQL Editor
4. Klik tombol **Run** atau tekan `Ctrl+Enter`

### Langkah 3: Verifikasi
Setelah SQL berhasil dijalankan, cek:

1. **Bucket sudah dibuat:**
   - Buka menu **Storage** di sidebar
   - Pastikan bucket `wedding-music` muncul
   - Bucket harus berstatus **Public**

2. **Policies sudah aktif:**
   - Klik bucket `wedding-music`
   - Klik tab **Policies**
   - Pastikan ada 4 policies:
     - ✅ Authenticated users can upload music
     - ✅ Authenticated users can update own music
     - ✅ Authenticated users can delete own music
     - ✅ Public can view music

### Langkah 4: Test Upload
1. Kembali ke Admin Panel
2. Buka **Wedding Info Editor**
3. Scroll ke section **Background Music**
4. Klik **Choose MP3 or MP4 File**
5. Pilih file musik (max 10MB)
6. Upload harus berhasil tanpa error

## Troubleshooting

### Jika masih error setelah run SQL:
1. Refresh browser (Ctrl+F5)
2. Logout dan login kembali
3. Clear browser cache

### Jika bucket sudah ada sebelumnya:
SQL script akan otomatis update bucket yang sudah ada dengan policy yang benar.

### Jika ingin manual setup via UI:
1. Buka **Storage** → **Policies**
2. Klik **New Policy**
3. Pilih template atau custom policy
4. Pastikan policy mengizinkan authenticated users untuk INSERT/UPDATE/DELETE

## File Size & Format
- **Max size:** 10MB
- **Format:** MP3, MP4
- **Recommended:** MP3 untuk file size lebih kecil

## Notes
- Bucket bersifat **public** agar musik bisa diakses oleh tamu undangan
- RLS policy memastikan hanya user yang login bisa upload/delete
- File lama otomatis terhapus saat upload file baru
