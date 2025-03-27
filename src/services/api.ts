
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
      // Get the user's profile to find their organization_id
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", supabase.auth.getUser().then(user => user.data.user?.id))
        .single();

      if (profileError) {
        if (profileError.code !== 'PGRST116') { // Not found error
          throw profileError;
        }
        return null;
      }

      if (!profileData?.organization_id) {
        return null;
      }

      // Get the organization details
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profileData.organization_id)
        .single();

      if (error) throw error;
      return data;
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
      // Create the organization
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert(data)
        .select()
        .single();

      if (orgError) throw orgError;

      // Update the user's profile with the new organization_id
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ 
            organization_id: orgData.id,
            is_organization_admin: true  // Make the creator an admin
          })
          .eq("id", user.data.user.id);

        if (profileError) throw profileError;
      }

      return orgData;
    });
  },

  async update(id: string, data: any) {
    return safeQuery(async () => {
      const { data: updatedData, error } = await supabase
        .from("organizations")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
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
