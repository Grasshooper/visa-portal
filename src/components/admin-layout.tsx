
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Admin" }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const handleTabChange = (value: string) => {
    navigate(value);
  };

  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    if (currentPath.includes('/admin/organization')) return '/admin/organization';
    if (currentPath.includes('/admin/document-types')) return '/admin/document-types';
    if (currentPath.includes('/admin/forms')) return '/admin/forms';
    if (currentPath.includes('/admin/client-settings')) return '/admin/client-settings';
    return '/admin/organization';
  };

  return (
    <DashboardLayout title={title}>
      <div className="space-y-6">
        <Tabs 
          defaultValue={getActiveTab()} 
          value={getActiveTab()}
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="/admin/organization">Organization</TabsTrigger>
            <TabsTrigger value="/admin/document-types">Document Types</TabsTrigger>
            <TabsTrigger value="/admin/forms">Forms</TabsTrigger>
            <TabsTrigger value="/admin/client-settings">Client Settings</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="bg-card rounded-lg border shadow-sm p-6">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}
