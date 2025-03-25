
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientSettingsManagement() {
  return (
    <AdminLayout title="Client Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Client Configuration</h2>
          <p className="text-muted-foreground">
            Manage client profile templates and portal settings
          </p>
        </div>

        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              Client configuration features are under development and will be available soon. You'll be able to define required profile fields, custom fields, portal access settings, and notification preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
