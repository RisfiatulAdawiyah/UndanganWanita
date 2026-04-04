# Wedding Invitation Platform - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier is fine)
- Git

## Step 1: Clone & Install

```bash
cd desain
npm install
```

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be ready (~2 minutes)

### 2.2 Run Database Schema

1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Copy entire content from `supabase/schema.sql`
4. Paste and click "Run"
5. Wait for success message

### 2.3 Create Storage Bucket

1. Go to Storage in Supabase Dashboard
2. Click "New Bucket"
3. Name: `wedding-images`
4. Public bucket: ✅ YES
5. Click "Create Bucket"

### 2.4 Set Storage Policies

Click on `wedding-images` bucket → Policies → New Policy:

**Policy 1: Public Read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'wedding-images' );
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wedding-images' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated Delete**
```sql
CREATE POLICY "Authenticated users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wedding-images' 
  AND auth.role() = 'authenticated'
);
```

### 2.5 Seed Demo Data (Optional)

1. Go to SQL Editor
2. Copy content from `supabase/seed-demo.sql`
3. **IMPORTANT:** First create a demo user via Authentication
4. Replace `demo-user-id-12345` with actual user ID
5. Run the query

## Step 3: Environment Variables

1. Copy `.env.example` to `.env`
2. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy "Project URL" → paste as `VITE_SUPABASE_URL`
   - Copy "anon public" key → paste as `VITE_SUPABASE_ANON_KEY`

Example `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:8080

## Step 5: Create First User

### Option A: Via Supabase Dashboard
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email & password
4. Click "Create User"

### Option B: Via Application (Coming in Phase 3)
- Will have signup page

## Step 6: Test Demo Wedding

1. Make sure you ran seed-demo.sql
2. Visit: http://localhost:8080/undangan/demo
3. Should see demo wedding invitation

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env` file exists
- Check variables are correct
- Restart dev server

### Error: "relation does not exist"
- Run schema.sql again
- Check all tables created successfully

### Images not loading
- Check storage bucket created
- Check bucket is public
- Check storage policies set correctly

### RSVP not submitting
- Check RLS policies enabled
- Check user authenticated (for admin)
- Check network tab for errors

## Next Steps

After setup complete:
- Phase 3: Build Admin Dashboard
- Create authentication pages
- Build CRUD forms
- Implement file upload UI

## Project Structure

```
desain/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   └── wedding/         # Wedding components
│   ├── hooks/               # React Query hooks
│   ├── lib/                 # Supabase client
│   ├── pages/               # Route pages
│   ├── types/               # TypeScript types
│   └── App.tsx
├── supabase/
│   ├── schema.sql           # Database schema
│   └── seed-demo.sql        # Demo data
└── public/                  # Static assets
```

## Support

For issues or questions, check:
- Supabase docs: https://supabase.com/docs
- React Query docs: https://tanstack.com/query
- Tailwind docs: https://tailwindcss.com
