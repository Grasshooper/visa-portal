
import { DashboardLayout } from "@/components/dashboard-layout";
import { CaseFormContainer } from "@/components/cases/CaseFormContainer";

const CreateCase = () => {
  return (
    <DashboardLayout title="Create New Case">
      <CaseFormContainer />
    </DashboardLayout>
  );
};

export default CreateCase;
