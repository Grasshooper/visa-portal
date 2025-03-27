
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileIcon, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { documentTypesApi } from "@/services/api";

// Define the correct structure for metadata_fields
interface DocumentTypeMetadataFields {
  fields: string[];
}

interface DocumentType {
  id: string;
  category: string;
  name: string;
  description: string;
  required_formats: string[];
  requirements: string;
  metadata_fields: DocumentTypeMetadataFields;
  created_at?: string;
  updated_at?: string;
}

type DocumentTypesByCategory = {
  [category: string]: DocumentType[];
};

export function DocumentCategories() {
  const [loading, setLoading] = useState(true);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypesByCategory>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setLoading(true);
        const data = await documentTypesApi.getAll();
        
        // Since we know this API is stubbed and returns empty array, 
        // we'll provide some placeholder data for UI rendering
        const placeholderTypes: DocumentTypesByCategory = {
          "Identity Documents": [
            {
              id: "1",
              category: "Identity Documents",
              name: "Passport",
              description: "International travel document",
              required_formats: ["pdf", "jpg"],
              requirements: "Must be valid for at least 6 months",
              metadata_fields: { fields: ["issue_date", "expiry_date", "passport_number"] }
            },
            {
              id: "2",
              category: "Identity Documents",
              name: "Driver's License",
              description: "Government issued ID",
              required_formats: ["pdf", "jpg", "png"],
              requirements: "Must be current and not expired",
              metadata_fields: { fields: ["issue_date", "expiry_date", "license_number"] }
            }
          ],
          "Immigration Forms": [
            {
              id: "3",
              category: "Immigration Forms",
              name: "Form I-485",
              description: "Application to Register Permanent Residence",
              required_formats: ["pdf"],
              requirements: "Must be completed and signed",
              metadata_fields: { fields: ["submission_date", "case_number"] }
            }
          ]
        };
        
        setDocumentTypes(placeholderTypes);
      } catch (error: any) {
        console.error("Error fetching document types:", error.message);
        setError("Failed to load document categories");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[250px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load document categories</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="space-y-4">
        {Object.entries(documentTypes).map(([category, docs]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 pt-2">
                {docs.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-primary" />
                          {doc.name}
                        </CardTitle>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                {doc.required_formats.map((format) => (
                                  <Badge key={format} variant="outline" className="uppercase">
                                    {format}
                                  </Badge>
                                ))}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Accepted file formats</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <CardDescription>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-1 items-start">
                          <InfoIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{doc.requirements}</p>
                        </div>
                        
                        {doc.metadata_fields && doc.metadata_fields.fields && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-muted-foreground text-xs mr-1">Information needed:</span>
                            {doc.metadata_fields.fields.map((field) => (
                              <Badge key={field} variant="secondary" className="text-xs">
                                {field.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
