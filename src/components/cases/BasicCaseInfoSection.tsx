
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { z } from "zod";

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

// Define case schema
export const caseSchema = z.object({
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

export type CaseFormValues = z.infer<typeof caseSchema>;

type BasicCaseInfoSectionProps = {
  control: Control<CaseFormValues>;
};

export function BasicCaseInfoSection({ control }: BasicCaseInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Case Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
        control={control}
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
        control={control}
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
  );
}
