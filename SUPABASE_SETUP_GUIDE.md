# Supabase Setup Guide - Complete Authentication System

This guide will help you set up a complete, production-ready authentication system using Supabase with proper user roles and shelter access management.

## 🎯 Overview

The system now uses **real Supabase authentication** with:
- User profiles stored in database
- Role-based access control (community, volunteer, shelter, admin)
- Shelter access code validation
- No localStorage dependencies
- Persistent user sessions

## 📋 Prerequisites

1. A Supabase account (free tier works fine)
2. A Supabase project created
3. Your Supabase URL and anon key

## 🚀 Setup Steps

### Step 1: Configure Supabase Credentials

Update your `.env` file (or create one) with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Run the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase-schema.sql` in this project
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **Run** to execute

This will create:
- `profiles` table (user profiles with roles)
- `shelters` table (shelter information)
- `shelter_access_codes` table (access code management)
- Automatic triggers for user creation
- Row Level Security (RLS) policies
- Helper functions for access code validation
- Sample data (Happy Paws Shelter with code "SHELTER123")

### Step 3: Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if desired
4. (Optional) Enable **Google OAuth** for social login

### Step 4: Test the System

#### Create a Test User

1. Run your app: `npm run dev`
2. Go to the login page
3. Click "Sign in with Google" OR use Supabase dashboard to create a test user:
   - Go to **Authentication** → **Users**
   - Click **Add user** → **Create new user**
   - Enter email and password
   - Click **Create user**

#### Test Community Access

1. Log in with your test user
2. When the shelter access dialog appears, click "Go to Community"
3. You should see the Community Dashboard
4. Your role in the database is "community"

#### Test Shelter Access

1. From Community Dashboard, click "Shelter Access" button
2. Enter the code: `SHELTER123`
3. You should see "Access granted to Happy Paws Shelter!"
4. You'll be redirected to the Shelter Dashboard
5. Your role in the database is now "shelter"

## 🔐 How It Works

### User Registration Flow

1. User signs up via Supabase Auth
2. Trigger automatically creates a profile in `profiles` table
3. Default role is set to "community"
4. User can access Community Dashboard

### Shelter Access Flow

1. User enters shelter access code
2. Code is validated against `shelters` table
3. If valid, user's profile is updated:
   - `role` → "shelter"
   - `shelter_id` → linked to the shelter
4. User gains access to Shelter Dashboard
5. Role persists across sessions (stored in database)

### Role-Based Access Control

- **Community/Volunteer**: Can access Community Dashboard
- **Shelter**: Can access Shelter Dashboard and manage their shelter's data
- **Admin**: Can access all dashboards and admin features

## 📊 Database Schema

### profiles
```sql
- id (UUID, primary key, references auth.users)
- email (TEXT, unique)
- full_name (TEXT, nullable)
- role (TEXT, default 'community')
- shelter_id (UUID, nullable, references shelters)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### shelters
```sql
- id (UUID, primary key)
- name (TEXT)
- access_code (TEXT, unique)
- email, phone, address, city, state, zip_code (TEXT, nullable)
- website, description (TEXT, nullable)
- created_at, updated_at (TIMESTAMP)
```

## 🔧 Adding More Shelters

To add more shelters with access codes:

```sql
INSERT INTO public.shelters (name, access_code, email, city, state, description)
VALUES (
    'Your Shelter Name',
    'YOURCODE123',
    'contact@yourshelter.org',
    'Your City',
    'ST',
    'Shelter description here'
);
```

## 🛡️ Security Features

1. **Row Level Security (RLS)**: Users can only access their own data
2. **Secure Functions**: Access code validation runs server-side
3. **No localStorage**: All auth state managed by Supabase
4. **Session Management**: Automatic token refresh and session handling
5. **Protected Routes**: Role-based route protection

## 🐛 Troubleshooting

### "Invalid access code" error
- Check that the shelter exists in the `shelters` table
- Verify the access code matches exactly (case-sensitive)
- Check Supabase logs for errors

### User not redirecting after login
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure database schema was run successfully

### Profile not loading
- Check that the trigger `on_auth_user_created` exists
- Verify RLS policies are enabled
- Check Supabase logs for permission errors

## 📝 Next Steps

1. **Customize Email Templates**: Update Supabase email templates for your brand
2. **Add More Roles**: Extend the role system (e.g., "staff", "volunteer_coordinator")
3. **Shelter Management**: Build UI for shelters to manage their access codes
4. **User Profile Editing**: Allow users to update their profile information
5. **Admin Dashboard**: Create admin interface to manage users and shelters

## 🎉 Benefits of This System

✅ **No Fake Data**: All data stored in real database  
✅ **Persistent Sessions**: Users stay logged in across page refreshes  
✅ **Secure**: Industry-standard authentication with RLS  
✅ **Scalable**: Can handle thousands of users and shelters  
✅ **Role Management**: Easy to add/change user roles  
✅ **Production Ready**: Built with best practices  

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Functions](https://supabase.com/docs/guides/database/functions)
