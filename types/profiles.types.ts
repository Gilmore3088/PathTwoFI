export interface Profile {
  id: string;
  first_name: string | null;
  avatar_url: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  first_name?: string | null;
  avatar_url?: string | null;
  email: string;
}

export interface ProfileUpdate {
  first_name?: string | null;
  avatar_url?: string | null;
  email?: string;
}
