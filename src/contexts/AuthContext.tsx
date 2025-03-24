// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: "applicant" | "representative" | "admin";
  organization_id: string | null;
  is_organization_admin: boolean;
  individual_mode: boolean;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Create a flag to prevent state updates after component unmount
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        const { data } = await supabase.auth.getSession();

        // Exit if component unmounted
        if (!isMounted) return;

        if (data.session) {
          console.log("Session found, setting user...");
          setSession(data.session);
          setUser(data.session.user);

          // Try to fetch profile
          const userProfile = await fetchUserProfile(data.session.user.id);
          if (isMounted && userProfile) {
            setProfile(userProfile);
          }
        }

        // Important: Set loading to false regardless of whether we have a session
        // This prevents the app from being stuck on loading screen
        if (isMounted) {
          console.log("Setting loading to false...");
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Ensure loading state is updated even on error
        if (isMounted) setLoading(false);
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, !!newSession);

      // Exit if component unmounted
      if (!isMounted) return;

      if (event === "SIGNED_IN" && newSession) {
        setSession(newSession);
        setUser(newSession.user);

        const userProfile = await fetchUserProfile(newSession.user.id);
        if (isMounted && userProfile) {
          setProfile(userProfile);
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
      }

      // Update loading state
      if (isMounted) {
        setLoading(false);
      }
    });

    // Initialize auth
    initializeAuth();

    // Cleanup function
    return () => {
      console.log("Auth context cleanup");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("Signing out...");
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Sign out successful");
        // Clear user state
        setSession(null);
        setUser(null);
        setProfile(null);

        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account.",
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
