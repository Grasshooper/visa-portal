
import { useState } from "react";
import { casesApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useCases = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const { profile } = useAuth();

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const data = await casesApi.getAll();
      setCases(data);
      return data;
    } catch (error: any) {
      toast({
        title: "Error fetching cases",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createCase = async (caseData: any) => {
    setIsLoading(true);
    try {
      // Ensure organization_id is set if available
      if (profile?.organization_id && !caseData.organization_id) {
        caseData.organization_id = profile.organization_id;
      }
      
      // If there's metadata, ensure it's properly formatted as a JSON string
      if (caseData.metadata && typeof caseData.metadata === 'object') {
        caseData.metadata = JSON.stringify(caseData.metadata);
      }
      
      const data = await casesApi.create(caseData);
      toast({
        title: "Case created",
        description: "The case has been created successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating case",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCase = async (id: string, caseData: any) => {
    setIsLoading(true);
    try {
      const data = await casesApi.update(id, caseData);
      toast({
        title: "Case updated",
        description: "The case has been updated successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating case",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCase = async (id: string) => {
    setIsLoading(true);
    try {
      await casesApi.delete(id);
      toast({
        title: "Case deleted",
        description: "The case has been deleted successfully.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting case",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cases,
    isLoading,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
  };
};
