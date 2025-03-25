
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";

const fileFormatOptions = [
  { id: "pdf", label: "PDF" },
  { id: "jpg", label: "JPG" },
  { id: "png", label: "PNG" },
  { id: "doc", label: "DOC" },
  { id: "docx", label: "DOCX" },
];

const documentTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  required_formats: z.array(z.string()).min(1, { message: "At least one format is required" }),
  requirements: z.string().optional(),
  metadata_fields: z.array(
    z.object({
      name: z.string().min(1, { message: "Field name is required" }),
      type: z.string().min(1, { message: "Field type is required" }),
      required: z.boolean().default(false),
    })
  ).optional(),
});

export default function DocumentTypesManagement() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof documentTypeSchema>>({
    resolver: zodResolver(documentTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      required_formats: ["pdf"],
      requirements: "",
      metadata_fields: [
        { name: "Issue Date", type: "date", required: true },
        { name: "Expiry Date", type: "date", required: false },
      ],
    },
  });

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("document_types")
        .select("*")
        .order("name");

      if (error) throw error;
      setDocumentTypes(data || []);
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document types",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (documentType: any) => {
    setEditingId(documentType.id);
    
    form.reset({
      name: documentType.name || "",
      description: documentType.description || "",
      category: documentType.category || "",
      required_formats: documentType.required_formats || ["pdf"],
      requirements: documentType.requirements || "",
      metadata_fields: documentType.metadata_fields || [
        { name: "Issue Date", type: "date", required: true },
        { name: "Expiry Date", type: "date", required: false },
      ],
    });
    
    setIsFormOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof documentTypeSchema>) => {
    try {
      setLoading(true);
      
      if (editingId) {
        // Update existing document type
        const { error } = await supabase
          .from("document_types")
          .update(values)
          .eq("id", editingId);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Document type updated successfully",
        });
      } else {
        // Create new document type
        const { error } = await supabase
          .from("document_types")
          .insert(values);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Document type created successfully",
        });
      }
      
      // Reset form and refresh list
      form.reset();
      setIsFormOpen(false);
      setEditingId(null);
      fetchDocumentTypes();
    } catch (error) {
      console.error("Error saving document type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save document type",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      description: "",
      category: "",
      required_formats: ["pdf"],
      requirements: "",
      metadata_fields: [
        { name: "Issue Date", type: "date", required: true },
        { name: "Expiry Date", type: "date", required: false },
      ],
    });
    setIsFormOpen(true);
  };

  return (
    <AdminLayout title="Document Types Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Document Types</h2>
            <p className="text-muted-foreground">
              Manage document types required for immigration cases
            </p>
          </div>
          <Button onClick={handleNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Document Type
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Formats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : documentTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No document types found. Create your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  documentTypes.map((docType) => (
                    <TableRow key={docType.id}>
                      <TableCell>
                        <div className="font-medium">{docType.name}</div>
                        {docType.description && (
                          <div className="text-sm text-muted-foreground">
                            {docType.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{docType.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {docType.required_formats?.map((format: string) => (
                            <Badge key={format} variant="outline">
                              {format.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(docType)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Document Type" : "Create Document Type"}
              </DialogTitle>
              <DialogDescription>
                Configure a document type for immigration cases
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Passport" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Identity Documents" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Official travel document issued by a government"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="required_formats"
                  render={() => (
                    <FormItem>
                      <FormLabel>Required Formats</FormLabel>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {fileFormatOptions.map((format) => (
                          <FormField
                            key={format.id}
                            control={form.control}
                            name="required_formats"
                            render={({ field }) => (
                              <FormItem
                                key={format.id}
                                className="flex items-center space-x-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(format.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedFormats = checked
                                        ? [...field.value, format.id]
                                        : field.value.filter(
                                            (value) => value !== format.id
                                          );
                                      field.onChange(updatedFormats);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">
                                  {format.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Document must be valid for at least 6 months beyond the intended period of stay"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Metadata Fields</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define what information should be collected about this document type
                  </p>
                  
                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
                    Metadata field configuration will be implemented in the next phase.
                    Default fields will include Issue Date and Expiry Date.
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Document Type"
                      : "Create Document Type"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
