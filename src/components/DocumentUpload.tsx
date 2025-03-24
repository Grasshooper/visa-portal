
import { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, FileIcon, Upload, AlertCircle, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface DocumentType {
  id: string;
  category: string;
  name: string;
  description: string;
  required_formats: string[];
  requirements: string;
  metadata_fields: {
    fields: string[];
  };
}

type DocumentTypesByCategory = {
  [category: string]: DocumentType[];
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// Create a complex form schema with Zod that dynamically updates based on selected document type
const baseSchema = z.object({
  documentTypeId: z.string().min(1, "Document type is required"),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size should be less than 20MB`
    ),
  notes: z.string().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.date()])).optional(),
});

type FormValues = z.infer<typeof baseSchema>;

export function DocumentUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [documentTypesByCategory, setDocumentTypesByCategory] = useState<DocumentTypesByCategory>({});
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      documentTypeId: "",
      notes: "",
      metadata: {},
    },
  });
  
  // Fetch document types from the database
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const { data, error } = await supabase
          .from("document_types")
          .select("*")
          .order("category", { ascending: true })
          .order("name", { ascending: true });

        if (error) throw error;

        setDocumentTypes(data || []);

        // Group document types by category
        const groupedByCategory: DocumentTypesByCategory = {};
        data.forEach((docType: DocumentType) => {
          if (!groupedByCategory[docType.category]) {
            groupedByCategory[docType.category] = [];
          }
          groupedByCategory[docType.category].push(docType);
        });

        setDocumentTypesByCategory(groupedByCategory);
      } catch (error: any) {
        console.error("Error fetching document types:", error.message);
        setError("Failed to load document types");
      }
    };

    fetchDocumentTypes();
  }, []);

  // When document type changes, update the selectedDocumentType
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "documentTypeId" && value.documentTypeId) {
        const selected = documentTypes.find(
          (dt) => dt.id === value.documentTypeId
        );
        setSelectedDocumentType(selected || null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, documentTypes]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      form.setValue("file", file, { shouldValidate: true });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      form.setValue("file", file, { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue("file", new File([], ""), { shouldValidate: true });
  };

  const isValidFileType = (file: File) => {
    if (!selectedDocumentType) return true;
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    
    return selectedDocumentType.required_formats.some(format => {
      if (format === "pdf") return fileExtension === "pdf";
      if (format === "jpg") return ["jpg", "jpeg"].includes(fileExtension);
      if (format === "png") return fileExtension === "png";
      return false;
    });
  };
  
  const handleSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to upload documents",
        variant: "destructive",
      });
      return;
    }

    if (!values.file || values.file.size === 0) {
      toast({
        title: "File Required",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!isValidFileType(values.file)) {
      toast({
        title: "Invalid File Type",
        description: `This document type requires ${selectedDocumentType?.required_formats.join(", ")} files`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Format any date fields in metadata
      const formattedMetadata: Record<string, any> = {};
      if (values.metadata) {
        Object.entries(values.metadata).forEach(([key, value]) => {
          if (value instanceof Date) {
            formattedMetadata[key] = format(value, "yyyy-MM-dd");
          } else {
            formattedMetadata[key] = value;
          }
        });
      }

      // Create a unique file path using user ID and timestamp
      const fileExtension = values.file.name.split(".").pop();
      const timestamp = Date.now();
      const filePath = `${user.id}/${values.documentTypeId}_${timestamp}.${fileExtension}`;

      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("case_documents")
        .upload(filePath, values.file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Insert the document record in the database
      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          document_type_id: values.documentTypeId,
          file_path: filePath,
          file_name: values.file.name,
          file_size: values.file.size,
          file_type: values.file.type,
          notes: values.notes,
          metadata: formattedMetadata,
        })
        .select()
        .single();

      if (documentError) throw documentError;

      // Reset form and show success message
      form.reset();
      setSelectedFile(null);
      toast({
        title: "Document Uploaded",
        description: "Your document has been successfully uploaded.",
      });
    } catch (error: any) {
      console.error("Error uploading document:", error.message);
      setError(error.message);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Document</CardTitle>
        <CardDescription>
          Upload a new document for your immigration case
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="categories">By Category</TabsTrigger>
                <TabsTrigger value="all">All Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories">
                <FormField
                  control={form.control}
                  name="documentTypeId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Document Category & Type</FormLabel>
                      <div className="space-y-3">
                        {Object.entries(documentTypesByCategory).map(([category, docTypes]) => (
                          <div key={category} className="space-y-1">
                            <Label className="text-sm font-medium">{category}</Label>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Reset any metadata values
                                form.setValue("metadata", {});
                              }}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a document type" />
                              </SelectTrigger>
                              <SelectContent>
                                {docTypes.map((docType) => (
                                  <SelectItem key={docType.id} value={docType.id}>
                                    {docType.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="all">
                <FormField
                  control={form.control}
                  name="documentTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset any metadata values
                          form.setValue("metadata", {});
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-80">
                            {Object.entries(documentTypesByCategory).map(([category, docTypes]) => (
                              <SelectGroup key={category}>
                                <SelectLabel>{category}</SelectLabel>
                                {docTypes.map((docType) => (
                                  <SelectItem key={docType.id} value={docType.id}>
                                    {docType.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {selectedDocumentType && (
              <div className="mt-4 space-y-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Document Requirements</h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs text-muted-foreground">Accepted formats:</span>
                    {selectedDocumentType.required_formats.map((format) => (
                      <Badge key={format} variant="outline" className="uppercase text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocumentType.requirements}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Upload File</FormLabel>
                      <FormControl>
                        <div 
                          className={cn(
                            "border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
                            dragActive ? "border-primary bg-muted" : "border-muted-foreground/25 hover:border-muted-foreground/40"
                          )}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept={selectedDocumentType.required_formats
                              .map(format => format === "jpg" ? ".jpg,.jpeg" : `.${format}`)
                              .join(",")}
                            {...fieldProps}
                          />
                          
                          {selectedFile ? (
                            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                              <div className="flex items-center space-x-2">
                                <FileIcon className="h-6 w-6 text-primary" />
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-medium">{selectedFile.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatFileSize(selectedFile.size)}
                                  </span>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile();
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="mx-auto w-10 h-10 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                                <Upload className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Drag & drop or click to upload
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  File must be in {selectedDocumentType.required_formats.join(", ")} format (Max 20MB)
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Document Metadata Fields based on selected document type */}
                {selectedDocumentType?.metadata_fields?.fields?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Document Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDocumentType.metadata_fields.fields.map((field) => {
                        const isDateField = field.includes("date") || field.includes("expiry") || field.includes("issue");
                        const fieldKey = field;
                        const fieldLabel = field
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ");

                        return isDateField ? (
                          <FormField
                            key={fieldKey}
                            control={form.control}
                            name={`metadata.${fieldKey}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>{fieldLabel}</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value as Date, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value as Date}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            key={fieldKey}
                            control={form.control}
                            name={`metadata.${fieldKey}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{fieldLabel}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Add any additional notes about this document" />
                      </FormControl>
                      <FormDescription>
                        Optional notes for your reference or for the immigration team.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={uploading || !selectedFile || !form.formState.isValid}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
