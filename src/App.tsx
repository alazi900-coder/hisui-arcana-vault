import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { useEffect, useState } from "react";
import { loadSeedData, reloadAllData } from "@/lib/seed-data";
import { db, getDataVersion, setDataVersion } from "@/lib/db";

// Current data version - increment when seed data changes
const DATA_VERSION = "v2.1";

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
import SearchPage from "./pages/Search";
import SettingsPage from "./pages/Settings";
import DataImportPage from "./pages/DataImport";
import MapPage from "./pages/Map";
import NotFound from "./pages/NotFound";
// New pages
import TeamBuilderPage from "./pages/TeamBuilder";
import DamageCalculatorPage from "./pages/DamageCalculator";
import TypeChartPage from "./pages/TypeChart";
import FavoritesPage from "./pages/Favorites";
import TrackerPage from "./pages/Tracker";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { AIChatButton } from "./components/AIChatButton";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data on first mount - works on any route
  useEffect(() => {
    const initializeData = async () => {
      try {
        const pokemonCount = await db.pokemon.count();
        const currentVersion = await getDataVersion();
        
        // If no data or outdated version, reload everything
        if (pokemonCount === 0) {
          console.log('No data found, loading seed data...');
          await loadSeedData();
          await setDataVersion(DATA_VERSION);
        } else if (currentVersion !== DATA_VERSION) {
          console.log(`Data version mismatch (${currentVersion} vs ${DATA_VERSION}), reloading...`);
          await reloadAllData();
          await setDataVersion(DATA_VERSION);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <OfflineIndicator />
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
                  {/* Map */}
                  <Route path="/map" element={<MapPage />} />
                  {/* Requests */}
                  <Route path="/requests" element={<RequestsPage />} />
                  <Route path="/requests/:id" element={<RequestDetails />} />
                  {/* Tools */}
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/data-import" element={<DataImportPage />} />
                  {/* New Features */}
                  <Route path="/team-builder" element={<TeamBuilderPage />} />
                  <Route path="/damage-calculator" element={<DamageCalculatorPage />} />
                  <Route path="/type-chart" element={<TypeChartPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/tracker" element={<TrackerPage />} />
                  {/* Settings */}
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Navigation />
              <AIChatButton />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;