import { supabase, safeQuery } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Cases API - Stubbed out since we removed the table
export const casesApi = {
  async getAll() {
    return [];
  },

  async getById(id: string) {
    return null;
  },

  async create(caseData: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The cases functionality is temporarily disabled.",
    });
    return caseData;
  },

  async update(id: string, caseData: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The cases functionality is temporarily disabled.",
    });
    return caseData;
  },

  async delete(id: string) {
    toast({
      title: "Database restructuring in progress",
      description: "The cases functionality is temporarily disabled.",
    });
    return true;
  }
};

// Document Types API - Stubbed out since we removed the table
export const documentTypesApi = {
  async getAll() {
    return [];
  },

  async getById(id: string) {
    return null;
  },

  async create(data: any) {
    return data;
  },

  async update(id: string, data: any) {
    return data;
  },

  async delete(id: string) {
    return true;
  }
};

// Organizations API
export const organizationsApi = {
  async getUserOrganization() {
    return safeQuery(async () => {
      try {
        console.log("Fetching user organization...");
        // Get the user's profile to find their organization_id
        const { data: userResponse } = await supabase.auth.getUser();
        const userId = userResponse.user?.id;
        
        if (!userId) {
          console.log("No user ID found");
          return null;
        }

        console.log("User ID:", userId);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          if (profileError.code !== 'PGRST116') { // Not found error
            throw profileError;
          }
          return null;
        }

        console.log("Profile data:", profileData);

        if (!profileData?.organization_id) {
          console.log("No organization ID found in profile");
          return null;
        }

        // Get the organization details
        const { data, error } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", profileData.organization_id)
          .single();

        if (error) {
          console.error("Organization fetch error:", error);
          throw error;
        }
        
        console.log("Organization data:", data);
        return data;
      } catch (error) {
        console.error("Error in getUserOrganization:", error);
        throw error;
      }
    });
  },

  async getById(id: string) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    });
  },

  async create(data: any) {
    return safeQuery(async () => {
      try {
        console.log("Creating organization with data:", data);
        // Create the organization
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .insert(data)
          .select()
          .single();

        if (orgError) {
          console.error("Organization creation error:", orgError);
          throw orgError;
        }

        console.log("Organization created:", orgData);

        // Update the user's profile with the new organization_id
        const { data: userResponse } = await supabase.auth.getUser();
        const userId = userResponse.user?.id;
        
        if (userId) {
          console.log("Updating user profile with organization ID:", orgData.id);
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ 
              organization_id: orgData.id,
              is_organization_admin: true  // Make the creator an admin
            })
            .eq("id", userId);

          if (profileError) {
            console.error("Profile update error:", profileError);
            throw profileError;
          }
          console.log("User profile updated successfully");
        } else {
          console.error("No user ID found when trying to update profile");
        }

        return orgData;
      } catch (error) {
        console.error("Error in organization creation:", error);
        toast({
          variant: "destructive",
          title: "Creation failed",
          description: error.message || "Failed to create organization",
        });
        throw error;
      }
    });
  },

  async update(id: string, data: any) {
    return safeQuery(async () => {
      try {
        console.log("Updating organization with ID:", id, "Data:", data);
        const { data: updatedData, error } = await supabase
          .from("organizations")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Organization update error:", error);
          throw error;
        }
        
        console.log("Organization updated:", updatedData);
        return updatedData;
      } catch (error) {
        console.error("Error in organization update:", error);
        throw error;
      }
    });
  }
};

// Client Settings API
export const clientSettingsApi = {
  async getByOrganizationId(organizationId: string) {
    return null;
  },

  async getAll(organizationId: string) {
    return [];
  },

  async update(id: string, data: any) {
    return data;
  },

  async upsert(data: any) {
    return data;
  },

  async delete(id: string) {
    return true;
  }
};

// Form Templates API
export const formTemplatesApi = {
  async getAll() {
    return [];
  },

  async getById(id: string) {
    return null;
  },

  async create(data: any) {
    return data;
  },

  async update(id: string, data: any) {
    return data;
  },

  async delete(id: string) {
    return true;
  }
};

// Users API (for fetching profiles)
export const usersApi = {
  async getProfiles() {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    });
  },

  async updateProfile(id: string, profileData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  }
};
