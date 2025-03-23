
import { DashboardLayout } from "@/components/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const cases = [
  {
    id: "CS-1024",
    client: "Emma Wilson",
    type: "Work Visa",
    stage: "Interview Preparation",
    status: "In Progress",
    priority: "High",
    dueDate: "Aug 15, 2023",
    assignee: "Sarah Kim",
  },
  {
    id: "CS-1023",
    client: "Alex Johnson",
    type: "Student Visa",
    stage: "Document Collection",
    status: "Document Review",
    priority: "Medium",
    dueDate: "Aug 22, 2023",
    assignee: "John Davis",
  },
  {
    id: "CS-1022",
    client: "Maya Patel",
    type: "Family Visa",
    stage: "Interview",
    status: "Interview Scheduled",
    priority: "High",
    dueDate: "Aug 10, 2023",
    assignee: "Sarah Kim",
  },
  {
    id: "CS-1021",
    client: "Daniel Kim",
    type: "Permanent Residency",
    stage: "Background Check",
    status: "Pending",
    priority: "Medium",
    dueDate: "Sep 5, 2023",
    assignee: "Michael Chen",
  },
  {
    id: "CS-1020",
    client: "Olivia Martinez",
    type: "Citizenship",
    stage: "Application Review",
    status: "Pending",
    priority: "Low",
    dueDate: "Sep 15, 2023",
    assignee: "John Davis",
  },
  {
    id: "CS-1019",
    client: "James Wilson",
    type: "Work Visa",
    stage: "Decision",
    status: "Approved",
    priority: "High",
    dueDate: "Aug 5, 2023",
    assignee: "Sarah Kim",
  },
  {
    id: "CS-1018",
    client: "Sophia Lee",
    type: "Student Visa",
    stage: "Document Collection",
    status: "On Hold",
    priority: "Medium",
    dueDate: "Aug 30, 2023",
    assignee: "Michael Chen",
  },
  {
    id: "CS-1017",
    client: "Ethan Brown",
    type: "Family Visa",
    stage: "Initial Review",
    status: "In Progress",
    priority: "Low",
    dueDate: "Sep 20, 2023",
    assignee: "John Davis",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Document Review":
      return "bg-purple-100 text-purple-800";
    case "Interview Scheduled":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-emerald-100 text-emerald-800";
    case "On Hold":
      return "bg-red-100 text-red-800";
    case "Rejected":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CaseManagement = () => {
  return (
    <DashboardLayout title="Case Management">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
            <p className="text-muted-foreground">
              Manage and track all immigration cases.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>New Case</span>
            </Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search cases..."
                    className="w-full rounded-md pl-8"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem>All Cases</DropdownMenuItem>
                    <DropdownMenuItem>High Priority</DropdownMenuItem>
                    <DropdownMenuItem>In Progress</DropdownMenuItem>
                    <DropdownMenuItem>Pending Review</DropdownMenuItem>
                    <DropdownMenuItem>Approved</DropdownMenuItem>
                    <DropdownMenuItem>Rejected</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 px-0"
                  title="Advanced filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Advanced filters</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Case ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.client}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.stage}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(item.priority)}
                      >
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>{item.assignee}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit case</DropdownMenuItem>
                          <DropdownMenuItem>Assign user</DropdownMenuItem>
                          <DropdownMenuItem>Change status</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete case
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-8</strong> of <strong>24</strong> cases
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-primary text-primary-foreground"
              >
                <span>1</span>
                <span className="sr-only">Page 1</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <span>2</span>
                <span className="sr-only">Page 2</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <span>3</span>
                <span className="sr-only">Page 3</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CaseManagement;
