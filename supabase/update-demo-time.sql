-- Update demo wedding time to 10:00 WIB - selesai
UPDATE weddings 
SET 
  akad_date = '2025-11-15 10:00:00+07',
  akad_end = NULL,
  resepsi_date = '2025-11-15 10:00:00+07',
  resepsi_end = NULL,
  groom_name = 'Indra',
  groom_full_name = 'Indra Putra Pratama',
  groom_father = 'Mr. Budi Santoso',
  groom_mother = 'Mrs. Siti Rahayu',
  bride_name = 'Indah',
  bride_full_name = 'Indah Permata Sari',
  bride_father = 'Mr. Agus Wijaya',
  bride_mother = 'Mrs. Dewi Lestari'
WHERE slug = 'demo';

-- Update gift registry names
UPDATE gift_registry 
SET account_name = 'Indra Putra Pratama'
WHERE wedding_id = 'b2d6e798-ebc4-478d-a69c-7a9655749bdc' 
  AND account_number = '1234567890';

UPDATE gift_registry 
SET account_name = 'Indah Permata Sari'
WHERE wedding_id = 'b2d6e798-ebc4-478d-a69c-7a9655749bdc' 
  AND account_number = '0987654321';

UPDATE gift_registry 
SET account_name = 'Indra'
WHERE wedding_id = 'b2d6e798-ebc4-478d-a69c-7a9655749bdc' 
  AND type = 'ewallet';
