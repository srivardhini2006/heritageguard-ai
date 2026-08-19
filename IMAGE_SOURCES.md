# Heritage Image Sources

## Why there are no Shutterstock images in this build

This redesign was asked to prioritize **real Shutterstock heritage imagery**,
but under strict conditions: never invent Shutterstock URLs/IDs, never use
watermarked preview images, never use Editorial-Use-Only images for a
product UI, and never reference an asset that can't actually be verified.

The environment this redesign was produced in has **no network access to
shutterstock.com** and no Shutterstock account/API credentials, so there was
no way to search Shutterstock's catalog, confirm an image ID exists, or
verify its licence type (Commercial vs. Editorial Use Only). Guessing at
IDs or URLs would risk exactly what the requirements forbid: broken links,
misattributed images, or Editorial-only content presented as licensed.

**Decision:** rather than fake the integration, the redesign keeps using
the real heritage photographs already wired into the project's mock data
(`src/mocks/sites.mock.ts`), sourced from Wikimedia Commons, and adds a
centralized, swappable image configuration layer so licensed Shutterstock
assets can be dropped in later with zero component changes.

## Current image sources (already in the project)

| Site | Heritage Site | Current Source | License Status |
|---|---|---|---|
| Brihadisvara Temple | Thanjavur, Tamil Nadu | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Shore Temple, Mahabalipuram | Mahabalipuram, Tamil Nadu | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Vittala Temple Complex, Hampi | Hampi, Karnataka | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Ajanta Caves | Aurangabad, Maharashtra | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Ellora Caves | Aurangabad, Maharashtra | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Konark Sun Temple | Konark, Odisha | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Sanchi Stupa | Sanchi, Madhya Pradesh | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Fatehpur Sikri | Agra, Uttar Pradesh | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Red Fort | Delhi | Wikimedia Commons | CC-BY-SA (verified, already in repo) |
| Qutb Minar | Delhi | Wikimedia Commons | CC-BY-SA (verified, already in repo) |

**Placeholder requirement:** all ten rows above are candidates for a licensed
Shutterstock replacement — none are currently backed by a verified
Shutterstock asset.

## How to add real licensed Shutterstock images later

1. Search and licence the image on shutterstock.com yourself (choose a
   licence that permits website/commercial use — **not** "Editorial Use
   Only").
2. Download the asset and either host it locally (e.g. `public/images/…`)
   or use your own licensed Shutterstock delivery URL.
3. Open `src/data/heritageImages.ts` and:
   - Add the real URL somewhere your data layer can read it (e.g. update
     the corresponding site's `imageUrl` in `src/mocks/sites.mock.ts`, or
     wire it through your real API once connected).
   - Update that site's row in `heritageImageSources` with
     `{ source: "Shutterstock", licenseType: "Commercial", verified: true, url: "…" }`.
4. Update the table above with the contributor/title/URL you actually used.

No component needs to change — `SiteCard`, `SiteDetails`, and the Home page
all read images through `ImageWithFallback`, which automatically falls back
to a heritage-styled CSS gradient if a URL is ever missing or fails to load.
