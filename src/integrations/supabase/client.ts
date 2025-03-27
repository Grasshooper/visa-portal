
// src/integrations/supabase/client.ts
import {
  createClient,
  SupabaseClient,
  PostgrestError,
} from "@supabase/supabase-js";
import type { Database } from "./types";

// Use direct URLs instead of environment variables
const SUPABASE_URL = "https://cfmuztvmdkbmbwzrohji.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXV6dHZtZGtibWJ3enJvaGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MzQxNzAsImV4cCI6MjA1ODMxMDE3MH0.qQsBZA_bbxzW8Qb5XkTi2xvr5aYN2u6iJ7LSsUMWvLM";

// Validate that URLs are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing Supabase configuration. Check your client configuration."
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
  console.log("Connection restored. You are online.");
});
window.addEventListener("offline", () => {
  isOnline = false;
  console.log("Connection lost. You are offline.");
});

// Helper function to check connection before making requests
// Generic type T for the return value of the query function
export const safeQuery = async <T>(queryFn: () => Promise<T>): Promise<T> => {
  if (!isOnline) {
    console.error("You appear to be offline. Please check your connection.");
    throw new Error("You appear to be offline. Please check your connection.");
  }

  try {
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();
    console.log(`Query took ${endTime - startTime}ms to complete`);
    return result;
  } catch (error) {
    // Check if it's a network error and provide a friendly message
    const err = error as Error | PostgrestError;
    console.error("Supabase query error:", err);

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
