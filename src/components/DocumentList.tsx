
import { useState, useEffect } from "react";
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
        // Since we don't have the documents table anymore, we'll just simulate loading
        // and then set empty data or mock data as appropriate
        setTimeout(() => {
          setDocuments([]);
          setLoading(false);
        }, 500);
      } catch (error: any) {
        console.error("Error fetching documents:", error.message);
        setError("Failed to load documents");
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

  const handleViewDocument = async (documentItem: DocumentItem) => {
    try {
      setSelectedDocument(documentItem);
      
      toast({
        title: "Database restructuring in progress",
        description: "The document viewing functionality is temporarily disabled.",
      });
    } catch (error: any) {
      console.error("Error viewing document:", error.message);
      toast({
        title: "Error viewing document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = async (documentItem: DocumentItem) => {
    try {
      toast({
        title: "Database restructuring in progress",
        description: "The document download functionality is temporarily disabled.",
      });
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
      toast({
        title: "Database restructuring in progress",
        description: "The document deletion functionality is temporarily disabled.",
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

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Restructuring</AlertTitle>
            <AlertDescription>
              The document management functionality is currently disabled while the database is being restructured.
            </AlertDescription>
          </Alert>

          <div className="text-center py-8">
            <p className="text-muted-foreground">Document management will be available again soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
