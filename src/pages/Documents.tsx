
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileArchive,
  FileImage,
  FilePdf,
  FileText,
  FileType,
  Filter,
  FolderOpen,
  Grid,
  Link2,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  SquareAsterisk,
  Trash2,
  Users,
} from "lucide-react";

type Document = {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  modified: string;
  status: string;
  owner: string;
  icon: any;
};

const documents: Document[] = [
  {
    id: "DOC-0012",
    name: "Wilson_Passport.pdf",
    type: "PDF",
    category: "Identity",
    size: "3.2 MB",
    modified: "Aug 5, 2023",
    status: "Valid",
    owner: "Emma Wilson",
    icon: FilePdf,
  },
  {
    id: "DOC-0011",
    name: "Johnson_Visa_Application.pdf",
    type: "PDF",
    category: "Application",
    size: "5.8 MB",
    modified: "Aug 2, 2023",
    status: "Pending",
    owner: "Alex Johnson",
    icon: FilePdf,
  },
  {
    id: "DOC-0010",
    name: "Patel_Birth_Certificate.jpg",
    type: "Image",
    category: "Identity",
    size: "1.7 MB",
    modified: "Jul 30, 2023",
    status: "Valid",
    owner: "Maya Patel",
    icon: FileImage,
  },
  {
    id: "DOC-0009",
    name: "Kim_Supporting_Documents.zip",
    type: "Archive",
    category: "Supporting",
    size: "12.5 MB",
    modified: "Jul 28, 2023",
    status: "Complete",
    owner: "Daniel Kim",
    icon: FileArchive,
  },
  {
    id: "DOC-0008",
    name: "Martinez_Financial_Statements.pdf",
    type: "PDF",
    category: "Financial",
    size: "2.9 MB",
    modified: "Jul 25, 2023",
    status: "Pending",
    owner: "Olivia Martinez",
    icon: FilePdf,
  },
  {
    id: "DOC-0007",
    name: "Wilson_Employment_Letter.pdf",
    type: "PDF",
    category: "Employment",
    size: "830 KB",
    modified: "Jul 20, 2023",
    status: "Valid",
    owner: "James Wilson",
    icon: FileText,
  },
  {
    id: "DOC-0006",
    name: "Lee_Academic_Transcripts.pdf",
    type: "PDF",
    category: "Education",
    size: "4.1 MB",
    modified: "Jul 15, 2023",
    status: "Valid",
    owner: "Sophia Lee",
    icon: FileText,
  },
  {
    id: "DOC-0005",
    name: "Brown_Medical_Records.pdf",
    type: "PDF",
    category: "Medical",
    size: "7.3 MB",
    modified: "Jul 10, 2023",
    status: "Expired",
    owner: "Ethan Brown",
    icon: FilePdf,
  },
];

const getDocumentStatusColor = (status: string) => {
  switch (status) {
    case "Valid":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Complete":
      return "bg-blue-100 text-blue-800";
    case "Expired":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Identity":
      return "bg-purple-100 text-purple-800";
    case "Application":
      return "bg-blue-100 text-blue-800";
    case "Supporting":
      return "bg-teal-100 text-teal-800";
    case "Financial":
      return "bg-emerald-100 text-emerald-800";
    case "Employment":
      return "bg-orange-100 text-orange-800";
    case "Education":
      return "bg-indigo-100 text-indigo-800";
    case "Medical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Documents = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <DashboardLayout title="Document Management">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Manage, organize, and track all immigration documents.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Folder</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Upload</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="recent">Recently Modified</TabsTrigger>
              <TabsTrigger value="shared">Shared with Me</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <FileText className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
            </div>
          </div>
          <TabsContent value="all" className="space-y-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search documents..."
                        className="w-full rounded-md pl-8"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1"
                        >
                          <Filter className="h-3.5 w-3.5" />
                          <span>Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem>All Documents</DropdownMenuItem>
                        <DropdownMenuItem>PDF Documents</DropdownMenuItem>
                        <DropdownMenuItem>Images</DropdownMenuItem>
                        <DropdownMenuItem>Archives</DropdownMenuItem>
                        <DropdownMenuItem>Valid Documents</DropdownMenuItem>
                        <DropdownMenuItem>Expired Documents</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>

              {viewMode === "list" ? (
                <div className="rounded-md border shadow-sm">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                          Owner
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                          Size
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                          Modified
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr
                          key={doc.id}
                          className="border-b group transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <doc.icon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {doc.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant="outline"
                              className={getCategoryColor(doc.category)}
                            >
                              {doc.category}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant="outline"
                              className={getDocumentStatusColor(doc.status)}
                            >
                              {doc.status}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">{doc.owner}</td>
                          <td className="p-4 align-middle">{doc.size}</td>
                          <td className="p-4 align-middle">{doc.modified}</td>
                          <td className="p-4 align-middle">
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
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link2 className="mr-2 h-4 w-4" />
                                  <span>Copy Link</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>Make a copy</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                  {documents.map((doc) => (
                    <Card
                      key={doc.id}
                      className="group overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="p-2 bg-muted/30 flex justify-between">
                        <Badge
                          variant="outline"
                          className={getDocumentStatusColor(doc.status)}
                        >
                          {doc.status}
                        </Badge>
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
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link2 className="mr-2 h-4 w-4" />
                              <span>Copy Link</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Make a copy</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardContent className="p-4 pt-5 flex flex-col items-center text-center">
                        <div className="mb-3 w-16 h-16 flex items-center justify-center bg-primary/10 rounded-lg">
                          <doc.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">
                          {doc.name}
                        </h3>
                        <div className="text-xs text-muted-foreground mb-2">
                          {doc.size} • {doc.modified}
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getCategoryColor(
                            doc.category
                          )} mt-1`}
                        >
                          {doc.category}
                        </Badge>
                      </CardContent>
                      <div className="px-4 py-2 border-t flex justify-between items-center bg-muted/20">
                        <div className="text-xs text-muted-foreground">
                          {doc.owner}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="recent">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recently Modified Documents</CardTitle>
                <CardDescription>
                  Documents that have been modified in the last 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recently modified documents content goes here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shared">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Shared With Me</CardTitle>
                <CardDescription>
                  Documents that other users have shared with you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shared documents content goes here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="archived">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Archived Documents</CardTitle>
                <CardDescription>
                  Documents that have been archived for reference.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Archived documents content goes here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
