
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, 
  Eye, 
  FileIcon, 
  Search, 
  Trash2,
  RotateCw,
  Calendar,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Rename this to avoid conflict with DOM Document
interface DocumentItem {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
  status: string;
  version: number;
  expires_at: string | null;
  document_type: {
    id: string;
    name: string;
    category: string;
  };
}

export function DocumentList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("documents")
          .select(`
            *,
            document_type:document_type_id (
              id, 
              name, 
              category
            )
          `)
          .eq("user_id", user.id)
          .order("uploaded_at", { ascending: false });

        if (error) throw error;

        setDocuments(data || []);
      } catch (error: any) {
        console.error("Error fetching documents:", error.message);
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const filteredDocuments = documents.filter((doc) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doc.file_name.toLowerCase().includes(searchLower) ||
      doc.document_type.name.toLowerCase().includes(searchLower) ||
      doc.document_type.category.toLowerCase().includes(searchLower) ||
      doc.status.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDocument = async (document: DocumentItem) => {
    try {
      setSelectedDocument(document);
      
      // Get signedURL for viewing the document
      const { data, error } = await supabase.storage
        .from("case_documents")
        .createSignedUrl(document.file_path, 60); // 60 seconds expiry
        
      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Error viewing document:", error.message);
      toast({
        title: "Error viewing document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = async (document: DocumentItem) => {
    try {
      // Get signedURL for downloading the document
      const { data, error } = await supabase.storage
        .from("case_documents")
        .createSignedUrl(document.file_path, 60); // 60 seconds expiry
        
      if (error) throw error;
      
      if (data?.signedUrl) {
        // Create an anchor element and trigger download
        const a = document.createElement("a") as HTMLAnchorElement;
        a.href = data.signedUrl;
        a.download = document.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error: any) {
      console.error("Error downloading document:", error.message);
      toast({
        title: "Error downloading document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirmDelete) {
      setDeletingId(id);
      setConfirmDelete(true);
      return;
    }
    
    try {
      // First get the document to get the file path
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", id)
        .single();
        
      if (docError) throw docError;
      
      if (!docData) {
        throw new Error("Document not found");
      }
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("case_documents")
        .remove([docData.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete record from the database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);
        
      if (dbError) throw dbError;
      
      // Update local state
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting document:", error.message);
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setConfirmDelete(false);
      setDeletingId(null);
    }
  };

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>
          View and manage all your uploaded documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              {searchQuery ? (
                <div>
                  <p className="text-muted-foreground">No documents match your search query</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">You haven't uploaded any documents yet</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-primary" />
                          <span className="font-medium truncate" title={doc.file_name}>
                            {doc.file_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({formatFileSize(doc.file_size)})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {doc.document_type.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {doc.document_type.category}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={getStatusColor(doc.status)}
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1" title={format(new Date(doc.uploaded_at), 'PPpp')}>
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(doc.uploaded_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDocument(doc)}
                            title="View document"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadDocument(doc)}
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Dialog open={deletingId === doc.id && confirmDelete} onOpenChange={() => {
                            if (deletingId === doc.id) {
                              setConfirmDelete(false);
                              setDeletingId(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteDocument(doc.id)}
                                title="Delete document"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this document? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex space-x-2 justify-end">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
