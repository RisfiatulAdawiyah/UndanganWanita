-- ============================================
-- TEST FIX: Temporarily disable RLS to test
-- ============================================

-- Option 1: Disable RLS temporarily (for testing only)
ALTER TABLE rsvp_responses DISABLE ROW LEVEL SECURITY;

-- After testing works, re-enable with:
-- ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
