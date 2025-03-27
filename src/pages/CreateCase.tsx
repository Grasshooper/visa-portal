
import { DashboardLayout } from "@/components/dashboard-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateCase = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout title="Create New Case">
      <div className="space-y-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Restructuring</AlertTitle>
          <AlertDescription>
            The case creation functionality is currently disabled while the database is being restructured.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Case</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              The database has been reset to include only essential user authentication tables.
              The case management functionality will be rebuilt soon.
            </p>
            
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCase;
