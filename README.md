# Heritage Risk — Frontend (Member 4)

Frontend and dashboard module for **Predictive Analytics for Heritage Site Risk
and Conservation**. Built to run completely standalone on mock data, and to
accept every other team member's backend with zero UI changes once it's ready.

> This repository is **frontend only**. No backend, database, or ML services are
> included or required to run it — see [Mock Mode](#6-mock-mode) below.

---

## 1. Project overview

The app is a command-center dashboard for tracking deterioration risk across a
set of heritage sites, combining:

- **Environmental & structural risk** (Member 1 data, Member 6 predictions)
- **Interactive GIS map** (Member 2)
- **AI image deterioration analysis** (Member 3)
- **Conservation priority recommendations** (Member 5)

into eight pages: Home, Dashboard, Heritage Sites, Site Details, Risk Map,
Analytics, Conservation Priority, and Alerts.

---

## 2. Tech stack

- React 19 + Vite + TypeScript
- Tailwind CSS
- Recharts (charts)
- Leaflet + React Leaflet (map)
- Lucide React (icons)
- Axios (HTTP client)
- React Router

---

## 3. Installation

```bash
npm install
```

## 4. Running locally

```bash
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build locally
```

---

## 5. Environment variables

Copy the example file and adjust as needed:

```bash
cp .env.example .env
```

| Variable             | Default                     | Purpose                                              |
| --------------------- | ---------------------------- | ------------------------------------------------------ |
| `VITE_API_BASE_URL`   | `http://localhost:8000/api`  | Base URL for the backend REST API                      |
| `VITE_USE_MOCK_DATA`  | `true`                       | `true` = use built-in mocks, `false` = call the API     |

No secrets, API keys, or credentials belong in this project — only this public,
non-sensitive base URL.

---

## 6. Mock mode

With `VITE_USE_MOCK_DATA=true` (the default), every service in `src/services/`
returns realistic, deterministic mock data from `src/mocks/` instead of making
network calls. This means:

- The app is fully explorable — dashboard, map, site details, image analysis,
  conservation recommendations, analytics, alerts — with **zero backend**.
- Mock data covers 10 real Indian heritage sites with varied risk levels.
  Risk scores, environmental values, and predictions are clearly **illustrative
  placeholders**, not real assessments.
- Data is seeded (see `src/mocks/seed.ts`) so it stays stable across reloads
  instead of re-randomizing on every render.

---

## 7. Folder structure

```
src/
  components/
    layout/         Sidebar, Topbar, AppShell
    dashboard/       Dashboard-only charts (risk distribution, trend, top-risk table)
    sites/           Site explorer + site detail components (cards, filters, risk breakdown...)
    map/             HeritageMap.tsx (isolated GIS component) + legend
    analytics/       (reserved for analytics-specific components)
    conservation/    RecommendationCard, priority UI
    alerts/          AlertCard
    common/          RiskBadge, RiskScore, StatCard, ChartCard, Loading/Error/EmptyState
  pages/             One file per route: Home, Dashboard, Sites, SiteDetails, Map, Analytics, Conservation, Alerts
  services/          API abstraction layer — the ONLY place that calls the network
  hooks/             useSites, useRisk, useImageAnalysis, useConservation, useAnalytics, useAlerts
  types/             Shared TypeScript interfaces — the API contract in code form
  mocks/             Mock data generators, used only when VITE_USE_MOCK_DATA=true
  utils/             Formatting, dashboard aggregation, small helpers
```

---

## 8. API integration

All data flows in one direction:

```
Backend APIs → Service Layer (src/services) → Hooks (src/hooks) → Components → Pages
```

Components and pages **never** call `fetch`/`axios` directly and never contain a
hardcoded URL. Every request goes through a service function, e.g.:

```ts
siteService.getSites();
riskService.getRiskAssessment(siteId);
imageAnalysisService.getAnalysis(siteId);
conservationService.getRecommendation(siteId);
```

Each service checks `USE_MOCK_DATA` (from `src/services/apiClient.ts`) and either
returns mock data or calls `apiClient` (a preconfigured Axios instance using
`VITE_API_BASE_URL`). See **[API_CONTRACT.md](./API_CONTRACT.md)** for the full
endpoint-by-endpoint request/response spec every backend module should follow.

---

## 9. How Member 2 integrates GIS (Map)

All Leaflet/map logic lives in one isolated file:
**`src/components/map/HeritageMap.tsx`**

It takes a `sites: HeritageSite[]` prop and renders markers colored by risk
level, with a legend and popups. To integrate real spatial analytics:

- Extend `src/services/mapService.ts` with additional GIS-specific calls
  (geofences, terrain layers, spatial risk overlays), or
- Replace the internals of `HeritageMap.tsx` directly.

The `/map` page (`src/pages/Map.tsx`) only imports `<HeritageMap />` and never
touches Leaflet directly, so GIS work stays contained to that one component.

---

## 10. How Member 3 integrates image analysis

Implement `GET /api/sites/:id/image-analysis` returning the `ImageAnalysis`
shape documented in `API_CONTRACT.md`. Once `VITE_USE_MOCK_DATA=false`, the
**Image Analysis** section on the Site Details page (`ImageAnalysisSection.tsx`)
will automatically render your `crackSeverity`, `erosionSeverity`,
`discolorationSeverity`, `vegetationSeverity`, `overallVisualRisk`, and
`detectedIssues` — no frontend changes required.

---

## 11. How Member 5 integrates conservation intelligence

Implement:

- `GET /api/sites/:id/conservation` → single-site recommendation
- `GET /api/conservation` → recommendations for all sites (used by the
  Conservation Priority ranking table)

Both should return the `ConservationRecommendation` shape in `API_CONTRACT.md`,
including `priorityScore`, `priorityLevel`, `recommendations[]`,
`estimatedUrgency`, `interventionImpact`, and optional `rationale[]` (shown as
"Why this site is prioritized").

---

## 12. How Member 6 integrates prediction APIs

Implement `GET /api/sites/:id/risk` returning the `RiskAssessment` shape,
including the `predictionHorizon` array (1/3/5-year forecasts) used to draw the
"Predicted Deterioration" chart. The frontend only **visualizes** this data — it
does not run or assume any model logic itself.

---

## 13. How to switch from mock APIs to real APIs

1. Set `VITE_API_BASE_URL` to your backend's base URL.
2. Set `VITE_USE_MOCK_DATA=false`.
3. Restart the dev server (`npm run dev`) or rebuild (`npm run build`).

No component, page, or hook needs to change. If an endpoint's response shape
differs slightly from the contract, adjust the mapping inside the relevant file
in `src/services/` rather than touching UI code.

---

## Design notes

The visual language (dark "command-center" theme, sandstone/verdigris/ochre/rust
risk palette, Fraunces + IBM Plex typography, and the circular "weathering gauge"
`RiskScore` component) is intentional: it's meant to read as a scientific
conservation instrument rather than a generic admin template. See
`tailwind.config.js` for the full token set.
