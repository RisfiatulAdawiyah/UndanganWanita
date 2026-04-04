-- ============================================
-- SETUP WEDDING MUSIC STORAGE BUCKET
-- ============================================

-- Create bucket for wedding music (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wedding-music',
  'wedding-music',
  true,
  10485760, -- 10MB in bytes
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/mp4', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/mp4', 'video/mp4'];

-- ============================================
-- STORAGE POLICIES FOR WEDDING-MUSIC BUCKET
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own music" ON storage.objects;
DROP POLICY IF EXISTS "Public can view music" ON storage.objects;

-- Policy: Authenticated users can upload music to wedding-music bucket
CREATE POLICY "Authenticated users can upload music"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'wedding-music');

-- Policy: Authenticated users can update their own music files
CREATE POLICY "Authenticated users can update own music"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'wedding-music' AND owner::text = (auth.uid())::text)
WITH CHECK (bucket_id = 'wedding-music' AND owner::text = (auth.uid())::text);

-- Policy: Authenticated users can delete their own music files
CREATE POLICY "Authenticated users can delete own music"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'wedding-music' AND owner::text = (auth.uid())::text);

-- Policy: Anyone can view/download music files (public bucket)
CREATE POLICY "Public can view music"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wedding-music');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if bucket exists
-- SELECT * FROM storage.buckets WHERE id = 'wedding-music';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%music%';
