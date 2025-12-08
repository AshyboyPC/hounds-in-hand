# Dashboard to Website Integration Guide

## Overview
This guide explains how to connect the Shelter Dashboard and Community Dashboard actions to the public-facing website pages.

## Current Integration Status

### ✅ Already Connected
1. **Authentication System** - Users can log in and access dashboards
2. **Shelter Access Codes** - Shelters can upgrade their accounts
3. **Database Schema** - All tables exist in Supabase

### ❌ NOT Connected (Need to Implement)

#### Shelter Dashboard → Public Pages
1. **Post a Dog** (ShelterDashboard) → **Adopt Page** (Adopt.tsx)
   - Form: `PostDogForm.tsx`
   - Target: `src/pages/Adopt.tsx`
   - Database: `dogs` table
   - Status: **PLACEHOLDER DATA ONLY**

2. **Post Story** (ShelterDashboard) → **Stories Page** (ShelterStories.tsx)
   - Form: `PostStoryForm.tsx`
   - Target: `src/pages/ShelterStories.tsx`
   - Database: `shelter_stories` table
   - Status: **PLACEHOLDER DATA ONLY**

3. **Post Volunteer Opportunity** (ShelterDashboard) → **Volunteer Board** (VolunteerBoard.tsx)
   - Form: `PostVolunteerForm.tsx`
   - Target: `src/pages/VolunteerBoard.tsx`
   - Database: `volunteer_opportunities` table
   - Status: **PLACEHOLDER DATA ONLY**

4. **Post Supply Need** (ShelterDashboard) → **Supply Wishlist** (SupplyWishlist.tsx)
   - Form: Not yet created
   - Target: `src/pages/SupplyWishlist.tsx`
   - Database: `supply_needs` table
   - Status: **MISSING FORM**

#### Community Dashboard → Public Pages
1. **Sign Up for Volunteer Opportunity** → **Volunteer Board**
   - Action: Click "Sign Up" on VolunteerBoard.tsx
   - Database: `volunteer_signups` table
   - Status: **PARTIALLY WORKING** (local state only)

2. **View My Volunteer Signups** → **Community Dashboard**
   - Display: Show user's signed-up opportunities
   - Database: `volunteer_signups` table
   - Status: **NOT IMPLEMENTED**

#### Homepage Integration
1. **Dog of the Week** (Index.tsx)
   - Should show featured dog from database
   - Database: `dogs` table where `is_dog_of_week = true`
   - Status: **PLACEHOLDER DATA ONLY**

2. **Stories Section** (Index.tsx)
   - Should show latest 2 stories from database
   - Database: `shelter_stories` table
   - Status: **PLACEHOLDER DATA ONLY**

---

## Implementation Plan

### Phase 1: Connect Shelter Dashboard Forms to Database

#### 1. Update PostDogForm.tsx
```typescript
// Add Supabase integration to save dogs to database
const handleSubmit = async (formData) => {
  const { data, error } = await supabase
    .from('dogs')
    .insert([{
      shelter_id: profile.shelter_id,
      name: formData.name,
      breed: formData.breed,
      age: formData.age,
      // ... other fields
    }]);
  
  if (error) {
    toast.error("Failed to post dog");
  } else {
    toast.success("Dog posted successfully!");
  }
};
```

#### 2. Update PostStoryForm.tsx
```typescript
// Add Supabase integration to save stories
const handleSubmit = async (formData) => {
  const { data, error } = await supabase
    .from('shelter_stories')
    .insert([{
      shelter_id: profile.shelter_id,
      title: formData.title,
      content: formData.content,
      story_type: formData.type,
      // ... other fields
    }]);
};
```

#### 3. Update PostVolunteerForm.tsx
```typescript
// Add Supabase integration to save opportunities
const handleSubmit = async (formData) => {
  const { data, error } = await supabase
    .from('volunteer_opportunities')
    .insert([{
      shelter_id: profile.shelter_id,
      title: formData.title,
      description: formData.description,
      // ... other fields
    }]);
};
```

#### 4. Create PostSupplyNeedForm.tsx
- New form component for posting supply needs
- Integrate with `supply_needs` table

### Phase 2: Connect Public Pages to Database

