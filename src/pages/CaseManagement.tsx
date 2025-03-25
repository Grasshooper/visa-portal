
import { useEffect, useState } from "react";
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
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCases } from "@/hooks/useCases";
import { format } from "date-fns";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "document review":
      return "bg-purple-100 text-purple-800";
    case "interview scheduled":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "on hold":
      return "bg-red-100 text-red-800";
    case "rejected":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CaseManagement = () => {
  const { cases, isLoading, fetchCases, deleteCase } = useCases();
  const [filteredCases, setFilteredCases] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCases();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = cases;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.case_number?.toLowerCase().includes(query) ||
          item.applicant_id?.first_name?.toLowerCase().includes(query) ||
          item.applicant_id?.last_name?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredCases(result);
  }, [cases, searchQuery, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === statusFilter ? "" : status);
    setCurrentPage(1);
  };

  const handleDeleteCase = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this case?");
    if (confirmed) {
      await deleteCase(id);
      fetchCases();
    }
  };

  const exportCases = () => {
    // Convert cases to CSV
    const headers = ["Case ID", "Client", "Type", "Stage", "Status", "Priority", "Due Date"];
    const csvContent = [
      headers.join(","),
      ...filteredCases.map(c => [
        c.case_number || c.id,
        `${c.applicant_id?.first_name || ""} ${c.applicant_id?.last_name || ""}`,
        c.case_type || "",
        "",
        c.status || "",
        c.priority || "",
        c.target_date ? format(new Date(c.target_date), "MMM dd, yyyy") : "",
      ].join(","))
    ].join("\n");

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `cases-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1"
              onClick={exportCases}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="h-8 gap-1" asChild>
              <Link to="/cases/new">
                <Plus className="h-3.5 w-3.5" />
                <span>New Case</span>
              </Link>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    <DropdownMenuItem onClick={() => handleStatusFilter("")}>
                      All Cases
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("in progress")}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("approved")}>
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("rejected")}>
                      Rejected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("on hold")}>
                      On Hold
                    </DropdownMenuItem>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Representative</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Loading cases...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="text-muted-foreground">
                        No cases found. {searchQuery || statusFilter ? "Try adjusting your filters." : ""}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCases.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell className="font-medium">
                        {item.case_number || item.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        {item.applicant_id ? (
                          `${item.applicant_id.first_name || ""} ${item.applicant_id.last_name || ""}`
                        ) : (
                          "Unassigned"
                        )}
                      </TableCell>
                      <TableCell>{item.case_type}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(item.status)}
                        >
                          {item.status || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(item.priority)}
                        >
                          {item.priority || "Medium"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.target_date 
                          ? format(new Date(item.target_date), "MMM dd, yyyy") 
                          : "Not set"}
                      </TableCell>
                      <TableCell>
                        {item.representative_id ? (
                          `${item.representative_id.first_name || ""} ${item.representative_id.last_name || ""}`
                        ) : (
                          "Unassigned"
                        )}
                      </TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link to={`/cases/${item.id}`}>View details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/cases/${item.id}/edit`}>Edit case</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Assign user</DropdownMenuItem>
                            <DropdownMenuItem>Change status</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCase(item.id)}
                            >
                              Delete case
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredCases.length > 0 && (
            <div className="flex items-center justify-between px-4 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCases.length)}</strong> of <strong>{filteredCases.length}</strong> cases
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    <span>{i + 1}</span>
                    <span className="sr-only">Page {i + 1}</span>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CaseManagement;
