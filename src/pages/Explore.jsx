import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Compass,
  ArrowRight,
  Check,
  ChevronDown,
  Activity,
  AlertTriangle,
  Radar,
} from "lucide-react";
// @svg-maps packages ship a default export (an object with
// { viewBox, label, locations }), not a named export — confirmed
// against react-svg-map's own usage example, which is the reason
// the previous `import { india } from "@svg-maps/india"` failed
// with "does not provide an export named 'india'".
import india from "@svg-maps/india";
import IndianOrnament from "../components/IndianOrnament";
import RevealOnScroll from "../components/RevealOnScroll";
import CrowdTelemetryChart from "../components/CrowdTelemetryChart";
import {
  destinations,
  ZONE_FILTERS,
  CATEGORY_FILTERS,
} from "../data/destinations";

/* Real India outline, real state boundaries — from @svg-maps/india
   rather than a hand-drawn approximation. `india.viewBox` is a
   "minX minY width height" string; deriving the map's true aspect
   ratio from it (instead of hardcoding one) means the container
   below always matches the real outline's proportions, whatever
   its exact coordinate system turns out to be. */
const MAP_VIEWBOX_PARTS = india.viewBox.split(/\s+/).map(Number);
const MAP_ASPECT_RATIO =
  MAP_VIEWBOX_PARTS.length === 4 && MAP_VIEWBOX_PARTS[2] && MAP_VIEWBOX_PARTS[3]
    ? MAP_VIEWBOX_PARTS[2] / MAP_VIEWBOX_PARTS[3]
    : 0.82;

/* =========================================================
   SMALL HELPERS — pure functions & tiny presentational
   components, kept local to this file since they're only
   used here (see task note: avoid unnecessary new files).
========================================================= */

function crowdTone(crowd) {
  if (crowd <= 35) return { label: "Low", className: "text-[#234236]", hex: "#234236" };
  if (crowd <= 65) return { label: "Moderate", className: "text-[#9A6A18]", hex: "#9A6A18" };
  return { label: "High", className: "text-[#A84E38]", hex: "#A84E38" };
}

/* Parses a "08:00–10:00" style range into a 0–100 position along
   a fixed 6 AM – 6 PM decorative timeline. Purely presentational —
   no real scheduling logic depends on this. */
function bestTimePosition(bestTime) {
  if (!bestTime) return 50;

  const start = bestTime.split(/[–-]/)[0].trim();
  const [h, m] = start.split(":").map(Number);

  if (Number.isNaN(h)) return 50;

  const totalMinutes = h * 60 + (Number.isNaN(m) ? 0 : m);
  const rangeStart = 6 * 60;
  const rangeEnd = 18 * 60;
  const clamped = Math.min(Math.max(totalMinutes, rangeStart), rangeEnd);

  return ((clamped - rangeStart) / (rangeEnd - rangeStart)) * 100;
}

/* Short, human "why we recommend this" lines derived entirely
   from fields already present on each destination. */
function recommendationReasons(item) {
  const reasons = [];

  if (item.altCrowd < item.crowd) {
    const diff = Math.round(((item.crowd - item.altCrowd) / item.crowd) * 100);
    reasons.push(`${diff}% lower predicted crowd nearby`);
  }

  reasons.push(`Similar ${item.category.toLowerCase()} experience`);

  const startHour = parseInt(item.bestTime, 10);
  reasons.push(
    !Number.isNaN(startHour) && startHour < 10
      ? "Good early-morning window"
      : "A quieter window before peak hours"
  );

  return reasons;
}

function crowdNote(crowd) {
  if (crowd <= 35) return "Predicted footfall is lighter than nearby hotspots.";
  if (crowd <= 65) return "Expect moderate footfall through the day.";
  return "This is one of the busier spots right now.";
}

function CrowdBar({ value, height = "h-1.5" }) {
  const pct = Math.max(4, Math.min(100, value));
  const tone = crowdTone(value);

  return (
    <div className={`${height} w-full bg-[#D8D1C5]/50 overflow-hidden`}>
      <div
        className="h-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: tone.hex }}
      />
    </div>
  );
}

