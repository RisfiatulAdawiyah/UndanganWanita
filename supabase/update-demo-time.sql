-- Update demo wedding time to 10:00 WIB - selesai
UPDATE weddings 
SET 
  akad_date = '2025-11-15 10:00:00+07',
  akad_end = NULL,
  resepsi_date = '2025-11-15 10:00:00+07',
  resepsi_end = NULL
WHERE slug = 'demo';
