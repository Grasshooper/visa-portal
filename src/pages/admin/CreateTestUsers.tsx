
import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the valid role types to match the database enum
type UserRole = "applicant" | "representative" | "admin";

type TestUser = {
  email: string;
  password: string;
  userData: {
    first_name: string;
    last_name: string;
    role: UserRole;
    is_organization_admin: boolean;
    organization_id: string | null;
    phone: string;
    individual_mode?: boolean;
  }
};

const testUsers: TestUser[] = [
  {
    email: "admin@abclegal.com",
    password: "Password123!",
    userData: {
      first_name: "John",
      last_name: "Admin",
      role: "admin",
      is_organization_admin: true,
      organization_id: "11111111-1111-1111-1111-111111111111",
      phone: "+12025550101"
    }
  },
  {
    email: "rep@abclegal.com",
    password: "Password123!",
    userData: {
      first_name: "Sarah",
      last_name: "Rep",
      role: "representative",
      is_organization_admin: false,
      organization_id: "11111111-1111-1111-1111-111111111111",
      phone: "+12025550102"
    }
  },
  {
    email: "admin@xyzimmigration.com",
    password: "Password123!",
    userData: {
      first_name: "Michael",
      last_name: "Director",
      role: "admin",
      is_organization_admin: true,
      organization_id: "22222222-2222-2222-2222-222222222222",
      phone: "+12025550103"
    }
  },
  {
    email: "applicant@example.com",
    password: "Password123!",
    userData: {
      first_name: "David",
      last_name: "Client",
      role: "applicant",
      is_organization_admin: false,
      organization_id: null,
      phone: "+12025550104",
      individual_mode: true
    }
  }
];

export default function CreateTestUsers() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{email: string, success: boolean, message: string}[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createUsers = async () => {
    setLoading(true);
    setResults([]);
    
    const creationResults = [];

    for (const user of testUsers) {
      try {
        // Create the user account
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: user.userData,
          }
        });

        if (error) throw error;

        // Check if user was created
        if (data && data.user) {
          // Manually create or update profile if needed
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: user.email,
              first_name: user.userData.first_name,
              last_name: user.userData.last_name,
              role: user.userData.role,
              is_organization_admin: user.userData.is_organization_admin,
              organization_id: user.userData.organization_id,
              phone: user.userData.phone,
              individual_mode: user.userData.individual_mode || false
            });

          if (profileError) {
            creationResults.push({
              email: user.email,
              success: true,
              message: `User created, but profile update failed: ${profileError.message}`
            });
          } else {
            creationResults.push({
              email: user.email,
              success: true,
              message: "User account and profile created successfully"
            });
          }
        } else {
          creationResults.push({
            email: user.email,
            success: false,
            message: "User creation returned no data"
          });
        }
      } catch (error: any) {
        console.error(`Error creating user ${user.email}:`, error);
        creationResults.push({
          email: user.email,
          success: false,
          message: error.message || "Unknown error"
        });
      }
    }
    
    setResults(creationResults);
    setLoading(false);
    
    // Show a summary toast
    const successCount = creationResults.filter(r => r.success).length;
    if (successCount === testUsers.length) {
      toast({
        title: "Success",
        description: `All ${successCount} test users created successfully`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Partial completion",
        description: `Created ${successCount} of ${testUsers.length} test users`,
      });
    }
  };

  return (
    <AdminLayout title="Create Test Users">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Test User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This will create test user accounts with the following credentials. All accounts use the password: <strong>Password123!</strong>
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Test Users to Create:</h3>
                <ul className="space-y-2">
                  {testUsers.map((user, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="font-mono bg-muted px-1 rounded">{user.email}</span>
                      <span className="text-muted-foreground">
                        ({user.userData.first_name} {user.userData.last_name}, 
                        Role: {user.userData.role}, 
                        Admin: {user.userData.is_organization_admin ? "Yes" : "No"})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {results.length > 0 && (
                <div className="border rounded-md p-4 bg-muted">
                  <h3 className="font-medium mb-2">Results:</h3>
                  <ul className="space-y-2">
                    {results.map((result, index) => (
                      <li key={index} className={`p-2 rounded ${result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                        <span className="font-mono">{result.email}</span>: {result.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => navigate("/admin/organization")}>
                  Back to Organization
                </Button>
                <Button onClick={createUsers} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Creating Users..." : "Create Test Users"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
