// =====================================================
// UNIFIED DATABASE TYPES
// =====================================================
// These types follow the unified schema pattern with consistent status fields

export type UserRole = 'community' | 'volunteer' | 'shelter' | 'admin';
export type EntityStatus = 'active' | 'inactive' | 'suspended';
export type ContentStatus = 'active' | 'inactive' | 'archived' | 'draft' | 'published';

// =====================================================
// BASE INTERFACES
// =====================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface BaseContent extends BaseEntity {
  shelter_id: string;
  status: string;
}

// =====================================================
// CORE ENTITIES
// =====================================================

export interface Profile extends BaseEntity {
  email: string;
  full_name: string | null;
  role: UserRole;
  shelter_id: string | null;
  status: EntityStatus;
}

export interface Shelter extends BaseEntity {
  name: string;
  access_code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  website: string | null;
  description: string | null;
  status: EntityStatus;
}

// =====================================================
// CONTENT TYPES
// =====================================================

export interface Dog extends BaseContent {
  shelter_name: string | null;
  name: string;
  breed: string;
  age: string | null;
  age_category: 'puppy' | 'young' | 'adult' | 'senior' | null;
  size: 'small' | 'medium' | 'large' | 'extra_large' | null;
  gender: 'male' | 'female' | null;
  temperament: string[] | null;
  description: string | null;
  medical_info: string | null;
  medical_notes: string | null;
  adoption_fee: number | null;
  is_dog_of_week: boolean;
  photo_urls: string[];
  status: 'available' | 'foster' | 'pending' | 'adopted' | 'hold' | 'medical';
}

export interface Event extends BaseContent {
  shelter_name: string | null;
  title: string;
  description: string;
  event_type: 'adoption_event' | 'fundraiser' | 'volunteer_day' | 'community_event' | 'training' | 'other';
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  address: string | null;
  max_attendees: number | null;
  current_attendees: number;
  registration_required: boolean;
  registration_link: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  photo_urls: string[];
  status: 'active' | 'cancelled' | 'completed' | 'draft';
}

export interface ShelterStory extends BaseContent {
  shelter_name: string | null;
  title: string;
  content: string;
  story_type: 'update' | 'success_story' | 'urgent_need' | 'event' | 'thank_you' | 'rescue_story' | 'volunteer_story' | 'general' | 'fundraising';
  dog_name: string | null;
  author_name: string | null;
  photo_url: string | null;
  photo_urls: string[];
  is_featured: boolean;
  // Legacy field for backward compatibility
  is_published: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface VolunteerOpportunity extends BaseContent {
  shelter_name: string | null;
  title: string;
  description: string;
  category: 'animal_care' | 'medical' | 'training' | 'administration' | 'events' | 'transport' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_commitment: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  max_volunteers: number | null;
  current_volunteers: number;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  // Legacy fields for backward compatibility
  opportunity_type: 'dog_walking' | 'cleaning' | 'events' | 'transport' | 'fostering' | 'administrative' | 'general';
  requirements: string | null;
  schedule: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
}

export interface SupplyNeed extends BaseContent {
  shelter_name: string | null;
  item_name: string;
  description: string | null;
  category: 'food' | 'toys' | 'medical' | 'cleaning' | 'bedding' | 'equipment' | 'general';
  quantity_needed: number | null;
  quantity_received: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Legacy field for backward compatibility
  is_fulfilled: boolean;
  status: 'active' | 'fulfilled' | 'cancelled';
}

// =====================================================
// INTERACTION TYPES
// =====================================================

export interface VolunteerSignup extends BaseEntity {
  volunteer_opportunity_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'declined' | 'completed';
}

export interface EventRSVP extends BaseEntity {
  event_id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  number_of_attendees: number;
  message: string | null;
  status: 'confirmed' | 'cancelled' | 'waitlist';
}

export interface SupplyDonation extends BaseEntity {
  supply_need_id: string;
  user_id: string | null;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  quantity_donated: number;
  message: string | null;
  status: 'pledged' | 'delivered' | 'cancelled';
}

// =====================================================
// UNIFIED CONTENT TYPE
// =====================================================

export interface UnifiedContent extends BaseEntity {
  content_type: 'dog' | 'story' | 'event' | 'volunteer_opportunity' | 'supply_need';
  shelter_id: string;
  title: string;
  description: string;
  status: string;
  photo_urls: string[];
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface ShelterAccessCode {
  id: string;
  shelter_id: string;
  code: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface ValidateAccessCodeResponse {
  success: boolean;
  message: string;
  shelter_id?: string;
  shelter_name?: string;
}

export interface ShelterContentSummary {
  dogs: number;
  events: number;
  stories: number;
  opportunities: number;
  supply_needs: number;
}

// =====================================================
// REPOSITORY INTERFACES
// =====================================================

export interface ContentRepository<T extends BaseContent> {
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  findByShelter(shelterId: string): Promise<T[]>;
  findPublic(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
