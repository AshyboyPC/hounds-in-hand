# Unified Schema Documentation

## Overview

This document describes the unified database schema that standardizes all content tables to follow consistent patterns, ensuring referential integrity and enabling seamless content flow across the platform.

## Key Principles

1. **Consistent Status Fields**: All content tables use standardized status enums
2. **Explicit Foreign Keys**: All content is explicitly associated with shelters via `shelter_id`
3. **Unified Patterns**: All tables follow the same naming and structure conventions
4. **Performance Indexes**: Strategic indexes for optimal query performance
5. **Row Level Security**: Consistent RLS policies across all content types

## Schema Changes

### 1. Standardized Status Fields

All content tables now have consistent status fields:

- **Dogs**: `available`, `foster`, `pending`, `adopted`, `hold`, `medical`
- **Events**: `active`, `cancelled`, `completed`, `draft`
- **Stories**: `draft`, `published`, `archived`
- **Volunteer Opportunities**: `active`, `inactive`, `completed`, `cancelled`
- **Supply Needs**: `active`, `fulfilled`, `cancelled`

### 2. New Tables Created

#### Events Table
```sql
CREATE TABLE public.events (
    id UUID PRIMARY KEY,
    shelter_id UUID NOT NULL REFERENCES shelters(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type TEXT NOT NULL,
    date DATE NOT NULL,
    -- ... additional event fields
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Event RSVPs Table
```sql
CREATE TABLE public.event_rsvps (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id),
    user_id UUID REFERENCES profiles(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    -- ... additional RSVP fields
    status TEXT NOT NULL DEFAULT 'confirmed'
);
```

#### Supply Donations Table
```sql
CREATE TABLE public.supply_donations (
    id UUID PRIMARY KEY,
    supply_need_id UUID NOT NULL REFERENCES supply_needs(id),
    user_id UUID REFERENCES profiles(id),
    donor_name TEXT NOT NULL,
    quantity_donated INTEGER NOT NULL,
    -- ... additional donation fields
    status TEXT NOT NULL DEFAULT 'pledged'
);
```

### 3. Enhanced Existing Tables

#### Shelter Stories
- Added `status` field (replaces `is_published` logic)
- Added `photo_urls` array for multiple images
- Added `is_featured` for highlighting important stories
- Added `story_type` for categorization
- Added `author_name` for attribution

#### Volunteer Opportunities
- Added `status` field (replaces `is_active` logic)
- Added `opportunity_type` for categorization
- Added `requirements`, `time_commitment`, `schedule` fields
- Added `contact_email`, `contact_phone` fields
- Added `max_volunteers`, `current_volunteers` for capacity tracking

#### Supply Needs
- Added `status` field (replaces `is_fulfilled` logic)
- Added `category` for organization
- Added `priority` for urgency levels
- Added `quantity_needed`, `quantity_received` for tracking

### 4. Unified Content View

Created a unified view that combines all content types:

```sql
CREATE VIEW public.unified_content AS
SELECT 
    'dog' as content_type,
    id, shelter_id, name as title, description, status,
    created_at, updated_at, photo_urls
FROM public.dogs
UNION ALL
-- ... other content types
```

This enables:
- Cross-content-type queries
- Unified dashboard feeds
- Consistent API responses
- Simplified content aggregation

### 5. Performance Indexes

Strategic indexes created for optimal performance:

```sql
-- Content-specific indexes
CREATE INDEX idx_dogs_shelter_id ON dogs(shelter_id);
CREATE INDEX idx_dogs_status ON dogs(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_supply_needs_priority ON supply_needs(priority);

-- Interaction indexes
CREATE INDEX idx_volunteer_signups_opportunity_id ON volunteer_signups(volunteer_opportunity_id);
CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
```

### 6. Row Level Security (RLS)

Consistent RLS policies across all content:

#### Public Read Access
- All content is readable by anonymous and authenticated users
- Stories filtered by `status = 'published'`
- Opportunities filtered by `status = 'active'`
- Supply needs filtered by `status = 'active'`

#### Shelter Management
- Shelter staff can manage only their own content
- Based on `shelter_id` matching user's profile
- Applies to CREATE, UPDATE, DELETE operations

#### User Interactions
- Users can manage their own signups, RSVPs, donations
- Based on `user_id` matching authenticated user

## Migration Process

### 1. Apply Migration
Run the migration script to update existing database:
```bash
# In Supabase SQL Editor
-- Run: supabase-migration-unified-schema.sql
```

### 2. Verify Changes
Check that all changes were applied correctly:
```sql
-- Check status columns exist
SELECT table_name, column_name FROM information_schema.columns 
WHERE column_name = 'status' AND table_schema = 'public';

-- Check unified content view
SELECT content_type, COUNT(*) FROM unified_content GROUP BY content_type;
```

### 3. Update Application Code
- Update TypeScript types (already done in `src/types/database.ts`)
- Update repository implementations to use new status fields
- Update forms to use new table structures
- Update queries to leverage new indexes

## Backward Compatibility

The migration maintains backward compatibility by:

1. **Preserving Legacy Fields**: Old boolean fields (`is_published`, `is_active`, `is_fulfilled`) are kept
2. **Data Migration**: Existing data is migrated to new status fields automatically
3. **Gradual Transition**: Applications can gradually migrate from legacy fields to new status fields

## Benefits

### 1. Consistency
- All content follows the same patterns
- Predictable behavior across content types
- Easier to maintain and extend

### 2. Performance
- Strategic indexes improve query performance
- Unified view enables efficient cross-content queries
- Proper foreign keys enable query optimization

### 3. Scalability
- Clear relationships enable complex queries
- Status-based filtering reduces data transfer
- Indexed fields support large datasets

### 4. Maintainability
- Consistent patterns reduce cognitive load
- Unified RLS policies simplify security
- Clear documentation aids development

## Usage Examples

### Query All Content for a Shelter
```sql
SELECT * FROM unified_content 
WHERE shelter_id = 'shelter-uuid' 
ORDER BY created_at DESC;
```

### Get Active Content Summary
```sql
SELECT 
    content_type,
    COUNT(*) as count
FROM unified_content 
WHERE status IN ('active', 'available', 'published')
GROUP BY content_type;
```

### Find High-Priority Supply Needs
```sql
SELECT * FROM supply_needs 
WHERE status = 'active' 
AND priority IN ('high', 'urgent')
ORDER BY priority DESC, created_at ASC;
```

## Next Steps

1. **Repository Implementation**: Create unified repository classes
2. **Form Updates**: Update posting forms to use new schema
3. **Dashboard Integration**: Update dashboards to use unified content
4. **Public Page Updates**: Update public pages to use new queries
5. **Testing**: Implement comprehensive tests for new schema

## Troubleshooting

### Common Issues

1. **Missing Status Values**: If status is NULL, check migration ran completely
2. **RLS Policy Conflicts**: Drop conflicting policies before creating new ones
3. **Index Creation Failures**: Check for existing indexes with same names
4. **Foreign Key Violations**: Ensure referenced records exist before creating relationships

### Verification Queries

```sql
-- Check all tables have required columns
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('dogs', 'events', 'shelter_stories', 'volunteer_opportunities', 'supply_needs')
AND column_name IN ('id', 'shelter_id', 'status', 'created_at', 'updated_at')
ORDER BY table_name, column_name;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('dogs', 'events', 'shelter_stories', 'volunteer_opportunities', 'supply_needs');

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename;
```