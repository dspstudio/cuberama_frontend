import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onihvxwthoxzrlvbpgfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaWh2eHd0aG94enJsdmJwZ2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTYxODcsImV4cCI6MjA3NjI5MjE4N30.Xc04VQUBY6QKleEHPivHlEWfVqr0rwjYzHBb3-HXALA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
