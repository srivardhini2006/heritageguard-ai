# API Contract

This document defines the JSON contract between the **Member 4 frontend** and every
backend service (Members 1, 2, 3, 5, 6). The frontend currently runs entirely on
mock data (see `src/mocks/`) that conforms exactly to these shapes. Once a real
endpoint is ready, point `VITE_API_BASE_URL` at it, set `VITE_USE_MOCK_DATA=false`,
and — as long as the response matches the contract below — no UI code changes.

All endpoints are relative to `VITE_API_BASE_URL` (default `http://localhost:8000/api`).

All types referenced here are defined in `src/types/index.ts` as the single source
of truth. Fields marked **optional** may be omitted; the UI degrades gracefully
(shows an empty/placeholder state) when they are.

---

## Common error shape

Any endpoint may fail. The service layer expects errors as a non-2xx HTTP status
with an optional JSON body:

```json
{
  "message": "Human-readable error description"
}
```

If no body is present, a generic error message is shown to the user.

---

## `GET /api/sites`

Returns all heritage sites.

**Response `200`** — `HeritageSite[]`

```json
[
  {
    "id": "site-brihadisvara",
    "name": "Brihadisvara Temple",
    "location": "Thanjavur, Tamil Nadu",
    "state": "Tamil Nadu",
    "country": "India",
    "latitude": 10.7828,
    "longitude": 79.1318,
    "heritageType": "Temple",
    "yearEstablished": 1010,
    "currentRiskLevel": "MEDIUM",
    "riskScore": 54,
    "lastAssessment": "2026-06-12",
    "imageUrl": "https://example.com/brihadisvara.jpg",
    "description": "Grand Chola-era granite temple...",
    "unescoListed": true,
    "annualVisitors": 1450000
  }
]
```

**Required fields:** `id`, `name`, `location`, `state`, `country`, `latitude`,
`longitude`, `heritageType`, `yearEstablished`, `currentRiskLevel`, `riskScore`,
`lastAssessment`.
**Optional fields:** `imageUrl`, `description`, `unescoListed`, `annualVisitors`.

`currentRiskLevel` must be one of `LOW | MEDIUM | HIGH | CRITICAL`.
`heritageType` should be one of `Temple | Fort | Monument | Rock-Cut Architecture |
Stupa | Palace | Archaeological Site | Mausoleum` (the UI renders any string, but
filters are built from this set).

---

## `GET /api/sites/:id`

Returns a single heritage site.

**Response `200`** — `HeritageSite` (same shape as above)
**Response `404`** — site not found → UI shows "Site not found" empty state.

---

## `GET /api/sites/:id/risk`

Owned by **Member 6** (Predictive Analytics & Backend). Returns the current risk
assessment and forecast for a site.

**Response `200`** — `RiskAssessment`

```json
{
  "siteId": "site-mahabalipuram",
  "riskScore": 76,
  "riskLevel": "HIGH",
  "confidence": 0.91,
  "assessedAt": "2026-07-02",
  "environmentalRisk": 78,
  "structuralRisk": 65,
  "visitorRisk": 54,
  "pollutionRisk": 60,
  "climateRisk": 72,
  "majorRiskFactors": [
    {
      "name": "Coastal salt exposure",
      "contribution": 82,
      "trend": "up",
      "description": "Sea-salt aerosol accelerating surface decay"
    }
  ],
  "predictionHorizon": [
    { "yearsAhead": 1, "predictedRiskScore": 80, "lowerBound": 75, "upperBound": 85 },
    { "yearsAhead": 3, "predictedRiskScore": 87, "lowerBound": 80, "upperBound": 92 },
    { "yearsAhead": 5, "predictedRiskScore": 93, "lowerBound": 85, "upperBound": 98 }
  ]
}
```

**Required fields:** `siteId`, `riskScore`, `riskLevel`, `confidence`,
`majorRiskFactors`, `predictionHorizon`, `environmentalRisk`, `structuralRisk`,
`visitorRisk`, `pollutionRisk`, `climateRisk`.
**Optional fields:** `assessedAt`, `majorRiskFactors[].trend`,
`majorRiskFactors[].description`, `predictionHorizon[].lowerBound/upperBound`.

`confidence` is a fraction between `0` and `1`. `riskScore` and all `*Risk` fields
are `0–100`. The frontend only visualizes `predictionHorizon` — it does **not**
run any prediction model itself.

---

## `GET /api/sites/:id/image-analysis`

Owned by **Member 3** (Computer Vision). Returns the latest deterioration
detection results for a site's imagery.

**Response `200`** — `ImageAnalysis`

```json
{
  "siteId": "site-ajanta",
  "imageId": "site-ajanta-img-01",
  "imageUrl": "https://example.com/ajanta-latest.jpg",
  "capturedAt": "2026-07-15",
  "detectedIssues": ["Cracking", "Erosion", "Discoloration"],
  "crackSeverity": 0.72,
  "erosionSeverity": 0.41,
  "discolorationSeverity": 0.55,
  "vegetationSeverity": 0.18,
  "overallVisualRisk": 0.47,
  "annotatedImageUrl": "https://example.com/ajanta-latest-annotated.jpg"
}
```

