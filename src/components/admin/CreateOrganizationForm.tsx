
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "@/hooks/use-toast";
import { organizationsApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Building2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const organizationSchema = z.object({
  name: z.string().min(2, { message: "Organization name is required" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export function CreateOrganizationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
  });

  const onSubmit = async (values: z.infer<typeof organizationSchema>) => {
    setError(null);
    try {
      console.log("Submitting form with values:", values);
      setLoading(true);
      
      const result = await organizationsApi.create(values);
      console.log("Organization creation result:", result);
      
      setSuccess(true);
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form after successful submission
      form.reset();
    } catch (err) {
      console.error("Error in organization form submit:", err);
      setError(err.message || "An unexpected error occurred when creating the organization");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to create organization",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error creating organization</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success ? (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-muted/50 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium">Organization Created!</h3>
          <p className="text-muted-foreground text-center">
            Your organization has been created successfully.
          </p>
          <Button 
            onClick={() => setSuccess(false)} 
            className="mt-4"
            variant="outline"
          >
            Create Another
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Create New Organization</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the details of the new organization
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
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
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@organization.com" {...field} />
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
                      <Input placeholder="https://www.example.com" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Address Information (Optional)</h4>
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
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Organization"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
