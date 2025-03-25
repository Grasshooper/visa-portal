
import { supabase, safeQuery } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Cases API
export const casesApi = {
  async getAll() {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*, applicant_id(*), representative_id(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    });
  },

  async getById(id: string) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*, applicant_id(*), representative_id(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    });
  },

  async create(caseData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("cases")
        .insert(caseData)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async update(id: string, caseData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("cases")
        .update(caseData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async delete(id: string) {
    return safeQuery(async () => {
      const { error } = await supabase
        .from("cases")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    });
  }
};

// Events API
export const eventsApi = {
  async getAll() {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data;
    });
  },

  async getByCase(caseId: string) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("case_id", caseId)
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data;
    });
  },

  async create(eventData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async update(id: string, eventData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async delete(id: string) {
    return safeQuery(async () => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    });
  }
};

// Documents API
export const documentsApi = {
  async getAll() {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, document_type_id(*)")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data;
    });
  },

  async getByCase(caseId: string) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, document_type_id(*)")
        .eq("case_id", caseId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data;
    });
  },

  async uploadDocument(file: File, metadata: any) {
    return safeQuery(async () => {
      const { user_id, organization_id, document_type_id, case_id } = metadata;
      
      // Create path with user_id and organization_id for RLS policies
      const filePath = `${user_id}/${organization_id || 'personal'}/${case_id || 'general'}/${Date.now()}_${file.name}`;
      
      // Upload file to storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('case_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (fileError) throw fileError;

      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('case_documents')
        .getPublicUrl(filePath);

      // Create document record in database
      const documentData = {
        document_type_id,
        user_id,
        organization_id,
        case_id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        metadata: metadata.customFields || {},
      };

      const { data, error } = await supabase
        .from("documents")
        .insert(documentData)
        .select("*, document_type_id(*)")
        .single();

      if (error) {
        // If database insert fails, try to delete the uploaded file
        await supabase.storage.from('case_documents').remove([filePath]);
        throw error;
      }

      return data;
    });
  },

  async delete(id: string, filePath: string) {
    return safeQuery(async () => {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('case_documents')
        .remove([filePath]);

      if (storageError) {
        toast({
          title: "Warning",
          description: "Could not delete file from storage, but record will be removed",
          variant: "destructive",
        });
      }

      // Delete record from database
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    });
  }
};

// Organization API
export const organizationsApi = {
  async getAll() {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");

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

  async create(orgData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("organizations")
        .insert(orgData)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async update(id: string, orgData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("organizations")
        .update(orgData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async delete(id: string) {
    return safeQuery(async () => {
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    });
  }
};

// Document Types API
export const documentTypesApi = {
  async getAll() {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("document_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    });
  },

  async getById(id: string) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("document_types")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    });
  },

  async create(typeData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("document_types")
        .insert(typeData)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async update(id: string, typeData: any) {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("document_types")
        .update(typeData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async delete(id: string) {
    return safeQuery(async () => {
      const { error } = await supabase
        .from("document_types")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    });
  }
};

// Users API (for admin functions)
export const usersApi = {
  async getProfiles() {
    return safeQuery(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, organization_id(*)")
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
