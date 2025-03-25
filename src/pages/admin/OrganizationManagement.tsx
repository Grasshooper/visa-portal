
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { organizationsApi } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const organizationSchema = z.object({
  name: z.string().min(2, { message: "Organization name is required" }),
  contact_email: z.string().email({ message: "Invalid email address" }),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  organization_type: z.string().optional(),
});

export default function OrganizationManagement() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      organization_type: "",
    },
  });

  // Fetch organization data on component mount
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!profile?.organization_id) return;
      
      setLoading(true);
      try {
        const data = await organizationsApi.getById(profile.organization_id);
        
        if (data) {
          form.reset({
            name: data.name || "",
            contact_email: data.contact_email || "",
            contact_phone: data.contact_phone || "",
            address: data.address || "",
            organization_type: data.organization_type || "",
          });
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load organization data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [profile, form, toast]);

  const onSubmit = async (values: z.infer<typeof organizationSchema>) => {
    if (!profile?.organization_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You are not associated with an organization",
      });
      return;
    }

    setLoading(true);
    try {
      await organizationsApi.update(profile.organization_id, values);

      toast({
        title: "Success",
        description: "Organization details updated successfully",
      });
    } catch (error) {
      console.error("Error updating organization:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update organization details",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Organization Management">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organization Management</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/create-test-users">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Test Users
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Organization Profile</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <h2 className="text-2xl font-bold">Organization Profile</h2>
          <p className="text-muted-foreground">
            Manage your organization's profile information.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the official name of your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@organization.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Main contact email for your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (123) 456-7890" {...field} />
                    </FormControl>
                    <FormDescription>
                      Main contact phone for your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="123 Main St, City, State, ZIP" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Physical address of your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="organization_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Law Firm, Immigration Consultancy, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Type or category of your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="branding">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Branding</h2>
            <p className="text-muted-foreground mb-6">
              Manage your organization's branding elements. This section will allow you to customize the appearance of your organization in the application.
            </p>
            <div className="text-center text-muted-foreground py-8">
              Branding configuration will be available soon.
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="access">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Access Control</h2>
            <p className="text-muted-foreground mb-6">
              Manage user access and permissions within your organization.
            </p>
            <div className="text-center text-muted-foreground py-8">
              Access control configuration will be available soon.
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
