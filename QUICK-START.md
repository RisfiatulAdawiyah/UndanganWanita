# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase

**Create Project:**
- Go to [supabase.com](https://supabase.com) → New Project

**Run Schema:**
- SQL Editor → Copy `supabase/schema.sql` → Run

**Create Storage:**
- Storage → New Bucket → Name: `wedding-images` → Public: YES

**Set Storage Policies:**
```sql
-- Public read
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'wedding-images');

-- Authenticated upload
CREATE POLICY "Authenticated upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'wedding-images' AND auth.role() = 'authenticated');

-- Authenticated delete
CREATE POLICY "Authenticated delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'wedding-images' AND auth.role() = 'authenticated');
```

### 3. Configure Environment

Create `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get credentials from: Project Settings → API

### 4. Create Demo User

**Supabase Dashboard:**
- Authentication → Users → Add User
- Email: demo@example.com
- Password: demo123456
- Copy the User ID

### 5. Seed Demo Data

**Update `supabase/seed-demo.sql`:**
- Replace `demo-user-id-12345` with your actual User ID

**Run in SQL Editor:**
- Copy entire `seed-demo.sql` → Run

### 6. Start Development

```bash
npm run dev
```

Visit: http://localhost:8080/undangan/demo

## 📁 Project Structure

```
desain/
├── supabase/
│   ├── schema.sql          # Database schema
│   └── seed-demo.sql       # Demo data
├── src/
│   ├── components/wedding/ # Wedding components
│   ├── hooks/              # React Query hooks
│   ├── lib/                # Supabase client
│   ├── pages/              # Routes
│   └── types/              # TypeScript types
└── .env                    # Your credentials
```

## 🔑 Key Files

- **Database:** `supabase/schema.sql`
- **Types:** `src/types/wedding.types.ts`
- **Hooks:** `src/hooks/useWedding.ts`
- **Main Page:** `src/pages/Wedding.tsx`

## 🎯 What Works Now

✅ Dynamic wedding pages (`/undangan/:slug`)
✅ Database-driven content
✅ RSVP form submission
✅ Photo gallery
✅ Love story timeline
✅ Gift registry
✅ Event details
✅ Countdown timer

## 🚧 Coming in Phase 3

- Admin dashboard
- Login/Register pages
- CRUD forms
- Photo upload UI
- Guest list management
- RSVP viewer & export

## 🆘 Common Issues

**"Missing Supabase environment variables"**
→ Check `.env` file exists and has correct values

**"relation does not exist"**
→ Run `schema.sql` in SQL Editor

**Images not loading**
→ Check storage bucket is public

**RSVP not submitting**
→ Check RLS policies are set

## 📚 Full Documentation

- Setup: `SETUP.md`
- Phase 2 Details: `PHASE2-COMPLETED.md`

## 💡 Tips

1. Use Supabase Table Editor to view/edit data
2. Check SQL Editor for query errors
3. Use browser DevTools Network tab for API debugging
4. React Query DevTools available in dev mode

---

**Need Help?** Check `SETUP.md` for detailed instructions
