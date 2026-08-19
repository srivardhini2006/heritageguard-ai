import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import LoadingState from "./components/common/LoadingState";

// Route-level code splitting keeps the initial bundle lean — the Leaflet
// map bundle in particular only loads when someone visits /map.
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Sites = lazy(() => import("./pages/Sites"));
const SiteDetails = lazy(() => import("./pages/SiteDetails"));
const MapPage = lazy(() => import("./pages/Map"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Conservation = lazy(() => import("./pages/Conservation"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Settings = lazy(() => import("./pages/Settings"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState label="Loading…" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/sites/:siteId" element={<SiteDetails />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/conservation" element={<Conservation />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
