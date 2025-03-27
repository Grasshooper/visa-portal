
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { organizationsApi } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";

const organizationSchema = z.object({
  name: z.string().min(2, { message: "Organization name is required" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zip: z.string().min(2, { message: "ZIP/Postal code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
});

export default function OrganizationManagement() {
  const { profile } = useAuth();
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      website: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
  });

  // Fetch organization on mount
  useEffect(() => {
    const fetchOrganization = async () => {
      setLoading(true);
      try {
        // Use a default organization ID since organization_id was removed from profile
        const defaultOrgId = "default";
        const data = await organizationsApi.getById(defaultOrgId);
        if (data) {
          setOrganization(data);
          form.reset({
            name: data.name || "",
            website: data.website || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zip: data.zip || "",
            country: data.country || "United States",
          });
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load organization details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof organizationSchema>) => {
    try {
      setLoading(true);
      
      // Use a default organization ID since organization_id was removed from profile
      const defaultOrgId = "default";
      await organizationsApi.update(defaultOrgId, values);
      
      toast({
        title: "Success",
        description: "Organization information updated successfully",
      });
      
      setOrganization({
        ...organization,
        ...values,
      });
    } catch (error) {
      console.error("Error updating organization:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update organization information",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Organization">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Organization Details</h2>
            <p className="text-muted-foreground">
              Manage your organization's information and settings
            </p>
          </div>
          
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center items-center h-64">
                  <p>Loading organization details...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Organization Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St, Suite 456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Postal Code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Organization Information"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize your organization's appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center items-center p-8 border rounded-md bg-muted">
                <p className="text-muted-foreground">Branding settings will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>Manage your organization's subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center items-center p-8 border rounded-md bg-muted">
                <p className="text-muted-foreground">Subscription management will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