function IntelligenceMetric({ index, title, description }) {
  return (
    <div
      className="
        group relative flex-1 min-w-[180px] px-6 py-5
        border-l first:border-l-0 border-[#D8D1C5]
        transition-colors duration-300 hover:bg-white/60
      "
    >
      <span className="text-[10px] text-[#C66A4A] font-semibold tracking-[0.1em]">
        {String(index).padStart(2, "0")}
      </span>
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#234236] font-semibold mt-2">
        {title}
      </p>
      <p className="text-xs text-[#6F6A61] mt-1 flex items-center gap-1.5">
        {description}
        <ArrowRight
          size={11}
          className="transition-transform duration-300 group-hover:translate-x-1 text-[#C66A4A]"
        />
      </p>
    </div>
  );
}

function BestTimeTimeline({ bestTime }) {
  const position = bestTimePosition(bestTime);
  const marks = ["06 AM", "09 AM", "12 PM", "03 PM", "06 PM"];

  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61] mb-4">
        Best time to go
      </p>

      <div className="relative pt-6 pb-2">
        <div className="h-px w-full bg-[#D8D1C5]" />

        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-700 ease-out flex flex-col items-center"
          style={{ left: `${position}%` }}
        >
          <span className="text-[9px] uppercase tracking-[0.12em] text-[#C66A4A] font-semibold mb-1 whitespace-nowrap">
            {bestTime}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#C66A4A] border-2 border-[#F5F1E8]" />
        </div>

        <div className="flex justify-between mt-3">
          {marks.map((m) => (
            <span key={m} className="text-[9px] text-[#6F6A61]/70 tracking-wide">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ZONE_LABELS = {
  all: "All India",
  north: "North India",
  south: "South India",
  east: "East India",
  west: "West India",
  northeast: "North East India",
};

/* Marker positions as percentages of India's real bounding box —
   not tied to any particular map package's internal coordinate
   system, so they stay correct regardless of the exact viewBox
   @svg-maps/india ships with. Derived from each destination's
   approximate real latitude/longitude, normalised against a
   bounding box of roughly 68–97.5°E and 8–36°N (Kutch to Arunachal,
   Kanyakumari to Ladakh):

     x% = (lon - 68)   / (97.5 - 68) * 100
     y% = (36 - lat)   / (36 - 8)    * 100   (inverted: higher
                                               latitude → smaller y)

   This intentionally does not reuse destinations.js's coords —
   those were tuned for the old abstract blob and no longer line up
   with a real silhouette. Kept local to this file rather than
   changing the shared data structure. */
const MAP_POSITIONS = {
  Leh: { x: 32.5, y: 6.4 },       // ~34.2°N, 77.6°E
  Rajasthan: { x: 26.4, y: 32.5 }, // ~26.9°N, 75.8°E (Jaipur area)
  Varanasi: { x: 50.8, y: 38.2 },  // ~25.3°N, 83.0°E
  Shillong: { x: 81.0, y: 37.1 },  // ~25.6°N, 91.9°E
  Goa: { x: 20.7, y: 73.9 },       // ~15.4°N, 73.8°E
  Hampi: { x: 28.8, y: 73.9 },     // ~15.3°N, 76.5°E
  Kerala: { x: 28.1, y: 91.1 },    // ~10.5°N, 76.3°E (state centroid)
};

/* =========================================================
   LIVE TOURIST FLOW — DEMO SIMULATION CONSTANTS

   Frontend-only, illustrative sequences used to make existing crowd
   data feel live during the hackathon demo. No network calls, no
   backend — just gradual, scripted movement of numbers that already
   exist on `destinations`. Kept local to this file since nothing
   else depends on it.

   Rajasthan already carries "Jaigarh Fort" as its real alternative
   in destinations.js — the same relationship the brief describes
   for Amber Fort → Jaigarh Fort — so the surge scenario below plays
   out on Rajasthan's existing card/marker/alternative rather than
   inventing a destination that doesn't exist in the data.
========================================================= */

const SURGE_THRESHOLD = 85;

const SIM_SEQUENCE = {
  Rajasthan: [31, 55, 74, 88, 94], // heritage circuit surges into HIGH
  Kerala: [36, 39, 42, 44, 46], // backwaters eases into MODERATE
  Hampi: [35, 30, 26, 23, 21], // ruins settle into LOW
};

const SIM_STEPS = Math.max(
  ...Object.values(SIM_SEQUENCE).map((seq) => seq.length)
);

const PIPELINE_STAGES = [
  { id: "live", label: "Live conditions" },
  { id: "surge", label: "Crowd surge detected" },
  { id: "analyzing", label: "BeyondMaps analyzes options" },
  { id: "alternative", label: "Lower-crowd alternative" },
  { id: "redistributed", label: "Tourist redistributed" },
];

function PulseMetric({ label, value, unit = "%" }) {
  return (
    <div className="flex-1 min-w-[110px] px-5 py-4 border-l first:border-l-0 border-[#D8D1C5]">
      <p className="text-[9px] uppercase tracking-[0.18em] text-[#6F6A61]">
        {label}
      </p>
      <p className="font-editorial text-2xl text-[#234236] mt-1 tabular-nums">
        {Math.round(value)}
        <span className="text-xs text-[#6F6A61] font-sans">{unit}</span>
      </p>
    </div>
  );
}

export default function Explore() {
  const [query, setQuery] = useState("");
  const [activeZone, setActiveZone] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState(destinations[0].name);
  const [hovered, setHovered] = useState(null);
  const [altOpen, setAltOpen] = useState(false);

  // ---- Live Tourist Flow (demo simulation) state ----
  const [simActive, setSimActive] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [pulse, setPulse] = useState({
    crowd: 42,
    traffic: 38,
    safety: 87,
    activity: 55,
  });
  const [pipelineStage, setPipelineStage] = useState("live");
  const [surgeAlert, setSurgeAlert] = useState(null);
  const alertedRef = useRef(new Set());
  const timersRef = useRef([]);

  const mapSectionRef = useRef(null);
  const liveFlowRef = useRef(null);

  // `destinations` with the current simulation step's crowd values layered
  // on top. When no simulation has run, this is identical to `destinations`
  // — every existing consumer of destination data reads from this instead,
  // so live numbers flow through the map, cards and detail panel without
  // touching the underlying data file.
  const liveDestinations = useMemo(() => {
    if (simStep === 0) return destinations;

    return destinations.map((item) => {
      const seq = SIM_SEQUENCE[item.name];
      if (!seq) return item;
      const crowd = seq[Math.min(simStep, seq.length - 1)];
      return { ...item, crowd };
    });
  }, [simStep]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return liveDestinations.filter((item) => {
      const matchesZone = activeZone === "all" || item.zone === activeZone;
      const matchesCategory =
        activeCategory === "all" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesQuery =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesZone && matchesCategory && matchesQuery;
    });
  }, [liveDestinations, query, activeZone, activeCategory]);

  const selectedDestination =
    results.find((item) => item.name === selected) ||
    liveDestinations.find((item) => item.name === selected) ||
    results[0];

  const regionCount = useMemo(
    () => new Set(results.map((item) => item.region)).size,
    [results]
  );

  const quieterPicks = useMemo(
    () => [...results].sort((a, b) => a.crowd - b.crowd).slice(0, 3),
    [results]
  );

  // Collapse the alternative info panel whenever the selection changes,
  // so it never carries over stale context between destinations.
  useEffect(() => {
    setAltOpen(false);
  }, [selected]);

  // Advances the simulation one gradual step at a time, and drifts the
  // City Pulse metrics within realistic bounds, while a simulation run
  // is active. Frontend-only interval — no requests, no backend.
  useEffect(() => {
    if (!simActive) return;

    const interval = setInterval(() => {
      setSimStep((step) => Math.min(step + 1, SIM_STEPS - 1));

      setPulse((prev) => ({
        crowd: Math.min(96, Math.max(15, prev.crowd + (Math.random() * 8 - 2))),
        traffic: Math.min(95, Math.max(10, prev.traffic + (Math.random() * 8 - 3))),
        safety: Math.min(98, Math.max(70, prev.safety + (Math.random() * 4 - 2))),
        activity: Math.min(95, Math.max(15, prev.activity + (Math.random() * 8 - 2))),
      }));
    }, 2400);

    return () => clearInterval(interval);
  }, [simActive]);

  // Watches the live crowd values for any destination crossing the surge
  // threshold, then walks the BeyondMaps pipeline (surge → analyzing →
  // alternative → redistributed) using the destination's existing
  // `alternative` / `altCrowd` / `altReason` fields — no new data shape.
  useEffect(() => {
    if (!simActive) return;

    liveDestinations.forEach((item) => {
      if (item.crowd < SURGE_THRESHOLD || alertedRef.current.has(item.name)) return;

      alertedRef.current.add(item.name);
      setPipelineStage("surge");
      setSurgeAlert({
        name: item.name,
        crowd: item.crowd,
        alternative: item.alternative,
        altCrowd: item.altCrowd,
        altReason: item.altReason,
      });

      timersRef.current.push(
        setTimeout(() => setPipelineStage("analyzing"), 900),
        setTimeout(() => setPipelineStage("alternative"), 2200),
        setTimeout(() => setPipelineStage("redistributed"), 3600)
      );
    });
  }, [liveDestinations, simActive]);

  const toggleSimulation = () => {
    setSimActive((active) => {
      const next = !active;

      if (next) {
        alertedRef.current.clear();
        setPipelineStage("live");
        setSurgeAlert(null);
      } else {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
        setSimStep(0);
        setPipelineStage("live");
        setSurgeAlert(null);
        alertedRef.current.clear();
      }

      return next;
    });
  };

  const exploreAlternative = (name) => {
    setSelected(name);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // The existing `altOpen` reset effect above collapses the alternative
    // panel whenever `selected` changes — this reopens it a beat later so
    // "Explore Alternative" lands with the existing panel already expanded,
    // without altering that effect's original behavior for normal clicks.
    setTimeout(() => setAltOpen(true), 60);
  };

  const selectAndScroll = (name) => {
    setSelected(name);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setQuery("");
    setActiveZone("all");
    setActiveCategory("all");
  };

  return (
    <main className="bg-[#F5F1E8] text-[#24231F]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#D8D1C5]">

        <IndianOrnament
          variant="corner"
          color="#234236"
          opacity={0.1}
          duration={70}
          className="absolute -left-16 -top-10 w-80 h-80 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-14">

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C66A4A] font-semibold mb-6">
            Explore India
          </p>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#234236]">
              Find your way
              <br />
              <span className="italic text-[#24231F]">beyond the obvious.</span>
            </h1>

            <p className="text-sm lg:text-base text-[#6F6A61] leading-relaxed max-w-md">
              Explore destinations through crowd patterns, local experiences
              and smarter alternatives — search, filter, or scan the map to
              start.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <section className="border-b border-[#D8D1C5]">

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">

            <div className="relative w-full md:w-80">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6F6A61] text-sm">
                ⌕
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search India..."
                className="
                  w-full bg-transparent border-b border-[#D8D1C5]
                  pl-6 pr-2 py-2.5 text-sm text-[#24231F]
                  placeholder:text-[#6F6A61]/70
                  focus:outline-none focus:border-[#C66A4A]
                  transition-colors
                "
              />
            </div>

            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 -mb-1">
              {ZONE_FILTERS.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZone(zone.id)}
                  className={`
                    px-3.5 py-1.5 text-[9px] uppercase tracking-[0.15em] font-semibold
                    border transition-colors whitespace-nowrap shrink-0
                    ${
                      activeZone === zone.id
                        ? "bg-[#234236] border-[#234236] text-[#F5F1E8]"
                        : "border-[#D8D1C5] text-[#6F6A61] hover:border-[#234236] hover:text-[#234236]"
                    }
                  `}
                >
                  {zone.label}
                </button>
              ))}
            </div>

          </div>

          <div className="flex flex-wrap gap-2 mt-5 overflow-x-auto">

            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`
                px-4 py-2 text-xs font-semibold border transition-colors whitespace-nowrap
                ${
                  activeCategory === "all"
                    ? "border-[#C66A4A] text-[#C66A4A]"
                    : "border-[#D8D1C5] text-[#6F6A61] hover:border-[#C66A4A] hover:text-[#C66A4A]"
                }
              `}
            >
              All categories
            </button>

            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 text-xs font-semibold border transition-colors whitespace-nowrap uppercase tracking-wider
                  ${
                    activeCategory === cat
                      ? "border-[#C66A4A] text-[#C66A4A]"
                      : "border-[#D8D1C5] text-[#6F6A61] hover:border-[#C66A4A] hover:text-[#C66A4A]"
                  }
                `}
              >
                {cat}
              </button>
            ))}

          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-[#6F6A61]">
              {results.length === 0
                ? "No destinations found. Try another search."
                : `${results.length} destination${results.length === 1 ? "" : "s"} found`}
            </p>

            <p className="text-[9px] uppercase tracking-[0.18em] text-[#6F6A61]">
              Showing{" "}
              <span className="text-[#234236] font-semibold">
                {ZONE_LABELS[activeZone] || "All India"}
              </span>
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          TRAVEL INTELLIGENCE STRIP
      ===================================================== */}

      <section className="relative border-b border-[#D8D1C5] overflow-hidden">

        <IndianOrnament
          variant="corner"
          color="#C66A4A"
          opacity={0.07}
          duration={80}
          reverse
          className="absolute -right-14 -top-14 w-60 h-60 rotate-180 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-6">

          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A] font-semibold">
              Travel Intelligence
            </p>
            <p className="text-[10px] text-[#6F6A61] tracking-wide">
              {results.length} destination{results.length === 1 ? "" : "s"} ·{" "}
              {regionCount} region{regionCount === 1 ? "" : "s"} · live-style
              crowd signals
            </p>
          </div>

          <div className="flex flex-wrap border border-[#D8D1C5] divide-x divide-[#D8D1C5]">
            <IntelligenceMetric
              index={1}
              title="Crowd"
              description="Predict before you go"
            />
            <IntelligenceMetric
              index={2}
              title="Alternatives"
              description="Discover quieter routes"
            />
            <IntelligenceMetric
              index={3}
              title="Safety"
              description="Travel with context"
            />
          </div>

        </div>

      </section>


      {/* =====================================================
          LIVE TOURIST FLOW — DEMO SIMULATION

          Additive section. It doesn't replace anything above or
          below — it drives the existing map markers, result cards,
          detail panel and CrowdTelemetryChart with a scripted,
          frontend-only "live feed."
      ===================================================== */}

      <section ref={liveFlowRef} className="relative border-b border-[#D8D1C5] overflow-hidden bg-[#EEE9DE]/40">

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A] font-semibold flex items-center gap-2">
                <Radar size={12} />
                Live Tourist Flow
              </p>
              <p className="text-xs text-[#6F6A61] mt-1 max-w-md">
                Run a simulated feed and watch crowd signals, the map and
                BeyondMaps' rerouting logic move in real time.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleSimulation}
              className={`
                inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.15em] font-semibold
                transition-colors
                ${
                  simActive
                    ? "bg-[#A84E38] text-[#F5F1E8] hover:bg-[#8f3e2c]"
                    : "bg-[#234236] text-[#F5F1E8] hover:bg-[#1a3229]"
                }
              `}
            >
              <Activity size={14} className={simActive ? "animate-pulse" : ""} />
              {simActive ? "Stop Simulation" : "Simulate Live Conditions"}
            </button>
          </div>

          {/* City Pulse */}
          <div className="flex flex-wrap border border-[#D8D1C5] divide-x divide-[#D8D1C5] bg-white/50 mb-8">
            <PulseMetric label="Crowd" value={pulse.crowd} />
            <PulseMetric label="Traffic" value={pulse.traffic} />
            <PulseMetric label="Safety" value={pulse.safety} unit="/100" />
            <PulseMetric label="Local Activity" value={pulse.activity} />
          </div>

          {/* BeyondMaps intelligence pipeline — appears once a run has started */}
          {(simActive || simStep > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.12em]">
              {PIPELINE_STAGES.map((stage, i) => {
                const isActive = stage.id === pipelineStage;
                const isPast =
                  PIPELINE_STAGES.findIndex((s) => s.id === pipelineStage) > i;

                return (
                  <React.Fragment key={stage.id}>
                    <span
                      className={`px-3 py-1.5 border transition-colors duration-300 ${
                        isActive
                          ? "bg-[#234236] border-[#234236] text-[#F5F1E8]"
                          : isPast
                          ? "border-[#234236]/40 text-[#234236]"
                          : "border-[#D8D1C5] text-[#6F6A61]/60"
                      }`}
                    >
                      {stage.label}
                    </span>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <ArrowRight size={11} className="text-[#6F6A61]/50" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Crowd surge alert */}
          {surgeAlert && (
            <div className="border border-[#A84E38] bg-[#A84E38]/[0.06] p-5 sm:p-6 mb-2 animate-[fadeIn_0.4s_ease-out]">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#A84E38]">
                <AlertTriangle size={14} />
                Crowd Surge Detected
              </p>
              <p className="text-sm text-[#24231F] mt-2">
                <strong>{surgeAlert.name}</strong> is becoming highly crowded —{" "}
                {surgeAlert.crowd}% and rising.
              </p>

              {pipelineStage !== "surge" && (
                <div className="mt-4 pt-4 border-t border-[#A84E38]/20 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61]">
                      BeyondMaps recommends
                    </p>
                    <p className="font-editorial text-xl text-[#234236] mt-1">
                      {surgeAlert.alternative}
                    </p>
                    <p className="text-xs text-[#6F6A61] mt-1">
                      {surgeAlert.altCrowd}% predicted crowd · similar interest · nearby
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => exploreAlternative(surgeAlert.name)}
                    className="
                      inline-flex items-center justify-center gap-2 px-5 py-3
                      bg-[#234236] text-[#F5F1E8] text-xs uppercase tracking-[0.15em] font-semibold
                      hover:bg-[#1a3229] transition-colors whitespace-nowrap
                    "
                  >
                    Explore Alternative
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Existing telemetry chart component — untouched structurally,
            just handed the live feed via its new optional props. */}
        <CrowdTelemetryChart live={simActive} liveDensity={pulse.crowd} />

      </section>


      {/* =====================================================
          MAP + DETAIL PANEL
      ===================================================== */}

      <section ref={mapSectionRef} className="border-b border-[#D8D1C5]">

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">

            {/* MOCK INDIA MAP */}
            <div className="lg:sticky lg:top-6">

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A] font-semibold">
                    Explore by signal
                  </p>
                  <p className="text-[11px] text-[#6F6A61] mt-1">
                    India · crowd intelligence · alternatives
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-[9px] uppercase tracking-[0.12em] text-[#6F6A61]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#234236" }} />
                    Lower
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#9A6A18" }} />
                    Moderate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#A84E38" }} />
                    Higher
                  </span>
                </div>
              </div>

              <div
                className="relative border border-[#D8D1C5] bg-[#EEE9DE]/50 overflow-hidden"
                style={{ aspectRatio: MAP_ASPECT_RATIO }}
              >

                <IndianOrnament
                  variant="floral"
                  color="#234236"
                  opacity={0.06}
                  duration={110}
                  className="absolute -right-28 -bottom-28 w-[420px] h-[420px] pointer-events-none"
                />

                <Compass
                  size={20}
                  strokeWidth={1.25}
                  className="absolute top-4 right-4 text-[#234236]/25 pointer-events-none"
                />

                {/* faint editorial region labels */}
                <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.3em] text-[#234236]/30">
                  North
                </span>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.3em] text-[#234236]/30">
                  South
                </span>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] uppercase tracking-[0.3em] text-[#234236]/30 [writing-mode:vertical-rl]">
                  West
                </span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] uppercase tracking-[0.3em] text-[#234236]/30 [writing-mode:vertical-rl]">
                  East
                </span>
                <span className="absolute top-10 right-8 text-[8px] uppercase tracking-[0.3em] text-[#234236]/30">
                  N.East
                </span>

                <svg
                  viewBox={india.viewBox}
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Real India outline and state boundaries from
                      @svg-maps/india — not a hand-drawn approximation.
                      vectorEffect keeps the hairline stroke a consistent
                      visual width regardless of the package's internal
                      coordinate scale. */}
                  {india.locations.map((location) => (
                    <path
                      key={location.id}
                      d={location.path}
                      fill="#234236"
                      fillOpacity="0.07"
                      stroke="#234236"
                      strokeOpacity="0.3"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>

                {liveDestinations.map((item) => {
                  const isVisible = results.some((r) => r.name === item.name);
                  const isSelected = selectedDestination?.name === item.name;
                  const isHovered = hovered === item.name;
                  const pos = MAP_POSITIONS[item.name] ?? { x: 50, y: 60 };

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setSelected(item.name);
                      }}
                      onMouseEnter={() => setHovered(item.name)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                      }}
                      className={`
                        absolute -translate-x-1/2 -translate-y-1/2
                        flex items-center justify-center
                        transition-all duration-300
                        ${isVisible ? "opacity-100" : "opacity-25"}
                      `}
                    >
                      {isSelected && (
                        <span className="absolute w-7 h-7 rounded-full border border-[#C66A4A] animate-pulse" />
                      )}

                      {isHovered && !isSelected && (
                        <span className="absolute w-5 h-5 rounded-full border border-[#234236]/40" />
                      )}

                      <span
                        className={`
                          block rounded-full transition-all duration-300
                          ${
                            isSelected
                              ? "w-3.5 h-3.5 bg-[#C66A4A]"
                              : "w-2.5 h-2.5 bg-[#234236]"
                          }
                          ${isHovered ? "scale-125" : ""}
                        `}
                      />

                      {(isHovered || isSelected) && (
                        <span
                          className="
                            absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                            whitespace-nowrap px-2.5 py-1 bg-[#234236] text-[#F5F1E8]
                            text-[10px] uppercase tracking-wider font-semibold
                            animate-[fadeIn_0.2s_ease-out]
                          "
                        >
                          {item.name} · {item.crowd}%
                        </span>
                      )}
                    </button>
                  );
                })}

                <p className="absolute bottom-3 right-4 text-[9px] uppercase tracking-[0.15em] text-[#6F6A61]">
                  India · state boundaries
                </p>

              </div>
            </div>

            {/* DETAIL PANEL */}
            <div className="border border-[#D8D1C5] bg-[#F5F1E8] p-8 lg:p-10 flex flex-col">

              {selectedDestination ? (
                <React.Fragment key={selectedDestination.name}>

                  <div className="relative h-44 -mx-8 -mt-8 lg:-mx-10 lg:-mt-10 mb-8 overflow-hidden">
                    <img
                      key={selectedDestination.name}
                      src={selectedDestination.image}
                      alt={selectedDestination.name}
                      className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_0.5s_ease-out]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#234236]/85 to-transparent" />
                    <div className="absolute bottom-4 left-6 animate-[fadeIn_0.5s_ease-out]">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#F5F1E8]/70">
                        Destination intelligence
                      </p>
                      <h2 className="font-editorial text-4xl text-[#F5F1E8] mt-1">
                        {selectedDestination.name}
                        <span className="text-lg text-[#F5F1E8]/60 font-sans italic">
                          {" "}/ {selectedDestination.region}
                        </span>
                      </h2>
                    </div>
                  </div>

                  <span className="inline-block w-fit px-2.5 py-1 bg-[#234236]/8 text-[#234236] text-[10px] uppercase tracking-wider font-semibold mb-6 animate-[fadeIn_0.5s_ease-out]">
                    {selectedDestination.category}
                  </span>

                  <div
                    className="grid grid-cols-2 gap-6 pb-6 border-b border-[#D8D1C5] animate-[fadeIn_0.6s_ease-out]"
                    style={{ animationDelay: "60ms" }}
                  >

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61]">
                        Crowd level
                      </p>
                      <p className="font-editorial text-3xl text-[#234236] mt-1">
                        {selectedDestination.crowd}%
                      </p>
                      <p className={`text-xs font-semibold mb-2 ${crowdTone(selectedDestination.crowd).className}`}>
                        {crowdTone(selectedDestination.crowd).label}
                      </p>
                      <CrowdBar value={selectedDestination.crowd} />
                      <p className="text-[10px] text-[#6F6A61] mt-2 leading-relaxed">
                        {crowdNote(selectedDestination.crowd)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61]">
                        Safety
                      </p>
                      <p className="font-editorial text-3xl text-[#234236] mt-1">
                        {selectedDestination.safety}
                        <span className="text-base text-[#6F6A61]">/100</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61]">
                        Best time
                      </p>
                      <p className="text-sm font-semibold text-[#234236] mt-2">
                        {selectedDestination.bestTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61] flex items-center gap-1.5">
                        <MapPin size={11} />
                        Nearby
                      </p>
                      <p className="text-sm font-semibold text-[#234236] mt-2">
                        {selectedDestination.distance}
                      </p>
                    </div>

                  </div>

                  <div
                    className="py-6 border-b border-[#D8D1C5] animate-[fadeIn_0.6s_ease-out]"
                    style={{ animationDelay: "120ms" }}
                  >
                    <BestTimeTimeline bestTime={selectedDestination.bestTime} />
                  </div>

                  <div
                    className="py-6 border-b border-[#D8D1C5] animate-[fadeIn_0.6s_ease-out]"
                    style={{ animationDelay: "180ms" }}
                  >
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61] mb-4">
                      Smart alternative
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-[#D8D1C5] bg-white/60 p-4">
                        <p className="text-[9px] uppercase tracking-[0.14em] text-[#6F6A61]">
                          When it's busy
                        </p>
                        <p className="font-editorial text-lg text-[#234236] mt-1.5">
                          {selectedDestination.name}
                        </p>
                        <p className={`text-xs font-semibold mt-1 ${crowdTone(selectedDestination.crowd).className}`}>
                          {selectedDestination.crowd}% crowd
                        </p>
                      </div>

                      <div className="border border-[#234236] bg-[#234236] text-white p-4">
                        <p className="text-[9px] uppercase tracking-[0.14em] text-[#C9D2C5]">
                          Try instead
                        </p>
                        <p className="font-editorial text-lg mt-1.5">
                          {selectedDestination.alternative}
                        </p>
                        <p className="text-xs font-semibold mt-1 text-[#C9D2C5]">
                          {selectedDestination.altCrowd}% predicted crowd
                        </p>
                      </div>
                    </div>

                    {selectedDestination.crowd > 0 && (
                      <p className="text-xs text-[#C66A4A] font-semibold mt-3 flex items-center gap-1.5">
                        <ArrowRight size={12} className="rotate-90" />
                        {Math.round(
                          ((selectedDestination.crowd - selectedDestination.altCrowd) /
                            selectedDestination.crowd) *
                            100
                        )}
                        % quieter
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setAltOpen((v) => !v)}
                      className="
                        inline-flex items-center gap-2 mt-4
                        text-xs font-semibold text-[#234236]
                        hover:text-[#C66A4A] transition-colors
                      "
                    >
                      Explore alternative
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${altOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div
                      className={`
                        overflow-hidden transition-all duration-[400ms] ease-out
                        ${altOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}
                      `}
                    >
                      <div className="border border-[#D8D1C5] bg-white/70 p-4">
                        <p className="text-xs text-[#6F6A61] leading-relaxed">
                          {selectedDestination.altReason}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="py-6 flex-1 animate-[fadeIn_0.6s_ease-out]"
                    style={{ animationDelay: "240ms" }}
                  >
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61] mb-3">
                      Why BeyondMaps?
                    </p>

                    <ul className="space-y-2">
                      {recommendationReasons(selectedDestination).map((reason, i) => (
                        <li
                          key={reason}
                          className="flex items-center gap-2.5 text-sm text-[#24231F] animate-[fadeIn_0.4s_ease-out]"
                          style={{ animationDelay: `${280 + i * 90}ms` }}
                        >
                          <Check size={14} className="text-[#234236] shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/plan-trip"
                    className="
                      inline-flex items-center justify-center gap-3 mt-2
                      px-6 py-4 bg-[#234236] text-[#F5F1E8]
                      text-xs uppercase tracking-[0.15em] font-semibold
                      hover:bg-[#1a3229] transition-colors
                    "
                  >
                    Plan This Destination
                    <span>→</span>
                  </Link>
                </React.Fragment>
              ) : (
                <p className="text-sm text-[#6F6A61]">
                  Select a destination to see its details.
                </p>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RESULTS GRID
      ===================================================== */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A] font-semibold mb-2">
                Destinations
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-5xl text-[#234236]">
                  {String(results.length).padStart(2, "0")}
                </span>
                <span className="text-xs uppercase tracking-[0.15em] text-[#6F6A61]">
                  Destination{results.length === 1 ? "" : "s"} in view
                </span>
              </div>
            </div>
          </div>

          {quieterPicks.length > 0 && (
            <RevealOnScroll className="mb-14">
              <div className="flex items-center gap-4 mb-5">
                <IndianOrnament
                  variant="divider"
                  spin={false}
                  color="#234236"
                  opacity={0.18}
                  className="w-24 h-auto hidden sm:block"
                />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C66A4A] font-semibold">
                    Quieter picks
                  </p>
                  <p className="text-xs text-[#6F6A61] mt-1">
                    Places worth looking at before the obvious ones.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {quieterPicks.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => selectAndScroll(item.name)}
                    className="
                      flex items-center gap-4 border border-[#D8D1C5] bg-white
                      p-3 text-left hover:border-[#234236] transition-colors
                      group
                    "
                  >
                    <div className="w-16 h-16 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-editorial text-lg text-[#234236] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#234236] font-semibold mt-0.5">
                        {item.crowd}% · Low crowd
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </RevealOnScroll>
          )}

          {results.length === 0 ? (
            <div className="border border-dashed border-[#D8D1C5] py-20 text-center">
              <p className="font-editorial text-3xl text-[#234236] mb-2">
                Not on the map — yet.
              </p>
              <p className="text-sm text-[#6F6A61] mb-6">
                No destination matched that search.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#C66A4A] hover:text-[#234236] transition-colors inline-flex items-center gap-2"
              >
                Clear search
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-[#D8D1C5]">
              {results.map((item, idx) => {
                const tone = crowdTone(item.crowd);
                const isSelected = selectedDestination?.name === item.name;

                return (
                  <RevealOnScroll
                    key={item.name}
                    style={{ transitionDelay: `${Math.min(idx, 8) * 60}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => selectAndScroll(item.name)}
                      className={`
                        group relative w-full text-left border-r border-b border-[#D8D1C5]
                        transition-all duration-300 hover:-translate-y-1
                        ${isSelected ? "bg-[#EEE9DE]" : "hover:bg-[#EEE9DE]/60"}
                      `}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#234236]/70 to-transparent" />
                        <span className="absolute top-3 left-3 px-2 py-1 bg-[#F5F1E8]/90 text-[#234236] text-[9px] uppercase tracking-wider font-semibold">
                          {item.category}
                        </span>
                        <h3 className="absolute bottom-3 left-4 font-editorial text-2xl text-[#F5F1E8]">
                          {item.name}
                        </h3>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#6F6A61]">
                            Crowd&nbsp;
                            <span className={`font-semibold ${tone.className}`}>
                              {item.crowd}% · {tone.label}
                            </span>
                          </span>
                          <span className="text-[#6F6A61]">
                            Safety <span className="font-semibold text-[#234236]">{item.safety}</span>
                          </span>
                        </div>

                        <CrowdBar value={item.crowd} height="h-1" />

                        <p className="text-xs text-[#C66A4A] font-semibold mt-3 flex items-center gap-1.5">
                          Alt: {item.alternative}
                          <ArrowRight
                            size={12}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </p>
                      </div>
                    </button>
                  </RevealOnScroll>
                );
              })}
            </div>
          )}

        </div>

      </section>

    </main>
  );
}
