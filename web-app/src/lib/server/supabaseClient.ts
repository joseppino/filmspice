import { createClient } from '@supabase/supabase-js'
import { SB_KEY, SB_URL } from '$env/static/private';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SB_URL, SB_KEY);
