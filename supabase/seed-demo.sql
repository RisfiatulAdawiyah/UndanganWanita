-- ============================================
-- SEED DATA FOR DEMO WEDDING
-- ============================================
-- Run this after creating the schema to populate demo data

-- Create demo user (password: demo123456)
-- Note: In production, create users via Supabase Auth UI or API
-- This is just for reference

-- Insert demo wedding
INSERT INTO weddings (
  id,
  user_id,
  slug,
  groom_name,
  groom_full_name,
  groom_father,
  groom_mother,
  bride_name,
  bride_full_name,
  bride_father,
  bride_mother,
  wedding_date,
  akad_date,
  akad_end,
  akad_venue,
  akad_address,
  akad_maps_url,
  resepsi_date,
  resepsi_end,
  resepsi_venue,
  resepsi_address,
  resepsi_maps_url,
  main_verse_arabic,
  main_verse_transliteration,
  main_verse_translation,
  main_verse_reference,
  quote_verse_arabic,
  quote_verse_translation,
  quote_verse_reference,
  cover_image_url,
  is_published,
  show_gift_registry,
  show_guest_list
) VALUES (
  'b2d6e798-ebc4-478d-a69c-7a9655749bdc',
  'b2d6e798-ebc4-478d-a69c-7a9655749bdc',
  'demo',
  'Ahmad',
  'Ahmad bin Abdullah',
  'Mr. Abdullah',
  'Mrs. Aminah',
  'Fatimah',
  'Fatimah binti Ibrahim',
  'Mr. Ibrahim',
  'Mrs. Khadijah',
  '2025-11-15',
  '2025-11-15 08:00:00+07',
  '2025-11-15 10:00:00+07',
  'Al-Akbar Grand Mosque',
  'Jl. Masjid Agung No.1, Jakarta Pusat, DKI Jakarta',
  'https://maps.google.com',
  '2025-11-15 11:00:00+07',
  '2025-11-15 14:00:00+07',
  'The Grand Ballroom',
  'Hotel Mulia, Jl. Asia Afrika, Jakarta Pusat, DKI Jakarta',
  'https://maps.google.com',
  'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  'Wa min aayaatihee an khalaqa lakum min anfusikum azwaajal litaskunoo ilaihaa wa ja''ala bainakum mawaddataw wa rahmah',
  'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.',
  'Ar-Rum: 21',
  'وَخَلَقْنَاكُمْ أَزْوَاجًا',
  'And We created you in pairs.',
  'An-Naba: 8',
  NULL,
  TRUE,
  TRUE,
  FALSE
);

-- Insert love story timeline
INSERT INTO love_stories (wedding_id, date, title, description, icon, order_index) VALUES
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'January 2020', 'First Meeting', 'We first met at a community gathering and shared a meaningful conversation.', 'sparkles', 0),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'June 2021', 'Growing Closer', 'Our friendship blossomed into something deeper and more beautiful.', 'star', 1),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'March 2023', 'The Proposal', 'With family blessings, a heartfelt proposal marked the beginning of our journey.', 'heart', 2),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'August 2024', 'The Engagement', 'Surrounded by loved ones, we celebrated our engagement ceremony.', 'gift', 3),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'November 2025', 'Our Wedding', 'The day we''ve been waiting for — joining our lives together.', 'party-popper', 4);

-- Insert gift registry
INSERT INTO gift_registry (wedding_id, type, account_name, account_number, bank_name, order_index) VALUES
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'bank', 'Ahmad bin Abdullah', '1234567890', 'BCA', 0),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'bank', 'Fatimah binti Ibrahim', '0987654321', 'Mandiri', 1),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'ewallet', 'Ahmad', '081234567890', 'GoPay', 2),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'gift_item', NULL, NULL, NULL, 3);

-- Update gift item details
UPDATE gift_registry 
SET item_name = 'Kitchen Appliance Set',
    item_description = 'Help us start our new home with essential kitchen appliances',
    item_link = 'https://tokopedia.com'
WHERE wedding_id = 'b2d6e798-ebc4-478d-a69c-7a9655749bdc' AND type = 'gift_item';

-- Insert sample RSVP responses
INSERT INTO rsvp_responses (wedding_id, guest_name, attendance, number_of_guests, message) VALUES
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'Sarah & Family', 'yes', 4, 'Congratulations! We are so happy for you both!'),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'Michael Johnson', 'yes', 2, 'Can''t wait to celebrate with you!'),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'Lisa Anderson', 'no', 1, 'Sorry we can''t make it, but sending our best wishes!'),
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', 'David & Emma', 'yes', 2, 'Looking forward to your special day!');

-- Note: Gallery photos need to be uploaded via the application
-- as they require actual image files in Supabase Storage
