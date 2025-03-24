// src/App.tsx
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

// Eager loading for critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Lazy loading for authenticated pages to reduce initial bundle size
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CaseManagement = lazy(() => import("./pages/CaseManagement"));
const Documents = lazy(() => import("./pages/Documents"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const CreateCase = lazy(() => import("./pages/CreateCase"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Loading component for lazy-loaded routes
const LazyLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);

// Update this part in App.tsx

// Protected route component with improved loading states
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Show loading state for maximum of 2 seconds to prevent infinite loading
  const [showingLoader, setShowingLoader] = useState(true);

  useEffect(() => {
    // If loading takes too long, hide the loader anyway after 2 seconds
    const timer = setTimeout(() => {
      setShowingLoader(false);
    }, 2000);

    // If auth state is determined, immediately hide loader
    if (!loading) {
      setShowingLoader(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  // If user is null and loading is complete, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Show minimal loading state for a reasonable duration
  if (showingLoader) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-sm text-muted-foreground">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  // If loading completed or timed out, but we have a user, show the protected content
  return <Suspense fallback={<LazyLoadingFallback />}>{children}</Suspense>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/about"
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <Contact />
                  </Suspense>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases"
                element={
                  <ProtectedRoute>
                    <CaseManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases/new"
                element={
                  <ProtectedRoute>
                    <CreateCase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
