import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/overview" component={Home} />
      <Route path="/gallery" component={Home} />
      <Route path="/updates" component={Home} />
      <Route path="/updates/:id" component={Home} />
      <Route path="/release" component={Home} />
      <Route path="/store" component={Home} />
      <Route path="/preorder" component={Home} />
      <Route path="/account" component={Home} />
      <Route path="/player" component={Home} />
      <Route path="/game-info" component={Home} />
      <Route path="/development" component={Home} />
      <Route path="/wheel" component={Home} />
      <Route path="/community" component={Home} />
      <Route path="/contact" component={Home} />
      <Route path="/admin" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
