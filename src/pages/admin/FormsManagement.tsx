
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";

export default function FormsManagement() {
  return (
    <AdminLayout title="Forms Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Form Builder</h2>
          <p className="text-muted-foreground">
            Create and manage custom forms for clients and applicants
          </p>
        </div>

        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              The form builder feature is under development and will be available soon. This will allow you to create custom forms with various field types, conditional logic, and validation rules.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
