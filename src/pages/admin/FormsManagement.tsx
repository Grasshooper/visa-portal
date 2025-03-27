
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formTemplatesApi } from "@/services/api";
import { PlusCircle, Edit, Trash, Eye, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function FormsManagement() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [formTemplates, setFormTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch form templates on mount
  useEffect(() => {
    fetchFormTemplates();
  }, []);

  // Fetch form templates
  const fetchFormTemplates = async () => {
    setLoading(true);
    try {
      const data = await formTemplatesApi.getAll();
      setFormTemplates(data || []);
    } catch (error) {
      console.error("Error fetching form templates:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load form templates",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form template deletion
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this form template?")) {
      try {
        await formTemplatesApi.delete(id);
        toast({
          title: "Success",
          description: "Form template deleted successfully",
        });
        fetchFormTemplates();
      } catch (error) {
        console.error("Error deleting form template:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete form template",
        });
      }
    }
  };

  // Filter form templates based on search query
  const filteredTemplates = formTemplates.filter((template) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      template.title?.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower) ||
      template.category?.toLowerCase().includes(searchLower)
    );
  });

  // Handler for creating a new form template
  const handleCreateTemplate = async () => {
    try {
      // Use a default organization ID for demonstration
      const defaultOrgId = "default";
      
      const newTemplate = {
        title: "New Form Template",
        description: "Description for the new form template",
        form_schema: {
          fields: [],
          layout: "standard",
        },
        category: "General",
        is_published: false,
      };

      const result = await formTemplatesApi.create(newTemplate);
      toast({
        title: "Success",
        description: "Form template created successfully",
      });
      fetchFormTemplates();
    } catch (error) {
      console.error("Error creating form template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create form template",
      });
    }
  };

  return (
    <AdminLayout title="Form Templates">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form Templates</CardTitle>
              <CardDescription>
                Create and manage forms for immigration processes
              </CardDescription>
            </div>
            <Button onClick={handleCreateTemplate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-10">Loading form templates...</div>
          ) : formTemplates.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No form templates found. Create your first template to get started.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div className="font-medium">{template.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {template.description}
                        </div>
                      </TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={template.is_published ? "default" : "outline"}
                        >
                          {template.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
