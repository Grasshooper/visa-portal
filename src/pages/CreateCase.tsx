
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useCases } from "@/hooks/useCases";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usersApi } from "@/services/api";

const caseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  case_number: z.string().optional(),
  case_type: z.string().min(1, "Case type is required"),
  status: z.string().default("pending"),
  priority: z.string().default("medium"),
  notes: z.string().optional(),
  applicant_id: z.string().optional(),
  representative_id: z.string().optional(),
});

const CreateCase = () => {
  const navigate = useNavigate();
  const { createCase, isLoading } = useCases();
  const { user, profile } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const form = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: "",
      case_number: "",
      case_type: "",
      status: "pending",
      priority: "medium",
      notes: "",
      applicant_id: "",
      representative_id: profile?.role === 'representative' ? profile?.id : "",
    },
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoadingProfiles(true);
      try {
        const data = await usersApi.getProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchProfiles();
  }, []);

  const onSubmit = async (values: z.infer<typeof caseSchema>) => {
    try {
      // Add organization_id if user belongs to an organization
      const caseData = {
        ...values,
        organization_id: profile?.organization_id || null,
      };
      
      const newCase = await createCase(caseData);
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
    }
  };

  const getApplicants = () => {
    return profiles.filter(p => p.role === 'applicant');
  };

  const getRepresentatives = () => {
    return profiles.filter(p => p.role === 'representative');
  };

  return (
    <DashboardLayout title="Create New Case">
      <div className="space-y-4 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Case</CardTitle>
            <CardDescription>
              Enter the details to create a new immigration case.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter case title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="case_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CS-1024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="case_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Type*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Work Visa">Work Visa</SelectItem>
                            <SelectItem value="Student Visa">Student Visa</SelectItem>
                            <SelectItem value="Family Visa">Family Visa</SelectItem>
                            <SelectItem value="Permanent Residency">Permanent Residency</SelectItem>
                            <SelectItem value="Citizenship">Citizenship</SelectItem>
                            <SelectItem value="Asylum">Asylum</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in progress">In Progress</SelectItem>
                            <SelectItem value="document review">Document Review</SelectItem>
                            <SelectItem value="interview scheduled">Interview Scheduled</SelectItem>
                            <SelectItem value="on hold">On Hold</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicant_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicant</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select applicant" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingProfiles ? (
                              <div className="flex items-center justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading...
                              </div>
                            ) : (
                              <>
                                <SelectItem value="">Unassigned</SelectItem>
                                {getApplicants().map((applicant) => (
                                  <SelectItem key={applicant.id} value={applicant.id}>
                                    {applicant.first_name} {applicant.last_name}
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="representative_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Representative</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select representative" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingProfiles ? (
                              <div className="flex items-center justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading...
                              </div>
                            ) : (
                              <>
                                <SelectItem value="">Unassigned</SelectItem>
                                {getRepresentatives().map((representative) => (
                                  <SelectItem key={representative.id} value={representative.id}>
                                    {representative.first_name} {representative.last_name}
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional notes about the case"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate('/cases')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Case"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCase;
