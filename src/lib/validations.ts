import { z } from 'zod';

// Sermon validation schema
export const sermonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  speaker: z.string().min(2, 'Speaker name must be at least 2 characters').max(100),
  description: z.string().max(2000).optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').max(300),
  date_preached: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
  audio_url: z.string().optional(), // New field for audio URL
});

export type SermonFormData = z.infer<typeof sermonSchema> & {
  audio_file?: File; // New field for audio file upload
};

// Documentary validation schema
export const documentarySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').max(500),
  status: z.enum(['draft', 'published']).default('draft'),
});

export type DocumentaryFormData = z.infer<typeof documentarySchema>;

// Presentation validation schema
export const presentationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  type: z.enum(['podcast', 'family_foundations', 'spiritual_health', 'bible_studies']),
  speaker: z.string().min(2).max(100).optional(),
  description: z.string().max(2000).optional(),
  duration: z.number().min(1).max(300),
  status: z.enum(['draft', 'published']).default('draft'),
});

export type PresentationFormData = z.infer<typeof presentationSchema>;

// Spiritual Material validation schema
export const materialSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  type: z.enum(['book', 'article', 'study_guide']),
  author: z.string().min(2).max(100).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export type MaterialFormData = z.infer<typeof materialSchema>;

// Community Group validation schema
export const groupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;

// User validation schema
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  role: z.enum(['admin', 'editor', 'moderator', 'user']),
});

export type UserFormData = z.infer<typeof userSchema>;
