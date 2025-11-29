import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "⚠️ Supabase credentials not configured!\n" +
    "Please create a .env file with:\n" +
    "VITE_SUPABASE_URL=your-supabase-url\n" +
    "VITE_SUPABASE_ANON_KEY=your-anon-key\n\n" +
    "Get these from: Supabase Dashboard -> Settings -> API"
  );
}

export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-key"
);
