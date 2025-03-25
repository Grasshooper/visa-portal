
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formTemplatesApi } from "@/services/api";
import { PlusCircle, Edit, Trash2, Copy } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Form name is required" }),
  description: z.string().optional(),
  category: z.string().optional(),
  is_active: z.boolean().default(true),
  fields: z.any().default([]),
});

type FormTemplate = {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  category: string | null;
  fields: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function FormsManagement() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [activeTab, setActiveTab] = useState("templates");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      is_active: true,
      fields: [],
    },
  });

  // Fetch form templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, [profile]);

  const fetchTemplates = async () => {
    if (!profile?.organization_id) return;
    
    setLoading(true);
    try {
      const data = await formTemplatesApi.getAll();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load form templates",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
    form.reset({
      name: "",
      description: "",
      category: "",
      is_active: true,
      fields: [],
    });
    setActiveTab("builder");
  };

  const handleEditTemplate = (template: FormTemplate) => {
    setIsEditing(true);
    setSelectedTemplate(template);
    form.reset({
      name: template.name,
      description: template.description || "",
      category: template.category || "",
      is_active: template.is_active,
      fields: template.fields,
    });
    setActiveTab("builder");
  };

  const handleDuplicateTemplate = (template: FormTemplate) => {
    setIsEditing(false);
    setSelectedTemplate(null);
    form.reset({
      name: `${template.name} (Copy)`,
      description: template.description || "",
      category: template.category || "",
      is_active: true,
      fields: template.fields,
    });
    setActiveTab("builder");
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }
    
    setLoading(true);
    try {
      await formTemplatesApi.delete(id);
      toast({
        title: "Success",
        description: "Form template deleted successfully",
      });
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete form template",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profile?.organization_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You are not associated with an organization",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = {
        ...values,
        organization_id: profile.organization_id,
        fields: values.fields || [], // Ensure fields is an array
      };
      
      if (isEditing && selectedTemplate) {
        // Update existing template
        await formTemplatesApi.update(selectedTemplate.id, formData);
        toast({
          title: "Success",
          description: "Form template updated successfully",
        });
      } else {
        // Create new template
        await formTemplatesApi.create(formData);
        toast({
          title: "Success",
          description: "Form template created successfully",
        });
      }
      
      fetchTemplates();
      setActiveTab("templates");
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save form template",
      });
    } finally {
      setLoading(false);
    }
  };

  // Categories for form templates
  const formCategories = [
    "Immigration Application",
    "Client Intake",
    "Document Request",
    "Legal Questionnaire",
    "Case Update",
    "Other",
  ];

  return (
    <AdminLayout title="Forms Management">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Form Templates</h2>
              <p className="text-muted-foreground">
                Manage custom forms for clients and applicants
              </p>
            </div>
            <Button onClick={handleCreateTemplate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground mb-4">No form templates found</p>
                <Button onClick={handleCreateTemplate}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Template
                </Button>
              </div>
            ) : (
              templates.map((template) => (
                <Card key={template.id} className={!template.is_active ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {template.category && (
                      <span className="inline-block px-2 py-1 text-xs bg-muted rounded-full">
                        {template.category}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description || "No description provided"}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {template.is_active ? "Active" : "Inactive"}
                      </span>
                      <span>
                        {new Date(template.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Form Template" : "Create Form Template"}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Modify your existing form template" 
                  : "Design a new form template for your clients"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Client Intake Form" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for this form template
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the purpose of this form..."
                            className="resize-none"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Help users understand what this form is for
                        </FormDescription>
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
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {formCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Categorize this form for better organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Inactive forms won't be available to clients
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Form Fields</h3>
                    <p className="text-center py-6 text-muted-foreground">
                      Advanced form builder functionality will be available soon. You'll be able to 
                      create form fields with various types, validation rules, and conditional logic.
                    </p>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("templates")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : isEditing ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Form Submissions</CardTitle>
              <CardDescription>View and manage client form submissions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <p className="text-muted-foreground max-w-md">
                The form submissions management interface will be available soon. 
                You'll be able to view, filter, and export form responses.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
