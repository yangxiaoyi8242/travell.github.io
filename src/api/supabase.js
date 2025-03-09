import { createClient } from '@supabase/supabase-js'

import { supabaseConfig } from '../../config.js';
const supabaseUrl = supabaseConfig.url
const supabaseAnonKey = supabaseConfig.key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)