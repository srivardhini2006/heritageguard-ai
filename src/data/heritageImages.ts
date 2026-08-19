import type { HeritageType } from "../types";

// ─────────────────────────────────────────────────────────────────────────
// Centralized heritage-image configuration.
//
// IMPORTANT — image sourcing:
// This build environment has no network access to shutterstock.com and no
// way to verify a Shutterstock asset's licence (Commercial vs. Editorial
// Use Only) before shipping it. Per the sourcing requirements for this
// project, an image is only used here if it can be verified — so rather
// than invent or guess Shutterstock URLs/IDs, this file re-uses the real,
// working heritage photographs already present in the project's mock data
// (Wikimedia Commons, public domain / CC-licensed) as the current image
// source, and exposes a single place to swap in licensed Shutterstock
// assets later without touching any component.
//
// See IMAGE_SOURCES.md at the project root for the full licensing table
// and instructions for dropping in verified Shutterstock URLs.
// ─────────────────────────────────────────────────────────────────────────

/** Per-heritage-type CSS gradient + accent used when no photo is available. */
export const HERITAGE_TYPE_TREATMENT: Record<HeritageType, { gradient: string; accent: string }> = {
  Temple: { gradient: "from-forest-900 via-forest-600/70 to-gold-500/40", accent: "text-gold-300" },
  Fort: { gradient: "from-base-950 via-sandstone-600/60 to-terracotta-500/40", accent: "text-sandstone-300" },
  Monument: { gradient: "from-base-950 via-base-700 to-gold-500/30", accent: "text-gold-300" },
  "Rock-Cut Architecture": { gradient: "from-base-950 via-terracotta-600/50 to-sandstone-500/30", accent: "text-terracotta-300" },
  Stupa: { gradient: "from-forest-900 via-sandstone-600/50 to-gold-400/30", accent: "text-sandstone-200" },
  Palace: { gradient: "from-base-950 via-gold-600/40 to-forest-600/30", accent: "text-gold-300" },
  "Archaeological Site": { gradient: "from-base-950 via-base-700 to-terracotta-500/30", accent: "text-stone-200" },
  Mausoleum: { gradient: "from-base-950 via-sandstone-600/50 to-forest-600/30", accent: "text-sandstone-200" },
};

export function getFallbackTreatment(heritageType?: HeritageType) {
  return heritageType ? HERITAGE_TYPE_TREATMENT[heritageType] : HERITAGE_TYPE_TREATMENT.Monument;
}

/**
 * Site-specific image overrides, keyed by the HeritageSite.id used
 * throughout the app (see src/mocks/sites.mock.ts / API_CONTRACT.md).
 *
 * Every entry currently just documents the source already wired through
 * `site.imageUrl` from the data layer — nothing here overrides API data.
 * Populate `licensed` entries once real Shutterstock assets are obtained
 * and their commercial-use licence has been verified.
 */
export interface HeritageImageSource {
  source: "Wikimedia Commons" | "Shutterstock" | "Local Asset";
  licenseType: "Public Domain" | "CC-BY-SA" | "Commercial" | "Unverified";
  verified: boolean;
  url?: string;
}

export const heritageImageSources: Record<string, HeritageImageSource> = {
  "site-brihadisvara": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-mahabalipuram": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-hampi": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-ajanta": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-ellora": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-konark": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-sanchi": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-fatehpur-sikri": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-red-fort": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
  "site-qutb-minar": { source: "Wikimedia Commons", licenseType: "CC-BY-SA", verified: true },
};

export function getImageSource(siteId: string): HeritageImageSource | undefined {
  return heritageImageSources[siteId];
}
