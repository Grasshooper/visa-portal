
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Control } from "react-hook-form";
import { CaseFormValues } from "./BasicCaseInfoSection";

type LegalRepresentationSectionProps = {
  control: Control<CaseFormValues>;
  getRepresentatives: () => any[];
  loadingProfiles: boolean;
};

export function LegalRepresentationSection({ 
  control, 
  getRepresentatives, 
  loadingProfiles 
}: LegalRepresentationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Legal Representation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
  );
}
