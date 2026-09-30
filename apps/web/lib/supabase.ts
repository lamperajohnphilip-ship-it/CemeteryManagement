import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

/**
 * Returns a Supabase client with admin/service-role privileges for server-side operations.
 * Returns null if Supabase environment variables are not configured (Prisma will be used).
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseAdminClient;
}