#### 1. Update Adopt.tsx
```typescript
// Replace placeholder data with real database query
const [dogs, setDogs] = useState([]);

useEffect(() => {
  const fetchDogs = async () => {
    const { data, error } = await supabase
      .from('dogs')
      .select('*, shelters(name)')
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    
    if (data) setDogs(data);
  };
  fetchDogs();
}, []);
```

#### 2. Update ShelterStories.tsx
```typescript
// Replace placeholder data with real database query
const [stories, setStories] = useState([]);

useEffect(() => {
  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('shelter_stories')
      .select('*, shelters(name)')
      .order('created_at', { ascending: false });
    
    if (data) setStories(data);
  };
  fetchStories();
}, []);
```

#### 3. Update VolunteerBoard.tsx
```typescript
// Replace placeholder data with real database query
const [opportunities, setOpportunities] = useState([]);

useEffect(() => {
  const fetchOpportunities = async () => {
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .select('*, shelters(name)')
      .order('created_at', { ascending: false });
    
    if (data) setOpportunities(data);
  };
  fetchOpportunities();
}, []);

// Save volunteer signups to database
const handleSignUp = async (opportunityId) => {
  const { error } = await supabase
    .from('volunteer_signups')
    .insert([{
      user_id: user.id,
      opportunity_id: opportunityId
    }]);
};
```

#### 4. Update SupplyWishlist.tsx
```typescript
// Replace placeholder data with real database query
const [supplyNeeds, setSupplyNeeds] = useState([]);

useEffect(() => {
  const fetchSupplyNeeds = async () => {
    const { data, error } = await supabase
      .from('supply_needs')
      .select('*, shelters(name)')
      .order('priority', { ascending: true });
    
    if (data) setSupplyNeeds(data);
  };
  fetchSupplyNeeds();
}, []);
```

### Phase 3: Connect Homepage Components

#### 1. Update DogOfTheWeek.tsx
```typescript
const [featuredDog, setFeaturedDog] = useState(null);

useEffect(() => {
  const fetchFeaturedDog = async () => {
    const { data, error } = await supabase
      .from('dogs')
      .select('*, shelters(name)')
      .eq('is_dog_of_week', true)
      .single();
    
    if (data) setFeaturedDog(data);
  };
  fetchFeaturedDog();
}, []);
```

#### 2. Update StoriesSection.tsx
```typescript
const [stories, setStories] = useState([]);

useEffect(() => {
  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('shelter_stories')
      .select('*, shelters(name)')
      .order('created_at', { ascending: false })
      .limit(2);
    
    if (data) setStories(data);
  };
  fetchStories();
}, []);
```

### Phase 4: Community Dashboard Integration

#### 1. Show User's Volunteer Signups
```typescript
// In CommunityDashboard.tsx
const [mySignups, setMySignups] = useState([]);

useEffect(() => {
  const fetchMySignups = async () => {
    const { data, error } = await supabase
      .from('volunteer_signups')
      .select('*, volunteer_opportunities(*, shelters(name))')
      .eq('user_id', user.id);
    
    if (data) setMySignups(data);
  };
  fetchMySignups();
}, []);
```

---

## Database Tables Needed

All tables already exist in `supabase-schema.sql`:
- ✅ `dogs`
- ✅ `shelter_stories`
- ✅ `volunteer_opportunities`
- ✅ `supply_needs`
- ✅ `volunteer_signups`
- ✅ `shelters`
- ✅ `profiles`

---

## Next Steps

1. **Implement Phase 1** - Connect all shelter dashboard forms to save to database
2. **Implement Phase 2** - Update all public pages to fetch from database
3. **Implement Phase 3** - Connect homepage components to database
4. **Implement Phase 4** - Show user's activities in community dashboard
5. **Test end-to-end** - Post from dashboard, verify it appears on public pages
6. **Add real-time updates** - Use Supabase subscriptions for live updates

---

## Testing Checklist

- [ ] Shelter can post a dog → Dog appears on Adopt page
- [ ] Shelter can post a story → Story appears on Stories page
- [ ] Shelter can post volunteer opportunity → Appears on Volunteer Board
- [ ] Shelter can post supply need → Appears on Supply Wishlist
- [ ] User can sign up for volunteer opportunity → Saved to database
- [ ] User can see their signups in Community Dashboard
- [ ] Featured dog appears on homepage
- [ ] Latest stories appear on homepage
- [ ] All data persists across page refreshes
- [ ] All data is filtered by shelter correctly
