// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kmqeosyjdrnurmilgfjn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcWVvc3lqZHJudXJtaWxnZmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Nzk4NDUsImV4cCI6MjA1ODA1NTg0NX0.nxMdGncKvioEYrvdqSQEHC_nVU-gSI3w_oDi5tpCa28";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);