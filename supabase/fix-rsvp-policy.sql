-- ============================================
-- FINAL FIX - EXPLICIT ANON ROLE
-- ============================================

-- Step 1: Drop existing INSERT policy
DROP POLICY IF EXISTS "public_insert_rsvp" ON rsvp_responses;

-- Step 2: Create INSERT policy explicitly for anon and authenticated
CREATE POLICY "anon_insert_rsvp" ON rsvp_responses
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Verify the policy
SELECT tablename, policyname, cmd, roles, with_check
FROM pg_policies 
WHERE tablename = 'rsvp_responses' AND cmd = 'INSERT';
