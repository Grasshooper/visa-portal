import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase, safeQuery } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Search,
  UserCheck,
  UserX,
  RefreshCw,
  Shield,
  Filter,
  Download,
  Trash,
  Mail,
  Key,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type UserData = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  confirmed_at: string | null;
  banned_until: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
    role: "applicant" | "representative" | "admin";
    is_organization_admin: boolean | null;
    organization_id: string | null;
  };
};

export default function UserAccessControl() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (profile && !profile.is_organization_admin) {
      navigate("/dashboard");
    }
  }, [profile, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        // Get all profiles first
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*");

        if (profilesError) throw profilesError;

        // Call the backend endpoint to get users
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const { users: authUsers } = await response.json();

        if (!authUsers) {
          setUsers([]);
          setFilteredUsers([]);
          return;
        }

        // Join the data
        const usersWithProfiles = authUsers.map((user) => {
          const userProfile = profiles.find((p) => p.id === user.id) || {
            first_name: null,
            last_name: null,
            role: "applicant",
            is_organization_admin: false,
            organization_id: null,
          };

          return {
            id: user.id,
            email: user.email || "",
            last_sign_in_at: user.last_sign_in_at,
            created_at: user.created_at,
            confirmed_at: user.confirmed_at,
            banned_until: user.banned_until,
            profile: {
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              role: userProfile.role,
              is_organization_admin: userProfile.is_organization_admin,
              organization_id: userProfile.organization_id,
            },
          };
        });

        setUsers(usersWithProfiles);
        setFilteredUsers(usersWithProfiles);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error fetching users",
          description:
            "There was a problem fetching user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Filter users based on search query and tab
  useEffect(() => {
    let result = users;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.profile.first_name?.toLowerCase().includes(query) ||
          user.profile.last_name?.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    if (selectedTab === "admin") {
      result = result.filter((user) => user.profile.is_organization_admin);
    } else if (selectedTab === "representative") {
      result = result.filter(
        (user) =>
          user.profile.role === "representative" &&
          !user.profile.is_organization_admin
      );
    } else if (selectedTab === "applicant") {
      result = result.filter((user) => user.profile.role === "applicant");
    } else if (selectedTab === "banned") {
      result = result.filter(
        (user) =>
          user.banned_until !== null && new Date(user.banned_until) > new Date()
      );
    }

    setFilteredUsers(result);
  }, [users, searchQuery, selectedTab]);

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      setIsProcessing(true);
      setResetEmail(selectedUser.email);

      const { error } = await supabase.auth.admin.updateUserById(
        selectedUser.id,
        {
          app_metadata: { password_reset: true },
        }
      );

      if (error) throw error;

      toast({
        title: "Password reset link sent",
        description: `A password reset link has been sent to ${selectedUser.email}`,
      });

      setIsResetPasswordOpen(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error resetting password",
        description: "There was a problem sending the password reset link.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleUserBan = async (user: UserData) => {
    try {
      setIsProcessing(true);

      if (user.banned_until) {
        // Unban user
        const { error } = await supabase.auth.admin.updateUserById(user.id, {
          app_metadata: { banned_until: null },
        });

        if (error) throw error;

        // Update local state
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, banned_until: null } : u))
        );

        toast({
          title: "User unbanned",
          description: `${user.email} has been unbanned and can now access the system.`,
        });
      } else {
        // Ban user
        const banUntil = new Date();
        banUntil.setFullYear(banUntil.getFullYear() + 10); // Ban for 10 years
        const { error } = await supabase.auth.admin.updateUserById(user.id, {
          app_metadata: { banned_until: banUntil.toISOString() },
        });

        if (error) throw error;

        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, banned_until: banUntil.toISOString() }
              : u
          )
        );

        toast({
          title: "User banned",
          description: `${user.email} has been banned and can no longer access the system.`,
        });
      }
    } catch (error) {
      console.error("Error toggling user ban:", error);
      toast({
        title: "Action failed",
        description: "There was a problem updating the user status.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateUserRole = async (
    user: UserData,
    newRole: "applicant" | "representative" | "admin",
    isAdmin: boolean
  ) => {
    try {
      setIsProcessing(true);

      // Update the profile
      const { error } = await supabase
        .from("profiles")
        .update({
          role: newRole,
          is_organization_admin: isAdmin,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                profile: {
                  ...u.profile,
                  role: newRole,
                  is_organization_admin: isAdmin,
                },
              }
            : u
        )
      );

      toast({
        title: "User role updated",
        description: `${user.email}'s role has been updated to ${newRole}${
          isAdmin ? " with admin privileges" : ""
        }.`,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Role update failed",
        description: "There was a problem updating the user role.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportUserData = () => {
    try {
      const dataStr = JSON.stringify(filteredUsers, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `user-export-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Export complete",
        description: `Exported ${filteredUsers.length} user records.`,
      });
    } catch (error) {
      console.error("Error exporting user data:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting the user data.",
        variant: "destructive",
      });
    }
  };

  const refreshUserList = async () => {
    setIsLoading(true);
    try {
      // Call the backend endpoint to get users
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const { users: authUsers } = await response.json();

      if (!authUsers) {
        setUsers([]);
        setFilteredUsers([]);
        return;
      }

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      // Join the data
      const usersWithProfiles = authUsers.map((user) => {
        const userProfile = profiles.find((p) => p.id === user.id) || {
          first_name: null,
          last_name: null,
          role: "applicant",
          is_organization_admin: false,
          organization_id: null,
        };

        return {
          id: user.id,
          email: user.email || "",
          last_sign_in_at: user.last_sign_in_at,
          created_at: user.created_at,
          confirmed_at: user.confirmed_at,
          banned_until: user.banned_until,
          profile: {
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            role: userProfile.role,
            is_organization_admin: userProfile.is_organization_admin,
            organization_id: userProfile.organization_id,
          },
        };
      });

      setUsers(usersWithProfiles);
      setFilteredUsers(usersWithProfiles);

      toast({
        title: "User list refreshed",
        description: `Loaded ${usersWithProfiles.length} user records.`,
      });
    } catch (error) {
      console.error("Error refreshing users:", error);
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing the user data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserStatusBadge = (user: UserData) => {
    if (user.banned_until && new Date(user.banned_until) > new Date()) {
      return <Badge variant="destructive">Banned</Badge>;
    }
    if (!user.confirmed_at) {
      return <Badge variant="outline">Unconfirmed</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  const getUserRoleBadge = (user: UserData) => {
    if (user.profile.is_organization_admin) {
      return <Badge variant="default">Admin</Badge>;
    }
    if (user.profile.role === "representative") {
      return <Badge variant="secondary">Representative</Badge>;
    }
    return <Badge variant="outline">Applicant</Badge>;
  };

  return (
    <AdminLayout title="User Access Control">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-muted-foreground">
              Manage user access, roles, and permissions
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              onClick={refreshUserList}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={exportUserData}
              disabled={isLoading || filteredUsers.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="representative">Representatives</TabsTrigger>
              <TabsTrigger value="applicant">Applicants</TabsTrigger>
              <TabsTrigger value="banned">Banned</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.profile.first_name} {user.profile.last_name}
                        </div>
                      </TableCell>
                      <TableCell>{getUserStatusBadge(user)}</TableCell>
                      <TableCell>{getUserRoleBadge(user)}</TableCell>
                      <TableCell>
                        {user.created_at
                          ? format(new Date(user.created_at), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {user.last_sign_in_at
                          ? format(
                              new Date(user.last_sign_in_at),
                              "MMM d, yyyy"
                            )
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(user)}
                            >
                              <Search className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsResetPasswordOpen(true);
                              }}
                            >
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleUserBan(user)}
                            >
                              {user.banned_until &&
                              new Date(user.banned_until) > new Date() ? (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Unban User
                                </>
                              ) : (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Ban User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                updateUserRole(user, "admin", true)
                              }
                              disabled={
                                user.profile.role === "admin" &&
                                user.profile.is_organization_admin
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateUserRole(user, "representative", false)
                              }
                              disabled={
                                user.profile.role === "representative" &&
                                !user.profile.is_organization_admin
                              }
                            >
                              Make Representative
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateUserRole(user, "applicant", false)
                              }
                              disabled={
                                user.profile.role === "applicant" &&
                                !user.profile.is_organization_admin
                              }
                            >
                              Make Applicant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email
                </h3>
                <p className="text-base">{selectedUser.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="text-base">
                  {selectedUser.profile.first_name || "Not provided"}{" "}
                  {selectedUser.profile.last_name || ""}
                </p>
              </div>

              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <div className="text-base mt-1">
                    {getUserStatusBadge(selectedUser)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Role
                  </h3>
                  <div className="text-base mt-1">
                    {getUserRoleBadge(selectedUser)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Created
                  </h3>
                  <p className="text-base">
                    {selectedUser.created_at
                      ? format(new Date(selectedUser.created_at), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Last Login
                  </h3>
                  <p className="text-base">
                    {selectedUser.last_sign_in_at
                      ? format(
                          new Date(selectedUser.last_sign_in_at),
                          "MMM d, yyyy"
                        )
                      : "Never"}
                  </p>
                </div>
              </div>

              {selectedUser.banned_until &&
                new Date(selectedUser.banned_until) > new Date() && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Banned Until
                    </h3>
                    <p className="text-base">
                      {format(
                        new Date(selectedUser.banned_until),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                )}

              <Separator />

              <div className="flex justify-between space-x-4">
                <Button
                  variant="outline"
                  onClick={() => toggleUserBan(selectedUser)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {selectedUser.banned_until &&
                  new Date(selectedUser.banned_until) > new Date() ? (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Unban User
                    </>
                  ) : (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Ban User
                    </>
                  )}
                </Button>

                <Button
                  variant="default"
                  onClick={() => {
                    setIsResetPasswordOpen(true);
                    setIsUserDetailOpen(false);
                  }}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              This will send a password reset link to the user's email address.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <p>
                Send password reset link to:{" "}
                <strong>{selectedUser.email}</strong>
              </p>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsResetPasswordOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>

                <Button onClick={handleResetPassword} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
