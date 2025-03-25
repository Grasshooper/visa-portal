
import { useState, useEffect } from "react";
import { documentTypesApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type DocumentType = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  required_formats: string[];
  requirements: string | null;
  metadata_fields: any | null;
  created_at: string;
  updated_at: string;
};

export function useDocumentTypes() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchDocumentTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await documentTypesApi.getAll();
      setDocumentTypes(data);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load document types: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const createDocumentType = async (data: Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      await documentTypesApi.create(data);
      toast({
        title: "Success",
        description: "Document type created successfully",
      });
      await fetchDocumentTypes();
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create document type: ${error.message}`,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentType = async (id: string, data: Partial<Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    try {
      await documentTypesApi.update(id, data);
      toast({
        title: "Success",
        description: "Document type updated successfully",
      });
      await fetchDocumentTypes();
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update document type: ${error.message}`,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocumentType = async (id: string) => {
    setLoading(true);
    try {
      await documentTypesApi.delete(id);
      toast({
        title: "Success",
        description: "Document type deleted successfully",
      });
      await fetchDocumentTypes();
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete document type: ${error.message}`,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  return {
    documentTypes,
    loading,
    error,
    fetchDocumentTypes,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
  };
}
