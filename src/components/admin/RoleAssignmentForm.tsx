
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, Users, User, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserData = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "applicant" | "representative" | "admin";
  is_organization_admin: boolean;
};

type RoleAssignmentFormProps = {
  user: UserData;
  onUpdateSuccess: () => void;
};

export function RoleAssignmentForm({ user, onUpdateSuccess }: RoleAssignmentFormProps) {
  const [role, setRole] = useState<"applicant" | "representative" | "admin">(user.role);
  const [isAdmin, setIsAdmin] = useState(user.is_organization_admin);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role,
          is_organization_admin: isAdmin,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: `Updated role for ${user.email} to ${role}${isAdmin ? " with admin rights" : ""}`,
      });
      
      onUpdateSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: error.message || "An error occurred while updating the role",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Update Role for {user.first_name} {user.last_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">User Role</Label>
            <Select value={role} onValueChange={(value: "applicant" | "representative" | "admin") => setRole(value)}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Immigration Officer/Administrator</span>
                </SelectItem>
                <SelectItem value="representative" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Legal Representative</span>
                </SelectItem>
                <SelectItem value="applicant" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Applicant/Immigrant</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="admin-rights" 
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            />
            <Label htmlFor="admin-rights" className="text-sm font-medium leading-none cursor-pointer">
              System Administrator (can manage users and settings)
            </Label>
          </div>

          <div className="border rounded-md p-4 bg-muted">
            <h4 className="font-medium mb-2">Role Capabilities:</h4>
            {role === "admin" && (
              <ul className="space-y-1 text-sm">
                <li>• Full access to case management system</li>
                <li>• Process and review applications</li>
                <li>• Comprehensive case information access</li>
                <li>• Document verification and processing</li>
                <li>• Appointment scheduling and management</li>
                <li>• Communication with all users</li>
              </ul>
            )}
            {role === "representative" && (
              <ul className="space-y-1 text-sm">
                <li>• Access to represented cases</li>
                <li>• Document submission for clients</li>
                <li>• Communication with officers</li>
                <li>• View case timelines and status updates</li>
                <li>• Appointment scheduling for clients</li>
              </ul>
            )}
            {role === "applicant" && (
              <ul className="space-y-1 text-sm">
                <li>• Access to personal case dashboard</li>
                <li>• Document upload capabilities</li>
                <li>• View case status and timeline</li>
                <li>• Book and manage appointments</li>
                <li>• Communication with assigned officers</li>
                <li>• Access to notification center</li>
              </ul>
            )}
            {isAdmin && (
              <>
                <h4 className="font-medium mt-4 mb-2">System Administrator Capabilities:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• User management and role assignment</li>
                  <li>• System configuration and settings</li>
                  <li>• Form builder and workflow design access</li>
                  <li>• Email template management</li>
                  <li>• Audit log access</li>
                  <li>• System integration management</li>
                </ul>
              </>
            )}
          </div>

          <Button onClick={handleRoleChange} disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Role"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
