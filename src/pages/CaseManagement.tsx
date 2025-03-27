
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CaseManagement = () => {
  return (
    <DashboardLayout title="Case Management">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
            <p className="text-muted-foreground">
              Manage and track all immigration cases.
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Restructuring</AlertTitle>
          <AlertDescription>
            The case management functionality is currently disabled while the database is being restructured. 
            Basic authentication features are still available.
          </AlertDescription>
        </Alert>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Database Reset Complete</CardTitle>
            <CardDescription>
              The database has been successfully reset to only include essential user tables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You can still use the following features:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>User authentication (login/logout)</li>
              <li>Profile management</li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                The case management, document management, and organization features have been temporarily disabled.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CaseManagement;
