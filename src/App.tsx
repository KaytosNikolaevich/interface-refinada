import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader from "@/components/PageLoader";
import useAuthSession from "@/hooks/useAuthSession";

const Welcome = React.lazy(() => import("./pages/Welcome"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Modules = React.lazy(() => import("./pages/Modules"));
const LessonPage = React.lazy(() => import("./pages/LessonPage"));
const ExercisePage = React.lazy(() => import("./pages/ExercisePage"));
const Progress = React.lazy(() => import("./pages/Progress"));
const ProgressMapPage = React.lazy(() => import("./pages/ProgressMapPage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));
const StoriesPage = React.lazy(() => import("./pages/StoriesPage"));
const VoicePracticePage = React.lazy(() => import("./pages/VoicePracticePage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  useAuthSession();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthBootstrap>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/lesson/:moduleId" element={<LessonPage />} />
              <Route path="/exercise/:moduleId" element={<ExercisePage />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/progress-map" element={<ProgressMapPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/voice-practice" element={<VoicePracticePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
    </AuthBootstrap>
  </QueryClientProvider>
);

export default App;
