import type { CSSProperties } from "react";
import Reveal from "./Reveal";

interface CollagePhoto {
  src: string;
  alt: string;
  caption: string;
}

// Real site photographs — heritage-03 (Gopuram Gateway) removed.
// 7 images in a professional masonry-style grid.
const PHOTOS: CollagePhoto[] = [
  { src: "/collage/heritage-01.jpg", alt: "Carved temple tower and courtyard viewed from above", caption: "Temple Tower" },
  { src: "/collage/heritage-02.jpg", alt: "Multi-tiered stepwell with carved pillars", caption: "Ancient Stepwell" },
  { src: "/collage/heritage-04.jpg", alt: "Fragmented stone carving among rubble", caption: "Stone Carvings" },
  { src: "/collage/heritage-05.jpg", alt: "Close-up of eroded temple wall sculptures", caption: "Wall Sculptures" },
  { src: "/collage/heritage-06.jpg", alt: "Ruined stone arches of a hilltop temple", caption: "Stone Arches" },
  { src: "/collage/heritage-07.jpg", alt: "Ancient brick stupa ruins under a clear sky", caption: "Stupa Ruins" },
  { src: "/collage/heritage-08.jpg", alt: "Sandstone temple facade with intricate reliefs", caption: "Temple Facade" },
];

/**
 * Professional masonry photo grid — 7 heritage images as full-coverage
 * background panels with layered shadow overlays and hover captions.
 * Layout: one large feature panel (2×2) on the left, 5 smaller cells on the right.
 */
export default function HeritageCollage() {
  return (
    <section className="border-t border-base-700 bg-base-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-wide text-sandstone-400">
            From the field
          </span>
          <h2 className="mt-2 font-display text-xl font-medium text-stone-50">
            Sites in the survey archive
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-stone-400">
            A sample of the on-the-ground photography that feeds the platform&apos;s image-analysis
            pipeline — cracking, erosion, and fragment loss, documented as it stands today.
          </p>
        </Reveal>

        <Reveal delayMs={120}>
          {/* 7-image masonry grid:
              Row 1: [A(large)] [B] [C] [D]
              Row 2: [A(large)] [E] [F] [G]
          */}
          <div
            className="mt-10 grid gap-3 sm:gap-4"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "210px 210px",
              gridTemplateAreas: `
                "a a b c"
                "a a d e"
              `,
            } as CSSProperties}
          >
            <PhotoCell photo={PHOTOS[0]} style={{ gridArea: "a" }} />
            <PhotoCell photo={PHOTOS[1]} style={{ gridArea: "b" }} />
            <PhotoCell photo={PHOTOS[2]} style={{ gridArea: "c" }} />
            <PhotoCell photo={PHOTOS[3]} style={{ gridArea: "d" }} />
            <PhotoCell photo={PHOTOS[4]} style={{ gridArea: "e" }} />
          </div>

          {/* Second row: 2 wide panels side by side */}
          <div
            className="mt-3 grid gap-3 sm:mt-4 sm:gap-4"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "180px",
            } as CSSProperties}
          >
            <PhotoCell photo={PHOTOS[5]} />
            <PhotoCell photo={PHOTOS[6]} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

interface PhotoCellProps {
  photo: CollagePhoto;
  style?: CSSProperties;
}

function PhotoCell({ photo, style }: PhotoCellProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-lift"
      style={style}
    >
      {/* Background image */}
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Layered shadow overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-950/85 via-base-950/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-950/40 via-transparent to-transparent" />
      {/* Warm heritage tint — fades on hover */}
      <div className="pointer-events-none absolute inset-0 bg-sandstone-600/10 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />

      {/* Caption — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1 p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold-400/80">Heritage Site</p>
        <p className="mt-0.5 font-display text-sm font-medium text-stone-100">{photo.caption}</p>
      </div>

      {/* Subtle gold border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-gold-500/25" />
    </div>
  );
}
