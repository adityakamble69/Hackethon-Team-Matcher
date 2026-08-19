import { createClient } from '@supabase/supabase-js';

// Backend Supabase client — uses the service_role key, bypasses RLS.
// NEVER expose this key to the frontend. All writes here must be validated in controllers.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
