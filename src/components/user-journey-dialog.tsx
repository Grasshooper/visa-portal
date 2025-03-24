
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UserJourneyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("onboarding");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">User Journey Overview</DialogTitle>
          <DialogDescription>
            Learn how our platform works for different types of users.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="onboarding" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="onboarding">Stage 1</TabsTrigger>
            <TabsTrigger value="dashboard">Stage 2</TabsTrigger>
            <TabsTrigger value="cases">Stage 3</TabsTrigger>
            <TabsTrigger value="documents">Stage 4</TabsTrigger>
            <TabsTrigger value="communication">Stage 5</TabsTrigger>
            <TabsTrigger value="appointments">Stage 6</TabsTrigger>
            <TabsTrigger value="decision">Stage 7</TabsTrigger>
          </TabsList>
          
          <TabsContent value="onboarding" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Stage 1: Onboarding & Authentication</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">User Types</h4>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-green-100 p-2 rounded text-center text-sm">Immigration Officer</div>
                  <div className="bg-purple-100 p-2 rounded text-center text-sm">System Administrator</div>
                  <div className="bg-blue-100 p-2 rounded text-center text-sm">Immigrant/Applicant</div>
                  <div className="bg-yellow-100 p-2 rounded text-center text-sm">Legal Representative</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-800 text-white p-2 rounded w-24 text-center mb-4">Login</div>
                    <div className="bg-gray-800 text-white p-2 rounded w-36 text-center mb-4">Profile Setup</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-200 p-2 rounded w-24 text-center mb-4">Registration</div>
                    <div className="bg-gray-800 text-white p-2 rounded w-24 text-center mb-4">Verification</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Stage 2: Dashboard & Navigation</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="bg-gray-800 text-white p-2 rounded w-32 text-center mb-6">User Dashboard</div>
                <div className="grid grid-cols-3 gap-12">
                  <div className="bg-gray-800 text-white p-2 rounded text-center">Navigation</div>
                  <div className="bg-gray-800 text-white p-2 rounded text-center">Search/Filter</div>
                  <div className="bg-gray-800 text-white p-2 rounded text-center">Notifications</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cases" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Stage 3: Case Management</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 gap-12 mb-6">
                  <div className="bg-gray-800 text-white p-2 rounded text-center">View Cases</div>
                  <div className="bg-yellow-200 p-2 rounded text-center">Case Detail</div>
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <div className="bg-green-200 p-2 rounded text-center">Create Case</div>
                  <div className="bg-green-200 p-2 rounded text-center">Update Case</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Stage 4: Document Management</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 gap-12 mb-6">
                  <div className="bg-blue-200 p-2 rounded text-center">Upload Documents</div>
                  <div className="bg-yellow-200 p-2 rounded text-center">Document Repository</div>
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <div className="bg-yellow-200 p-2 rounded text-center">Document Verification</div>
                  <div className="bg-gray-800 text-white p-2 rounded text-center">Document History</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="communication" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Stage 5: Communication</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="bg-yellow-200 p-2 rounded text-center mb-6">Message Center</div>
                <div className="bg-blue-200 p-2 rounded text-center mb-6">Send Message</div>
                <div className="bg-gray-800 text-white p-2 rounded text-center mb-6">Message History</div>
                <div className="bg-gray-800 text-white p-2 rounded text-center">Notifications</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Stage 6: Appointments</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="bg-gray-800 text-white p-2 rounded text-center mb-6">Calendar View</div>
                <div className="bg-gray-800 text-white p-2 rounded text-center mb-6">Appointment Detail</div>
                <div className="grid grid-cols-2 gap-12">
                  <div className="bg-blue-200 p-2 rounded text-center">Schedule Appointment</div>
                  <div className="bg-gray-800 text-white p-2 rounded text-center">Reminders</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="decision" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Stage 7: Decision & Outcome</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="bg-green-200 p-2 rounded text-center mb-6">Case Review</div>
                <div className="bg-green-200 p-2 rounded text-center mb-6">Decision Making</div>
                <div className="bg-gray-800 text-white p-2 rounded text-center mb-6">Decision Notification</div>
                <div className="bg-blue-200 p-2 rounded text-center">Appeals/Next Steps</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => {
              const stages = ["onboarding", "dashboard", "cases", "documents", "communication", "appointments", "decision"];
              const currentIndex = stages.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(stages[currentIndex - 1]);
              }
            }}
            disabled={activeTab === "onboarding"}
          >
            Previous Stage
          </Button>
          <Button 
            onClick={() => {
              const stages = ["onboarding", "dashboard", "cases", "documents", "communication", "appointments", "decision"];
              const currentIndex = stages.indexOf(activeTab);
              if (currentIndex < stages.length - 1) {
                setActiveTab(stages[currentIndex + 1]);
              } else {
                onOpenChange(false);
              }
            }}
          >
            {activeTab === "decision" ? "Close" : "Next Stage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