**Required fields:** `siteId`, `imageId`, `imageUrl`, `detectedIssues`,
`crackSeverity`, `erosionSeverity`, `discolorationSeverity`, `vegetationSeverity`,
`overallVisualRisk`.
**Optional fields:** `capturedAt`, `annotatedImageUrl`.

All `*Severity` and `overallVisualRisk` fields are fractions `0–1`. `detectedIssues`
values should come from: `Cracking | Erosion | Discoloration | Vegetation Growth |
Structural Displacement | Salt Efflorescence` (again, the UI renders any string).

---

## `GET /api/sites/:id/conservation`

Owned by **Member 5** (Conservation Intelligence). Returns the recommendation set
for a single site.

**Response `200`** — `ConservationRecommendation`

```json
{
  "siteId": "site-konark",
  "priorityScore": 91,
  "priorityLevel": "IMMEDIATE",
  "estimatedUrgency": "Within 3 months",
  "interventionImpact": 62,
  "recommendations": [
    "Apply protective consolidant to exposed stone surfaces",
    "Install localized drainage to divert monsoon runoff",
    "Conduct structural survey of load-bearing elements"
  ],
  "rationale": [
    "Current risk score of 89 places this site above the regional average.",
    "Structural and environmental indicators show a converging upward trend."
  ]
}
```

**Required fields:** `siteId`, `priorityScore`, `priorityLevel`,
`estimatedUrgency`, `interventionImpact`, `recommendations`.
**Optional fields:** `rationale` (rendered as "Why this site is prioritized").

`priorityLevel` must be one of `IMMEDIATE | HIGH | MONITOR`.

---

## `GET /api/conservation`

Returns the conservation recommendation for **every** site, used to build the
priority ranking table on `/conservation`.

**Response `200`** — `ConservationRecommendation[]` (same shape as above, one per site)

---

## `GET /api/analytics`

Returns the aggregated dataset for the `/analytics` page.

**Response `200`** — `AnalyticsOverview`

```json
{
  "averageRiskScore": 59,
  "riskDistribution": { "low": 2, "medium": 4, "high": 3, "critical": 1 },
  "riskTrend": [
    { "date": "Feb 2026", "averageRiskScore": 48 },
    { "date": "Mar 2026", "averageRiskScore": 51 }
  ],
  "environmentalFactors": [
    { "factor": "Rainfall", "impact": 72 },
    { "factor": "Humidity", "impact": 65 }
  ],
  "visitorImpact": [
    { "site": "Red Fort", "visitors": 2100000, "riskScore": 72 }
  ],
  "pollutionImpact": [
    { "site": "Red Fort", "pollutionIndex": 78, "riskScore": 72 }
  ],
  "rainfallHumidity": [
    { "month": "Jul", "rainfall": 210, "humidity": 82 }
  ],
  "siteComparison": [
    { "site": "Konark Sun Temple", "riskScore": 89 }
  ],
  "predictionConfidence": [
    { "site": "Konark Sun Temple", "confidence": 91 }
  ]
}
```

**Required fields:** all top-level fields above are required; array fields may be
empty (`[]`) but should be present.

---

## `GET /api/alerts`

Returns all alerts, most recent first, used by `/alerts` and the dashboard's
"Recent Alerts" panel.

**Response `200`** — `AlertItem[]`

```json
[
  {
    "id": "alert-1",
    "siteId": "site-konark",
    "siteName": "Konark Sun Temple",
    "type": "RISK_INCREASE",
    "severity": "CRITICAL",
    "message": "Risk score for Konark Sun Temple increased by 12% since last assessment",
    "createdAt": "2026-08-10T09:00:00.000Z"
  }
]
```

**Required fields:** `id`, `siteId`, `siteName`, `type`, `severity`, `message`,
`createdAt`.

`type` must be one of `RISK_INCREASE | ENVIRONMENTAL | IMAGE_DETERIORATION |
CONSERVATION_OVERDUE`. `severity` must be one of `INFO | WARNING | CRITICAL`.
`createdAt` should be an ISO-8601 timestamp.

---

## Notes for backend implementers

- Field names, casing, and enum values above are what the frontend expects
  **today** — but they are not final. If your endpoint's natural shape differs,
  either adjust the response to match this contract, or edit the corresponding
  file in `src/services/` to map your response onto these types. Either approach
  keeps every component and page untouched.
- Dates can be plain `YYYY-MM-DD` or full ISO-8601 timestamps; the frontend
  parses both via `Date()`.
- Keep numeric fields in the documented ranges (`0–100` for scores, `0–1` for
  severities) — charts and gauges assume those bounds.
