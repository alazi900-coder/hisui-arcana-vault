import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";

// Pages
import Index from "./pages/Index";
import PokemonPage from "./pages/Pokemon";
import PokemonDetails from "./pages/PokemonDetails";
import MovesPage from "./pages/Moves";
import MoveDetails from "./pages/MoveDetails";
import ItemsPage from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import RecipesPage from "./pages/Recipes";
import LocationsPage from "./pages/Locations";
import LocationDetails from "./pages/LocationDetails";
import RequestsPage from "./pages/Requests";
import RequestDetails from "./pages/RequestDetails";
import ComparePage from "./pages/Compare";
import SettingsPage from "./pages/Settings";
import DataImportPage from "./pages/DataImport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Pokemon */}
                <Route path="/pokemon" element={<PokemonPage />} />
                <Route path="/pokemon/:id" element={<PokemonDetails />} />
                {/* Moves */}
                <Route path="/moves" element={<MovesPage />} />
                <Route path="/moves/:id" element={<MoveDetails />} />
                {/* Items */}
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/items/:id" element={<ItemDetails />} />
                {/* Recipes */}
                <Route path="/recipes" element={<RecipesPage />} />
                {/* Locations */}
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/locations/:id" element={<LocationDetails />} />
                {/* Requests */}
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/requests/:id" element={<RequestDetails />} />
                {/* Tools */}
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/data-import" element={<DataImportPage />} />
                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Navigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;