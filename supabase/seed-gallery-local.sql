-- ============================================
-- SEED GALLERY PHOTOS - LOCAL ASSETS VERSION
-- ============================================
-- Run this AFTER seed-demo.sql
-- This uses local assets from public folder for demo

-- Delete existing gallery photos for demo wedding (if any)
DELETE FROM gallery_photos WHERE wedding_id = 'b2d6e798-ebc4-478d-a69c-7a9655749bdc';

-- Insert gallery photos for demo wedding
INSERT INTO gallery_photos (wedding_id, image_url, alt_text, order_index, span_class) VALUES
-- Foto couple 1 (BESAR - foto terbaik)
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', '/couple1.png', 'Foto couple prewedding 1', 0, 'col-span-2 row-span-2'),

-- Foto pria sendiri
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', '/priasendiri.png', 'Foto mempelai pria', 1, ''),

-- Foto wanita sendiri
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', '/wanitasendiri.png', 'Foto mempelai wanita', 2, ''),

-- Foto couple 2 (LEBAR)
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', '/couple2.png', 'Foto couple prewedding 2', 3, 'col-span-2'),

-- Foto couple 3
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', '/couple3.png', 'Foto couple prewedding 3', 4, ''),

-- Foto couple 4
('b2d6e798-ebc4-478d-a69c-7a9655749bdc', '/couple4.png', 'Foto couple prewedding 4', 5, '');

-- Update wedding cover image
UPDATE weddings 
SET cover_image_url = '/couple1.png'
WHERE id = 'b2d6e798-ebc4-478d-a69c-7a9655749bdc';
