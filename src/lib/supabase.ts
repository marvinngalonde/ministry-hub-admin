import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  date_preached?: string;
  featured: boolean;
  status: 'draft' | 'published';
  views?: number;
  created_at: string;
  updated_at: string;
}

export interface Documentary {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  status: 'draft' | 'published';
  views?: number;
  created_at: string;
  updated_at: string;
}

export interface Presentation {
  id: string;
  title: string;
  type: 'podcast' | 'family_foundations' | 'spiritual_health' | 'bible_studies';
  speaker?: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface SpiritualMaterial {
  id: string;
  title: string;
  type: 'book' | 'article' | 'study_guide';
  author?: string;
  description?: string;
  content_url: string;
  thumbnail_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'moderator' | 'user';
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  group_id?: string;
  content: string;
  image_url?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_by: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}
