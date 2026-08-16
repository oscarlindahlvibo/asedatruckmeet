import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'preview-anon-key';

// All frontend queries are scoped to this app's schema in the shared Supabase instance.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'truckmeet' },
});
