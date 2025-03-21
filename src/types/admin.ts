
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

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  payment_method: string;
  current_period_end: string;
  created_at: string;
  userProfile?: UserProfile;
}
