
export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  subscription?: {
    plan_id: string;
    status: string;
  } | null;
}
