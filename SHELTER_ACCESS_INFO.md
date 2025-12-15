# Shelter Access Information

## 🔑 Shelter Access Codes

### **Available Shelters:**

1. **FURKIDS2025** - Furkids Animal Rescue & Shelters
   - Location: Georgia
   - Website: https://furkids.org
   - Description: Georgia's largest no-kill animal rescue and shelters

2. **HOPEFORHOUNDS** - Hope for Hounds Rescue  
   - Location: Georgia
   - Website: https://hopeforhounds.org
   - Description: Dedicated to rescuing and rehoming dogs in need throughout Georgia

## 🚀 Quick Start

### First Time Setup
1. **Run the database schema**: Follow `SUPABASE_SETUP_GUIDE.md`
2. **Create a user account**: Sign up or use Supabase dashboard
3. **Test an access code**: Use `FURKIDS2025` or `HOPEFORHOUNDS` to become a shelter user

## 📍 How to Access Shelter Dashboard

### Option 1: During Login
1. Log in with your Supabase account
2. A popup appears asking for a shelter access code
3. Enter `FURKIDS2025` or `HOPEFORHOUNDS` or click "Go to Community" to skip

### Option 2: From Community Dashboard
1. Log in and go to the Community Dashboard
2. Click the **"Shelter Access"** button (top-right, next to your name)
3. Enter the shelter access code
4. You'll be redirected to the Shelter Dashboard

## ✨ Features

- **Real Database Storage**: User roles stored in Supabase, not localStorage
- **Persistent Sessions**: Role persists across browser sessions
- **Secure Validation**: Access codes validated server-side via Supabase function
- **Role-Based Access**: Protected routes ensure only authorized users access shelter features
- **Seamless Switching**: Users can upgrade from community to shelter role anytime

## 🔐 How It Works (Technical)

1. **User enters code** → Dialog component captures input
2. **Validation** → Calls Supabase RPC function `validate_shelter_access_code`
3. **Database Update** → User's profile updated with:
   - `role` = "shelter"
   - `shelter_id` = linked shelter ID
4. **Profile Refresh** → AuthContext fetches updated profile
5. **Route Protection** → ProtectedRoute allows access to Shelter Dashboard
6. **Redirect** → User navigated to `/dashboard/shelter`

## 📊 User Roles

| Role | Access |
|------|--------|
| **community** | Community Dashboard (default for new users) |
| **volunteer** | Community Dashboard + volunteer features |
| **shelter** | Shelter Dashboard + shelter management |
| **admin** | All dashboards + admin features |

## 🛠️ Implementation Details

### Components
- `src/components/ShelterAccessDialog.tsx` - Access code dialog
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/components/ProtectedRoute.tsx` - Role-based route protection

### Database
- `profiles` table - Stores user roles
- `shelters` table - Stores shelter info and access codes
- `validate_shelter_access_code()` - Server-side validation function

### Pages Using Dialog
- `src/pages/Login.tsx` - Shows after login
- `src/pages/CommunityDashboard.tsx` - "Shelter Access" button

## 🎯 Adding More Access Codes

To create additional shelters with access codes, run this SQL in Supabase:

```sql
INSERT INTO public.shelters (name, access_code, email, city, state, description)
VALUES (
    'New Shelter Name',
    'NEWCODE456',
    'contact@newshelter.org',
    'City Name',
    'CA',
    'Description of the shelter'
);
```

## 🔄 Switching Back to Community

Currently, users can only upgrade from community → shelter. To switch back:

1. Go to Supabase dashboard
2. Navigate to **Table Editor** → **profiles**
3. Find your user
4. Change `role` back to "community"
5. Set `shelter_id` to NULL
6. Refresh your app

(Future enhancement: Add a "Leave Shelter" button in the UI)
