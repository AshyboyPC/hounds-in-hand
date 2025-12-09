# Dashboard Integration - Implementation TODO

## 🎯 Goal
Connect all dashboard actions to the public website so everything works as one ecosystem.

## 📋 What Needs to Be Done

### Priority 1: Critical Connections (Do First)

#### 1. Connect Adopt Page to Database
**File:** `src/pages/Adopt.tsx`
- Replace `sampleDogs` with real Supabase query
- Fetch from `dogs` table
- Filter by `is_available = true`
- Include shelter name via join

#### 2. Connect PostDogForm to Database  
**File:** `src/components/shelter/PostDogForm.tsx`
- Add Supabase import
- Save dog data to `dogs` table on submit
- Include `shelter_id` from user profile
- Show success/error toast

#### 3. Connect Stories Page to Database
**File:** `src/pages/ShelterStories.tsx`
- Replace `sampleStories` with real Supabase query
- Fetch from `shelter_stories` table
- Include shelter name via join

#### 4. Connect PostStoryForm to Database
**File:** `src/components/shelter/PostStoryForm.tsx`
- Add Supabase import
- Save story data to `shelter_stories` table
- Include `shelter_id` from user profile

### Priority 2: Volunteer System

#### 5. Connect Volunteer Board to Database
**File:** `src/pages/VolunteerBoard.tsx`
- Replace `sampleOpportunities` with real Supabase query
- Fetch from `volunteer_opportunities` table
- Save signups to `volunteer_signups` table

#### 6. Connect PostVolunteerForm to Database ✅ DONE
**File:** `src/components/shelter/PostVolunteerForm.tsx`
- ✅ Added Supabase import
- ✅ Save opportunity to `volunteer_opportunities` table
- ✅ Gets shelter_id from authenticated user
- ✅ Shows success/error toasts
- ✅ Resets form after successful submission

### Priority 3: Supply Wishlist

#### 7. Connect Supply Wishlist to Database ✅ DONE
**File:** `src/pages/SupplyWishlist.tsx`
- ✅ Replaced `sampleSupplyNeeds` with real Supabase query
- ✅ Fetches from `supply_needs` table
- ✅ Joins with `shelters` table for shelter names
- ✅ Shows loading spinner
- ✅ Handles errors with toast
- ✅ All filters work with real data

#### 8. Create PostSupplyNeedForm ✅ DONE
**File:** `src/components/shelter/PostSupplyNeedForm.tsx` (NEW)
- ✅ Created new form component
- ✅ Saves to `supply_needs` table
- ✅ Added to ShelterDashboard
- ✅ Includes all fields: item_name, category, quantity_needed, priority, description, links
- ✅ Gets shelter_id from authenticated user
- ✅ Shows success/error toasts
- ✅ Resets form after successful submission

### Priority 4: Homepage Integration

#### 9. Connect Dog of the Week ✅ DONE
**File:** `src/components/DogOfTheWeek.tsx`
- ✅ Fetches featured dog from database
- ✅ Queries where `is_dog_of_week = true`
- ✅ Shows loading state
- ✅ Handles no featured dog gracefully
- ✅ Displays on homepage

#### 10. Connect Stories Section ✅ DONE
**File:** `src/components/StoriesSection.tsx`
- ✅ Fetches latest 2 stories from database
- ✅ Shows on homepage
- ✅ Handles loading state
- ✅ Shows empty state when no stories

### Priority 5: Community Dashboard

#### 11. Show User's Volunteer Signups ✅ DONE
**File:** `src/pages/CommunityDashboard.tsx`
- ✅ Queries `volunteer_signups` for current user
- ✅ Displays list of signed-up opportunities
- ✅ Shows shelter name, date, time commitment
- ✅ Displays status badges (signed up, confirmed, completed)
- ✅ Calculates volunteer hours statistics

---

## 🔧 Implementation Pattern

For each page/component, follow this pattern:

### 1. Add Supabase Import
```typescript
import { supabase } from "@/integrations/supabase/client";
```

### 2. Add State for Data
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
```

### 3. Fetch Data on Mount
```typescript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('table_name')
      .select('*, shelters(name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
      toast.error('Failed to load data');
    } else {
      setData(data || []);
    }
    setLoading(false);
  };
  
  fetchData();
}, []);
```

### 4. Show Loading State
```typescript
if (loading) {
  return <div>Loading...</div>;
}
```

### 5. For Forms - Save to Database
```typescript
const handleSubmit = async (formData) => {
  const { data, error } = await supabase
    .from('table_name')
    .insert([{
      shelter_id: profile.shelter_id,
      ...formData
    }]);
  
  if (error) {
    toast.error('Failed to save');
  } else {
    toast.success('Saved successfully!');
    onClose();
  }
};
```

---

## 📊 Database Tables Reference

All tables exist in `supabase-schema.sql`:

### dogs
- id, shelter_id, name, breed, age, size, gender
- description, temperament, medical_info
- is_available, is_urgent, is_dog_of_week
- photo_url, created_at

### shelter_stories
- id, shelter_id, title, content, story_type
- dog_name, photo_url, is_featured
- created_at

### volunteer_opportunities
- id, shelter_id, title, description
- category, difficulty, time_commitment
- date, start_time, end_time, location
- max_volunteers, current_volunteers
- is_recurring, created_at

### supply_needs
- id, shelter_id, item_name, category
- quantity_needed, quantity_received
- priority, description
- amazon_link, chewy_link, other_link
- created_at

### volunteer_signups
- id, user_id, opportunity_id
- status, created_at

---

## ✅ Testing Steps

After implementing each connection:

1. **Test Create**: Post from dashboard → Check database in Supabase
2. **Test Read**: Refresh public page → Verify data appears
3. **Test Update**: Edit in dashboard → Verify changes on public page
4. **Test Delete**: Remove from dashboard → Verify removed from public page
5. **Test Filters**: Apply filters on public page → Verify correct data shown
6. **Test Permissions**: Ensure only shelter can post their own data

---

## 🚀 Quick Start

To implement all connections quickly:

1. Start with **Adopt page + PostDogForm** (most visible)
2. Then **Stories page + PostStoryForm** (second most visible)
3. Then **Volunteer Board + PostVolunteerForm**
4. Then **Supply Wishlist + Create form**
5. Finally **Homepage components**

Each implementation should take 10-15 minutes.

---

## 📝 Notes

- All forms already have UI - just need database integration
- All pages already have structure - just need to replace placeholder data
- Database schema is complete - no changes needed
- Row Level Security (RLS) policies already exist
- Authentication system is working

**The website is 90% done - just needs the database connections!**
