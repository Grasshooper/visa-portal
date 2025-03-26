
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type CaseFormActionsProps = {
  isLoading: boolean;
  onCancel: () => void;
};

export function CaseFormActions({ isLoading, onCancel }: CaseFormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline" 
        type="button"
        onClick={onCancel}
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
  );
}
