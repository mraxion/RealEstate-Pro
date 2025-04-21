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
import NotFound from "@/pages/not-found";

function Router() {
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
