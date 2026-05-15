import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { useEffect, useState, lazy, Suspense } from "react";
import { loadSeedData, reloadAllData } from "@/lib/seed-data";
import { db, getDataVersion, setDataVersion } from "@/lib/db";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Onboarding, useOnboarding } from "@/components/Onboarding";
import { useAchievementChecker } from "@/hooks/use-achievements";
import { Loader2 } from "lucide-react";

// Current data version - increment when seed data changes
const DATA_VERSION = "v2.2";

// Lazy loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const PokemonPage = lazy(() => import("./pages/Pokemon"));
const PokemonDetails = lazy(() => import("./pages/PokemonDetails"));
const MovesPage = lazy(() => import("./pages/Moves"));
const MoveDetails = lazy(() => import("./pages/MoveDetails"));
const ItemsPage = lazy(() => import("./pages/Items"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const RecipesPage = lazy(() => import("./pages/Recipes"));
const LocationsPage = lazy(() => import("./pages/Locations"));
const LocationDetails = lazy(() => import("./pages/LocationDetails"));
const RequestsPage = lazy(() => import("./pages/Requests"));
const RequestDetails = lazy(() => import("./pages/RequestDetails"));
const ComparePage = lazy(() => import("./pages/Compare"));
const SearchPage = lazy(() => import("./pages/Search"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const DataImportPage = lazy(() => import("./pages/DataImport"));
const MapPage = lazy(() => import("./pages/Map"));
const TeamBuilderPage = lazy(() => import("./pages/TeamBuilder"));
const DamageCalculatorPage = lazy(() => import("./pages/DamageCalculator"));
const BattleSimulatorPage = lazy(() => import("./pages/BattleSimulator"));
const OutbreaksPage = lazy(() => import("./pages/Outbreaks"));
const TypeChartPage = lazy(() => import("./pages/TypeChart"));
const FavoritesPage = lazy(() => import("./pages/Favorites"));
const TrackerPage = lazy(() => import("./pages/Tracker"));
const SaveImportPage = lazy(() => import("./pages/SaveImport"));
const InventoryPage = lazy(() => import("./pages/Inventory"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { OfflineIndicator } from "./components/OfflineIndicator";
import { UpdateAvailableBanner } from "./components/UpdateAvailableBanner";
import { AIChatButton } from "./components/AIChatButton";

const queryClient = new QueryClient();

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
}

// Main app content with onboarding
function AppContent() {
  const { showOnboarding, isChecking, completeOnboarding } = useOnboarding();
  
  // Achievement checker - will show toast notifications
  useAchievementChecker();

  if (isChecking) {
    return <PageLoader />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OfflineIndicator />
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/battle-simulator" element={<BattleSimulatorPage />} />
              <Route path="/outbreaks" element={<OutbreaksPage />} />
              <Route path="/type-chart" element={<TypeChartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/save-import" element={<SaveImportPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Navigation />
      <UpdateAvailableBanner />
      <AIChatButton />
    </div>
  );
}

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
