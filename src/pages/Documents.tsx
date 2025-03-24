import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentList } from "@/components/DocumentList";
import { DocumentCategories } from "@/components/DocumentCategories";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Grid, List, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Documents = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [documentCount, setDocumentCount] = useState(0);
  const [activeTab, setActiveTab] = useState("categories");
  const [error, setError] = useState<string | null>(null);

  // Fetch document count
  useEffect(() => {
    if (!user) return;

    const fetchDocumentCount = async () => {
      try {
        const { count, error } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        if (error) throw error;
        
        if (count !== null) {
          setDocumentCount(count);
        }
      } catch (error: any) {
        console.error("Error fetching document count:", error.message);
        setError("Failed to load document information");
      }
    };

    fetchDocumentCount();
  }, [user]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <DashboardLayout title="Documents">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout title="Documents">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to access this page.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Document Management">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Document Center</h1>
            <p className="text-muted-foreground">
              Manage, organize, and upload your immigration documents.
            </p>
          </div>
          <Button 
            onClick={() => setActiveTab("upload")} 
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload New Document
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Document Summary</CardTitle>
              <CardDescription>Overview of your document collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Documents</span>
                  <span className="font-medium">{documentCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Required Documents</span>
                  <span className="font-medium">Varies by case</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Document Status</span>
                  <span className="font-medium">View in list</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Document List</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <DocumentCategories />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <DocumentList />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <DocumentUpload />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
