
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DocumentUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    toast({
      title: "Database restructuring in progress",
      description: "The document upload functionality is temporarily disabled.",
    });
  };

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          You need to be logged in to upload documents.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Document</CardTitle>
        <CardDescription>
          Upload a new document for your immigration case
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Restructuring</AlertTitle>
          <AlertDescription>
            The document upload functionality is currently disabled while the database is being restructured.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button 
            onClick={handleUploadClick} 
            disabled={uploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Document Upload Will Be Available Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
