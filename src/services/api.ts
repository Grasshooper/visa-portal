
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
    toast({
      title: "Database restructuring in progress",
      description: "The document types functionality is temporarily disabled.",
    });
    return [];
  },

  async getById(id: string) {
    toast({
      title: "Database restructuring in progress",
      description: "The document types functionality is temporarily disabled.",
    });
    return null;
  },

  async create(data: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The document types functionality is temporarily disabled.",
    });
    return data;
  },

  async update(id: string, data: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The document types functionality is temporarily disabled.",
    });
    return data;
  },

  async delete(id: string) {
    toast({
      title: "Database restructuring in progress",
      description: "The document types functionality is temporarily disabled.",
    });
    return true;
  }
};

// Organizations API - Stubbed out since we removed the table
export const organizationsApi = {
  async getById(id: string) {
    toast({
      title: "Database restructuring in progress",
      description: "The organizations functionality is temporarily disabled.",
    });
    return null;
  },

  async update(id: string, data: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The organizations functionality is temporarily disabled.",
    });
    return data;
  }
};

// Client Settings API - Stubbed out since we removed the table
export const clientSettingsApi = {
  async getByOrganizationId(organizationId: string) {
    toast({
      title: "Database restructuring in progress",
      description: "The client settings functionality is temporarily disabled.",
    });
    return null;
  },

  async update(id: string, data: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The client settings functionality is temporarily disabled.",
    });
    return data;
  }
};

// Form Templates API - Stubbed out since we removed the table
export const formTemplatesApi = {
  async getAll() {
    toast({
      title: "Database restructuring in progress",
      description: "The form templates functionality is temporarily disabled.",
    });
    return [];
  },

  async getById(id: string) {
    toast({
      title: "Database restructuring in progress",
      description: "The form templates functionality is temporarily disabled.",
    });
    return null;
  },

  async create(data: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The form templates functionality is temporarily disabled.",
    });
    return data;
  },

  async update(id: string, data: any) {
    toast({
      title: "Database restructuring in progress",
      description: "The form templates functionality is temporarily disabled.",
    });
    return data;
  },

  async delete(id: string) {
    toast({
      title: "Database restructuring in progress",
      description: "The form templates functionality is temporarily disabled.",
    });
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
