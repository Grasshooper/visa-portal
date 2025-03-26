
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCases } from "@/hooks/useCases";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi } from "@/services/api";
import { Form } from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BasicCaseInfoSection, caseSchema, CaseFormValues } from "./BasicCaseInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { LegalRepresentationSection } from "./LegalRepresentationSection";
import { AdministrativeDetailsSection } from "./AdministrativeDetailsSection";
import { CaseFormActions } from "./CaseFormActions";

export function CaseFormContainer() {
  const navigate = useNavigate();
  const { createCase, isLoading } = useCases();
  const { user, profile } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: "",
      case_number: "",
      case_type: "",
      status: "pending",
      priority: "medium",
      notes: "",
      description: "",
      filing_date: new Date(),
      case_origin: "online_portal",
      applicant_id: profile?.role === 'applicant' ? profile?.id : "",
      representative_id: profile?.role === 'representative' ? profile?.id : "",
      has_legal_representation: false,
      processing_track: "standard",
    },
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoadingProfiles(true);
      try {
        const data = await usersApi.getProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchProfiles();
  }, []);

  const onSubmit = async (values: CaseFormValues) => {
    try {
      console.log("Submitting case form with values:", values);
      
      // Extract relevant fields for the cases table with the new schema
      const caseData = {
        title: values.title,
        case_number: values.case_number,
        case_type: values.case_type,
        status: values.status,
        priority: values.priority,
        notes: values.notes,
        description: values.description,
        filing_date: values.filing_date,
        case_origin: values.case_origin,
        applicant_id: values.applicant_id || null,
        representative_id: values.representative_id || null,
        organization_id: profile?.organization_id || null,
        
        // Store additional fields as metadata in the JSONB field
        metadata: {
          contact: {
            email: values.email,
            phone: values.phone,
            alt_phone: values.alt_phone,
          },
          address: {
            street_address: values.street_address,
            city: values.city,
            state_province: values.state_province,
            postal_code: values.postal_code,
            country: values.country,
          },
          legal_representation: {
            has_legal_representation: values.has_legal_representation,
            representative_name: values.representative_name,
            representative_firm: values.representative_firm,
            representative_email: values.representative_email,
            representative_phone: values.representative_phone,
            representative_license: values.representative_license,
          },
          administrative: {
            assigned_officer: values.assigned_officer,
            processing_track: values.processing_track,
            fee_status: values.fee_status,
            fee_amount: values.fee_amount,
          }
        },
      };
      
      console.log("Preparing caseData for submission:", caseData);
      
      const newCase = await createCase(caseData);
      console.log("Case created successfully:", newCase);
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
    }
  };

  const getApplicants = () => {
    return profiles.filter(p => p.role === 'applicant');
  };

  const getRepresentatives = () => {
    return profiles.filter(p => p.role === 'representative');
  };

  const handleCancel = () => {
    navigate('/cases');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Case</CardTitle>
          <CardDescription>
            Enter the details to create a new immigration case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Case Information */}
              <BasicCaseInfoSection control={form.control} />
              
              {/* Contact Information */}
              <ContactInfoSection control={form.control} />
              
              {/* Legal Representation */}
              <LegalRepresentationSection 
                control={form.control}
                getRepresentatives={getRepresentatives}
                loadingProfiles={loadingProfiles}
              />
              
              {/* Administrative Fields */}
              <AdministrativeDetailsSection control={form.control} />
              
              {/* Form Actions */}
              <CaseFormActions 
                isLoading={isLoading} 
                onCancel={handleCancel} 
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
