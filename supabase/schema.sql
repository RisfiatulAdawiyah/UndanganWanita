-- ============================================
-- WEDDING INVITATION PLATFORM - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users (handled by Supabase Auth)
-- ============================================
-- Supabase Auth automatically creates auth.users table
-- We'll extend it with a profiles table

-- ============================================
-- TABLE: profiles
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- TABLE: weddings
-- ============================================
CREATE TABLE weddings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  
  -- Couple Information
  groom_name TEXT NOT NULL,
  groom_full_name TEXT,
  groom_father TEXT,
  groom_mother TEXT,
  bride_name TEXT NOT NULL,
  bride_full_name TEXT,
  bride_father TEXT,
  bride_mother TEXT,
  
  -- Wedding Date
  wedding_date DATE NOT NULL,
  
  -- Akad Nikah
  akad_date TIMESTAMP WITH TIME ZONE,
  akad_end TIMESTAMP WITH TIME ZONE,
  akad_venue TEXT,
  akad_address TEXT,
  akad_maps_url TEXT,
  akad_maps_embed TEXT,
  
  -- Resepsi
  resepsi_date TIMESTAMP WITH TIME ZONE,
  resepsi_end TIMESTAMP WITH TIME ZONE,
  resepsi_venue TEXT,
  resepsi_address TEXT,
  resepsi_maps_url TEXT,
  resepsi_maps_embed TEXT,
  
  -- Quran Verses
  main_verse_arabic TEXT,
  main_verse_transliteration TEXT,
  main_verse_translation TEXT,
  main_verse_reference TEXT,
  quote_verse_arabic TEXT,
  quote_verse_translation TEXT,
  quote_verse_reference TEXT,
  
  -- Media
  cover_image_url TEXT,
  hero_image_url TEXT,
  
  -- Theme
  primary_color TEXT DEFAULT '#2F5D50',
  accent_color TEXT DEFAULT '#D4AF37',
  
  -- Music
  music_url TEXT,
  
  -- Settings
  is_published BOOLEAN DEFAULT FALSE,
  show_gift_registry BOOLEAN DEFAULT TRUE,
  show_guest_list BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;

-- Policies for weddings
CREATE POLICY "Users can view own weddings" ON weddings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published weddings" ON weddings
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Users can insert own weddings" ON weddings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weddings" ON weddings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weddings" ON weddings
  FOR DELETE USING (auth.uid() = user_id);

-- Index for slug lookup
CREATE INDEX idx_weddings_slug ON weddings(slug);
CREATE INDEX idx_weddings_user_id ON weddings(user_id);

-- ============================================
-- TABLE: love_stories
-- ============================================
CREATE TABLE love_stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'heart',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE love_stories ENABLE ROW LEVEL SECURITY;

-- Policies for love_stories
CREATE POLICY "Anyone can view love stories of published weddings" ON love_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = love_stories.wedding_id 
      AND weddings.is_published = TRUE
    )
  );

CREATE POLICY "Users can manage own wedding love stories" ON love_stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = love_stories.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_love_stories_wedding_id ON love_stories(wedding_id);
CREATE INDEX idx_love_stories_order ON love_stories(wedding_id, order_index);

-- ============================================
-- TABLE: gallery_photos
-- ============================================
CREATE TABLE gallery_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  span_class TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Policies for gallery_photos
CREATE POLICY "Anyone can view photos of published weddings" ON gallery_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = gallery_photos.wedding_id 
      AND weddings.is_published = TRUE
    )
  );

CREATE POLICY "Users can manage own wedding photos" ON gallery_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = gallery_photos.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_gallery_photos_wedding_id ON gallery_photos(wedding_id);
CREATE INDEX idx_gallery_photos_order ON gallery_photos(wedding_id, order_index);

-- ============================================
-- TABLE: rsvp_responses
-- ============================================
CREATE TABLE rsvp_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no')),
  number_of_guests INTEGER DEFAULT 1,
  message TEXT,
  phone TEXT,
  email TEXT,
  ip_address TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Policies for rsvp_responses
-- Note: RLS is disabled for public RSVP submission
-- This is safe because RSVP data is meant to be publicly submittable
-- Run this after table creation:
-- ALTER TABLE rsvp_responses DISABLE ROW LEVEL SECURITY;

-- For future reference, if you want to re-enable RLS with policies:
-- CREATE POLICY "public_insert_rsvp" ON rsvp_responses FOR INSERT WITH CHECK (true);
-- CREATE POLICY "admin_select_rsvp" ON rsvp_responses FOR SELECT TO authenticated 
--   USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = rsvp_responses.wedding_id AND weddings.user_id = auth.uid()));
-- CREATE POLICY "admin_delete_rsvp" ON rsvp_responses FOR DELETE TO authenticated 
--   USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = rsvp_responses.wedding_id AND weddings.user_id = auth.uid()));

-- Index
CREATE INDEX idx_rsvp_responses_wedding_id ON rsvp_responses(wedding_id);
CREATE INDEX idx_rsvp_responses_submitted_at ON rsvp_responses(submitted_at DESC);

-- ============================================
-- TABLE: guest_list
-- ============================================
CREATE TABLE guest_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  category TEXT DEFAULT 'lainnya',
  invitation_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE guest_list ENABLE ROW LEVEL SECURITY;

-- Policies for guest_list
CREATE POLICY "Users can manage guest list for own weddings" ON guest_list
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = guest_list.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view guest list of published weddings if enabled" ON guest_list
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = guest_list.wedding_id 
      AND weddings.is_published = TRUE
      AND weddings.show_guest_list = TRUE
    )
  );

-- Index
CREATE INDEX idx_guest_list_wedding_id ON guest_list(wedding_id);
CREATE INDEX idx_guest_list_category ON guest_list(wedding_id, category);

-- ============================================
-- TABLE: gift_registry
-- ============================================
CREATE TABLE gift_registry (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank', 'ewallet', 'gift_item')),
  
  -- For bank/ewallet
  account_name TEXT,
  account_number TEXT,
  bank_name TEXT,
  
  -- For gift items
  item_name TEXT,
  item_description TEXT,
  item_link TEXT,
  
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gift_registry ENABLE ROW LEVEL SECURITY;

-- Policies for gift_registry
CREATE POLICY "Anyone can view gift registry of published weddings if enabled" ON gift_registry
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = gift_registry.wedding_id 
      AND weddings.is_published = TRUE
      AND weddings.show_gift_registry = TRUE
    )
  );

CREATE POLICY "Users can manage gift registry for own weddings" ON gift_registry
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = gift_registry.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_gift_registry_wedding_id ON gift_registry(wedding_id);
CREATE INDEX idx_gift_registry_order ON gift_registry(wedding_id, order_index);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for weddings
CREATE TRIGGER update_weddings_updated_at
  BEFORE UPDATE ON weddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these commands in Supabase Dashboard > Storage

-- Create bucket for wedding images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-images', 'wedding-images', true);

-- Storage policies will be set via Supabase Dashboard
