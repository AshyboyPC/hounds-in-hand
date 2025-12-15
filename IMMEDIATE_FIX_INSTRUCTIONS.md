# IMMEDIATE FIX INSTRUCTIONS

## The Problem
You're getting these errors because your database schema is missing required columns:
- `photo_url` column missing from `shelter_stories` table
- `dog_name` column missing from `shelter_stories` table
- AuthContext timeout due to slow database queries

## URGENT: Fix This Right Now

### Step 1: Update Database Schema
1. **Open your Supabase dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire contents of `URGENT_DATABASE_FIX.sql`**
4. **Click "Run"**

This will:
- Add all missing columns
- Fix constraints
- Refresh the schema cache
- Grant proper permissions

### Step 2: Verify the Fix
After running the SQL, you should see a table showing all columns in `shelter_stories`. Look for:
- ✅ `dog_name`
- ✅ `photo_url`
- ✅ `author_name`
- ✅ `photo_urls`

### Step 3: Restart Your App
```bash
# Stop your dev server (Ctrl+C)
# Then restart
npm run dev
```

### Step 4: Test Story Posting
1. Go to Shelter Dashboard
2. Click "Stories" tab
3. Click "Share Story"
4. Fill out the form
5. Click "Publish Story"

**It should work without errors now!**

## What These Fixes Do

### Database Schema Fixes
- ✅ Adds missing `photo_url` column to `shelter_stories`
- ✅ Adds missing `dog_name` column to `shelter_stories`
- ✅ Adds missing `author_name` column to `shelter_stories`
- ✅ Updates story_type constraints to match app expectations
- ✅ Refreshes PostgREST schema cache (critical!)

### AuthContext Fixes
- ✅ Increased timeout from 5s to 10s
- ✅ Better error handling that doesn't block the app

## If You Still Get Errors

1. **Check Supabase logs** - look for any SQL errors
2. **Clear browser cache** - old schema might be cached
3. **Check network tab** - see exact API error responses
4. **Verify RLS policies** - make sure your user has permissions

## The Root Cause
The database schema in your Supabase project doesn't match what the application code expects. The TypeScript interfaces and SQL schema files were correct, but the actual database wasn't updated.

**This is a one-time fix** - once you run the SQL script, everything should work perfectly!