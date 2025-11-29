export type UserRole = 'community' | 'volunteer' | 'shelter' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  shelter_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Shelter {
  id: string;
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
  created_at: string;
  updated_at: string;
}

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
