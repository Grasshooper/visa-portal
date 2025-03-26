
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { CaseFormValues } from "./BasicCaseInfoSection";

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

type AdministrativeDetailsSectionProps = {
  control: Control<CaseFormValues>;
};

export function AdministrativeDetailsSection({ control }: AdministrativeDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Administrative Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
        control={control}
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
  );
}
