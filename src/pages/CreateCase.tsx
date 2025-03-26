
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usersApi } from "@/services/api";

// Define case schema with required fields and the new ones we're adding
const caseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  case_number: z.string().optional(),
  case_type: z.string().min(1, "Case type is required"),
  status: z.string().default("pending"),
  priority: z.string().default("medium"),
  notes: z.string().optional(),
  description: z.string().optional(),
  filing_date: z.date().optional(),
  case_origin: z.string().optional(),
  applicant_id: z.string().optional(),
  representative_id: z.string().optional(),
  
  // Contact Information
  email: z.string().email().optional(),
  phone: z.string().optional(),
  alt_phone: z.string().optional(),
  
  // Address fields
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  
  // Legal representation
  has_legal_representation: z.boolean().default(false),
  representative_name: z.string().optional(),
  representative_firm: z.string().optional(),
  representative_email: z.string().optional(),
  representative_phone: z.string().optional(),
  representative_license: z.string().optional(),
  
  // Administrative fields
  assigned_officer: z.string().optional(),
  processing_track: z.string().default("standard"),
  fee_status: z.string().optional(),
  fee_amount: z.number().optional(),
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
      description: "",
      filing_date: new Date(),
      case_origin: "online_portal",
      applicant_id: profile?.role === 'applicant' ? profile?.id : "",
      representative_id: profile?.role === 'representative' ? profile?.id : "",
      has_legal_representation: false,
      processing_track: "standard",
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
      // Extract relevant fields for the case table
      const caseData = {
        title: values.title,
        case_number: values.case_number,
        case_type: values.case_type,
        status: values.status,
        priority: values.priority,
        notes: values.notes,
        description: values.description,
        filing_date: values.filing_date,
        case_origin: values.case_origin,
        applicant_id: values.applicant_id || null,
        representative_id: values.representative_id || null,
        organization_id: profile?.organization_id || null,
        // Store additional fields as metadata in the notes field if needed
        metadata: JSON.stringify({
          contact: {
            email: values.email,
            phone: values.phone,
            alt_phone: values.alt_phone,
          },
          address: {
            street_address: values.street_address,
            city: values.city,
            state_province: values.state_province,
            postal_code: values.postal_code,
            country: values.country,
          },
          legal_representation: {
            has_legal_representation: values.has_legal_representation,
            representative_name: values.representative_name,
            representative_firm: values.representative_firm,
            representative_email: values.representative_email,
            representative_phone: values.representative_phone,
            representative_license: values.representative_license,
          },
          administrative: {
            assigned_officer: values.assigned_officer,
            processing_track: values.processing_track,
            fee_status: values.fee_status,
            fee_amount: values.fee_amount,
          }
        }),
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

  // Case type options
  const caseTypes = [
    "Visa Application",
    "Residency Permit",
    "Citizenship Application",
    "Asylum Request",
    "Work Permit",
    "Family Reunification",
    "Student Visa",
    "Tourist Visa",
    "Business Visa",
    "Other"
  ];

  // Case origins
  const caseOrigins = [
    { value: "online_portal", label: "Online Portal" },
    { value: "in_person", label: "In Person" },
    { value: "mail", label: "Mail" },
    { value: "transfer", label: "Transfer from Other Department" },
    { value: "referral", label: "Referral" }
  ];

  // Case priorities
  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ];

  // Processing tracks
  const processingTracks = [
    { value: "standard", label: "Standard" },
    { value: "expedited", label: "Expedited" },
    { value: "special_handling", label: "Special Handling" }
  ];

  // Fee statuses
  const feeStatuses = [
    { value: "not_paid", label: "Not Paid" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "waived", label: "Waived" }
  ];

  // Countries list (abbreviated)
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", 
    "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", 
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", 
    "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", 
    "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", 
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", 
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", 
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", 
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", 
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", 
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
    "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
    "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", 
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", 
    "Zimbabwe"
  ];

  return (
    <DashboardLayout title="Create New Case">
      <div className="space-y-4 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Case</CardTitle>
            <CardDescription>
              Enter the details to create a new immigration case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Case Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Case Information</h3>
                  
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
                                <SelectValue placeholder="Select case type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {caseTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
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
                              {priorities.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="case_origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case Origin</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select origin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {caseOrigins.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="filing_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Filing Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a detailed description of the case..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
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
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="street_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state_province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter state or province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal/ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter postal code" {...field} />
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Legal Representation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Legal Representation</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="representative_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Legal Representative</FormLabel>
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
                                  <SelectItem value="unassigned">Unassigned</SelectItem>
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
                </div>

                {/* Administrative Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Administrative Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="processing_track"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Processing Track</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select processing track" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {processingTracks.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fee_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fee status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {feeStatuses.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
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
                        <FormLabel>Additional Notes</FormLabel>
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
                </div>

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
