import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { CompanyProvider } from "@/lib/company-context";
import NotFound from "@/pages/not-found";

import Splash from "@/pages/splash";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Analyze from "@/pages/analyze";
import Complaints from "@/pages/complaints";
import Customers from "@/pages/customers";
import CustomerDetail from "@/pages/customer-detail";
import Portal from "@/pages/portal";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/portal" component={Portal} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/chat" component={Chat} />
      <Route path="/analyze" component={Analyze} />
      <Route path="/complaints" component={Complaints} />
      <Route path="/customers" component={Customers} />
      <Route path="/customers/:customerId" component={CustomerDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <CompanyProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </CompanyProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
