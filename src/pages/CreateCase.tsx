
import { DashboardLayout } from "@/components/dashboard-layout";
import { NewCaseForm } from "@/components/NewCaseForm";

const CreateCase = () => {
  return (
    <DashboardLayout title="Create New Case">
      <div className="space-y-4">
        <NewCaseForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateCase;
