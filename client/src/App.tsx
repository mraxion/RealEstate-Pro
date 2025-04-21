import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import PropertyDetail from "@/pages/property-detail";
import PropertyCreate from "@/pages/property-create";
import PropertyEdit from "@/pages/property-edit";
import Leads from "@/pages/leads";
import Appointments from "@/pages/appointments";
import Workflows from "@/pages/workflows";
import WorkflowIntegrations from "@/pages/workflow-integrations";
import MarketAnalysis from "@/pages/market-analysis";
import NotFound from "@/pages/not-found";
import Settings from "@/pages/settings";
import Login from "@/pages/login";

import { useAuth } from "@/context/auth-context";
import { useLocation } from "wouter";

function Router() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();

  // Permitir acceso libre solo a /login
  if (!user && location !== "/login") {
    navigate("/login");
    return null;
  }
  if (!user && location === "/login") {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/create" component={PropertyCreate} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/properties/:id/edit" component={PropertyEdit} />
      <Route path="/leads" component={Leads} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/integrations" component={WorkflowIntegrations} />
      <Route path="/market-analysis" component={MarketAnalysis} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { AuthProvider } from "@/context/auth-context";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
