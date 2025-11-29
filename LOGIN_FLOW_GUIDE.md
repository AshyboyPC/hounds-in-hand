# Login Flow & Dashboard Access Guide

## 🔐 How Login Works

### For Community Members (Regular Users)

**Path:** Browse site → Login → Community Dashboard

1. **Browse the website** without logging in:
   - View adoptable dogs on `/adopt`
   - See volunteer opportunities on `/volunteer`
   - Read about shelters on `/about`
   - View map of shelters on `/map`

2. **When you want to interact** (save dogs, RSVP, volunteer):
   - Click "Login" in header
   - Enter any email/password (demo mode)
   - **Leave "Shelter Access Code" field BLANK**
   - Click "Sign In"
   - → Redirects to `/dashboard/community`

3. **In Community Dashboard** you can:
   - ✅ Save favorite dogs
   - ✅ Express interest in dogs
   - ✅ Message shelters
   - ✅ RSVP to events
   - ✅ Sign up for volunteer opportunities
   - ✅ Claim supply items
   - ✅ Track your volunteer hours
   - ✅ View community feed

---

### For Shelter Staff

**Path:** Login with Shelter Code → Shelter Dashboard

1. **Go to Login page** (`/login`)

2. **Enter credentials:**
   - Email: any email
   - Password: any password
   - **Shelter Access Code:** Enter one of:
     - `CAMPBELL2024` - Hope for Hounds Campbell
     - `HARRISBURG2024` - Harrisburg Animal Rescue
     - `YORK2024` - York County SPCA

3. **Click "Sign In"**
   - → Redirects to `/dashboard/shelter`

4. **In Shelter Dashboard** you can:
   - ✅ Post new dogs for adoption
   - ✅ Update dog status (available/foster/urgent)
   - ✅ Create events (adoption days, fundraisers)
   - ✅ Post supply needs with wishlist links
   - ✅ Post volunteer opportunities
   - ✅ View analytics (views, inquiries, adoptions)
   - ✅ Manage all content (edit/delete)

---

## 🔄 Complete User Journeys

### Journey 1: Community Member Wants to Volunteer

1. Visit `/volunteer` page (no login required)
2. Browse volunteer opportunities
3. Click "Join This Mission" on an opportunity
4. **Prompted to login** with message explaining benefits
5. Login (leave shelter code blank)
6. Redirected to Community Dashboard
7. Can now sign up for opportunities and track hours

### Journey 2: Community Member Wants to Adopt

1. Visit `/adopt` page (no login required)
2. Browse dogs, use filters
3. Find a dog they like
4. Click "I'm Interested" button
5. **Prompted to login** (if not logged in)
6. Login (leave shelter code blank)
7. Interest registered, shelter notified
8. Can save dog, message shelter, schedule visit

### Journey 3: Shelter Staff Posts New Dog

1. Go to `/login`
2. Enter email, password, and **shelter code**
3. Login → Shelter Dashboard
4. Click "Manage Dogs" tab
5. Click "Post New Dog"
6. Fill out form with photos and details
7. Submit → Dog appears on adoption page
8. Track views and inquiries in analytics

### Journey 4: Community Member RSVPs to Event

1. Browse Community Dashboard feed
2. See event posted by shelter
3. Click "RSVP" button
4. Confirmation toast appears
5. Event added to "My Events" tab
6. Shelter sees attendee count increase

---

## 🎯 Key Differences Between Dashboards

### Community Dashboard (`/dashboard/community`)
**Purpose:** For people who want to help (adopt, volunteer, donate)

**Features:**
- View community feed of shelter posts
- Save and track favorite dogs
- Sign up for volunteer opportunities
- RSVP to events
- Claim supply items
- Message shelters
- Track personal stats (hours, donations)

### Shelter Dashboard (`/dashboard/shelter`)
**Purpose:** For shelter staff to manage their shelter's presence

**Features:**
- Post dogs for adoption
- Create events
- Post supply needs
- Post volunteer opportunities
- View analytics
- Manage content
- Track engagement

---

## 🔑 Access Codes (Demo)

### Shelter Access Codes:
- `CAMPBELL2024` - Hope for Hounds Campbell
- `HARRISBURG2024` - Harrisburg Animal Rescue
- `YORK2024` - York County SPCA

### Community Access:
- Leave shelter code field **blank**
- Any email/password works (demo mode)

---

## 🔗 Logical Connections

### "Browse volunteer opportunities" link on login page:
- **Goes to:** `/volunteer` page
- **Purpose:** Let people see opportunities before logging in
- **Action:** When they click "Join This Mission", they're prompted to login
- **After login:** Redirected to Community Dashboard to complete sign-up

### Why this makes sense:
1. **Discovery first:** People can explore without commitment
2. **Login when ready:** Only need account to actually sign up
3. **Seamless flow:** Login → Dashboard → Complete action
4. **Clear benefit:** Login message explains what they'll get access to

---

## 📱 Google Login Flow

1. Click "Sign in with Google"
2. **Popup appears** asking for Shelter Access Code
3. **Options:**
   - Enter code → Shelter Dashboard
   - Leave blank/Cancel → Community Dashboard
4. Redirected to appropriate dashboard

---

## ✅ Summary

**Community Members:**
- Login WITHOUT shelter code
- Access Community Dashboard
- Can interact with all shelter posts

**Shelter Staff:**
- Login WITH shelter code
- Access Shelter Dashboard
- Can post and manage content

**Both:**
- Use same login page
- Different access based on shelter code
- Appropriate features for their role
