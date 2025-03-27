import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { clientSettingsApi } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const settingSchema = z.object({
  setting_key: z.string().min(2, { message: "Setting key is required" }),
  setting_value: z.any(),
  is_global: z.boolean().default(false),
});

type Setting = {
  id: string;
  setting_key: string;
  setting_value: any;
  is_global: boolean;
  created_at: string;
  updated_at: string;
};

export default function ClientSettingsManagement() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  
  const form = useForm<z.infer<typeof settingSchema>>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      setting_key: "",
      setting_value: {},
      is_global: false,
    },
  });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [profile]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Use default organization ID for demonstration since organization_id was removed
      const dummyOrgId = "default";
      const data = await clientSettingsApi.getAll(dummyOrgId);
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load client settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSetting = (setting: Setting) => {
    setSelectedSetting(setting);
    form.reset({
      setting_key: setting.setting_key,
      setting_value: JSON.stringify(setting.setting_value, null, 2),
      is_global: setting.is_global,
    });
  };

  const handleAddSetting = () => {
    setSelectedSetting(null);
    form.reset({
      setting_key: "",
      setting_value: "{}",
      is_global: false,
    });
  };

  const onSubmit = async (values: z.infer<typeof settingSchema>) => {
    setLoading(true);
    try {
      let settingValue;
      
      try {
        // Try to parse JSON if it's a string
        if (typeof values.setting_value === 'string') {
          settingValue = JSON.parse(values.setting_value);
        } else {
          settingValue = values.setting_value;
        }
      } catch (e) {
        // If parsing fails, use as-is
        settingValue = values.setting_value;
      }
      
      const settingData = {
        // Use default organization ID for demonstration
        organization_id: "default",
        setting_key: values.setting_key,
        setting_value: settingValue,
        is_global: values.is_global,
      };
      
      if (selectedSetting) {
        // Update existing setting
        await clientSettingsApi.upsert({
          ...settingData,
          id: selectedSetting.id,
        });
        toast({
          title: "Success",
          description: "Setting updated successfully",
        });
      } else {
        // Create new setting
        await clientSettingsApi.upsert(settingData);
        toast({
          title: "Success",
          description: "Setting created successfully",
        });
      }
      
      fetchSettings();
      setSelectedSetting(null);
      form.reset();
    } catch (error) {
      console.error("Error saving setting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save setting",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSetting = async (id: string) => {
    if (!confirm("Are you sure you want to delete this setting?")) {
      return;
    }
    
    setLoading(true);
    try {
      await clientSettingsApi.delete(id);
      toast({
        title: "Success",
        description: "Setting deleted successfully",
      });
      fetchSettings();
    } catch (error) {
      console.error("Error deleting setting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete setting",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Client Settings">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="portal">Portal Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          <TabsTrigger value="custom">Custom Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">General Client Settings</h2>
              <p className="text-muted-foreground">
                Configure default client settings for your organization
              </p>
            </div>
            <Button onClick={handleAddSetting}>Add Setting</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Settings</CardTitle>
                  <CardDescription>Existing client settings for your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">Loading settings...</div>
                  ) : settings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No settings configured yet. Click "Add Setting" to create one.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {settings.map((setting) => (
                        <Card key={setting.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{setting.setting_key}</h3>
                              <p className="text-sm text-muted-foreground">
                                {setting.is_global ? 'Global setting' : 'Organization-specific setting'}
                              </p>
                              <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-auto max-h-40">
                                {JSON.stringify(setting.setting_value, null, 2)}
                              </pre>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditSetting(setting)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteSetting(setting.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {(selectedSetting || form.getValues().setting_key) && (
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedSetting ? 'Edit Setting' : 'Add Setting'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="setting_key"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Setting Key</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., default_language" {...field} />
                              </FormControl>
                              <FormDescription>
                                A unique identifier for this setting
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="setting_value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Setting Value (JSON)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder='{"value": "en-US", "options": ["en-US", "es-ES"]}'
                                  className="font-mono h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a valid JSON object
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="is_global"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Global Setting</FormLabel>
                                <FormDescription>
                                  Make this setting available to all clients
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setSelectedSetting(null);
                              form.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Setting'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="portal">
          <Card>
            <CardHeader>
              <CardTitle>Client Portal Settings</CardTitle>
              <CardDescription>Configure client portal behavior and appearance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <p className="text-muted-foreground max-w-md">
                Client portal configuration will be available soon. You'll be able to customize 
                the portal interface, required fields, and access controls.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure automated notifications for clients</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <p className="text-muted-foreground max-w-md">
                Notification configuration will be available soon. You'll be able to set up email 
                templates, notification triggers, and schedule automated reminders.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Settings</CardTitle>
              <CardDescription>Define custom settings for your organization</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <p className="text-muted-foreground max-w-md">
                Custom settings configuration will be available soon. You'll be able to define 
                organization-specific settings and fields for clients.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
