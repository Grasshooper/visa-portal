
// src/integrations/supabase/client.ts
import {
  createClient,
  SupabaseClient,
  PostgrestError,
} from "@supabase/supabase-js";
import type { Database } from "./types";

// Get environment variables (should be defined in .env file)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Validate environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing Supabase environment variables. Check your .env file."
  );
}

// Configure with performance options
export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true, // Keep session in localStorage for faster loading
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: async (url: RequestInfo, options: RequestInit = {}) => {
        const timeout = 20000; // 20 second timeout
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          return response;
        } finally {
          clearTimeout(id);
        }
      },
    },
    // Cache requests to reduce API calls
    db: {
      schema: "public",
    },
    realtime: {
      params: {
        eventsPerSecond: 1, // Limit realtime events to reduce load
      },
    },
  }
);

// Add auth state change listener for better debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Supabase auth event: ${event}`, session);
});

// Add connection health monitoring
let isOnline = true;
window.addEventListener("online", () => {
  isOnline = true;
});
window.addEventListener("offline", () => {
  isOnline = false;
});

// Helper function to check connection before making requests
// Generic type T for the return value of the query function
export const safeQuery = async <T>(queryFn: () => Promise<T>): Promise<T> => {
  if (!isOnline) {
    throw new Error("You appear to be offline. Please check your connection.");
  }

  try {
    return await queryFn();
  } catch (error) {
    // Check if it's a network error and provide a friendly message
    const err = error as Error | PostgrestError;

    if (
      !isOnline ||
      err.message?.includes("network") ||
      err.message?.includes("connection") ||
      err.message?.includes("Failed to fetch")
    ) {
      throw new Error(
        "Connection to the server failed. Please check your internet connection."
      );
    }
    throw error;
  }
};
