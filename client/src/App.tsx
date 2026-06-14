import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Store from "./pages/Store";
import Booking from "./pages/Booking";
import TeamPortal from "./pages/TeamPortal";

function Router() {
  return (
    <Switch>
      {/* Public Landing Page — main entry point */}
      <Route path={"/"} component={Landing} />

      {/* CRM Dashboard — owner/admin use */}
      <Route path={"/crm"} component={Home} />

      {/* Public-facing pages */}
      <Route path={"/store"} component={Store} />
      <Route path={"/book"} component={Booking} />
      <Route path={"/team"} component={TeamPortal} />

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <NotificationProvider>
          <PortfolioProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </PortfolioProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
