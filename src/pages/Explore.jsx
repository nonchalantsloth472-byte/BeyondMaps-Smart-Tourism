import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Compass,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import IndianOrnament from "../components/IndianOrnament";
import RevealOnScroll from "../components/RevealOnScroll";

import {
  destinations,
  ZONE_FILTERS,
  CATEGORY_FILTERS,
} from "../data/destinations";

/* =========================================================
   HELPERS
========================================================= */

function crowdTone(crowd) {
  if (crowd <= 35) {
    return {
      label: "Low",
      className: "text-[#234236]",
      hex: "#234236",
    };
  }

  if (crowd <= 65) {
    return {
      label: "Moderate",
      className: "text-[#9A6A18]",
      hex: "#9A6A18",
    };
  }

  return {
    label: "High",
    className: "text-[#A84E38]",
    hex: "#A84E38",
  };
}

function bestTimePosition(bestTime) {
  if (!bestTime) return 50;

  const start = bestTime.split(/[–-]/)[0].trim();
  const [h, m] = start.split(":").map(Number);

  if (Number.isNaN(h)) return 50;

  const totalMinutes =
    h * 60 + (Number.isNaN(m) ? 0 : m);

  const rangeStart = 6 * 60;
  const rangeEnd = 18 * 60;

  const clamped = Math.min(
    Math.max(totalMinutes, rangeStart),
    rangeEnd
  );

  return (
    ((clamped - rangeStart) /
      (rangeEnd - rangeStart)) *
    100
  );
}

function recommendationReasons(item) {
  const reasons = [];

  if (item.altCrowd < item.crowd) {
    const diff = Math.round(
      ((item.crowd - item.altCrowd) /
        item.crowd) *
        100
    );

    reasons.push(
      `${diff}% lower predicted crowd nearby`
    );
  }

  reasons.push(
    `Similar ${item.category.toLowerCase()} experience`
  );

  const startHour = parseInt(item.bestTime, 10);

  reasons.push(
    !Number.isNaN(startHour) && startHour < 10
      ? "Good early-morning window"
      : "A quieter window before peak hours"
  );

  return reasons;
}

function crowdNote(crowd) {
  if (crowd <= 35) {
    return "Predicted footfall is lighter than nearby hotspots.";
  }

  if (crowd <= 65) {
    return "Expect moderate footfall through the day.";
  }

  return "This is one of the busier spots right now.";
}

function CrowdBar({
  value,
  height = "h-1.5",
}) {
  const pct = Math.max(
    4,
    Math.min(100, value)
  );

  const tone = crowdTone(value);

  return (
    <div
      className={`${height} w-full bg-[#D8D1C5]/50 overflow-hidden`}
    >
      <div
        className="h-full transition-all duration-700 ease-out"
        style={{
          width: `${pct}%`,
          backgroundColor: tone.hex,
        }}
      />
    </div>
  );
}

function IntelligenceMetric({
  index,
  title,
  description,
}) {
  return (
    <div
      className="
        group relative flex-1 min-w-[180px]
        px-6 py-5
        border-l first:border-l-0
        border-[#D8D1C5]
        transition-colors duration-300
        hover:bg-white/60
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

function BestTimeTimeline({
  bestTime,
}) {
  const position =
    bestTimePosition(bestTime);

  const marks = [
    "06 AM",
    "09 AM",
    "12 PM",
    "03 PM",
    "06 PM",
  ];

  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61] mb-4">
        Best time to go
      </p>

      <div className="relative pt-6 pb-2">

        <div className="h-px w-full bg-[#D8D1C5]" />

        <div
          className="
            absolute top-0
            -translate-x-1/2
            transition-all duration-700 ease-out
            flex flex-col items-center
          "
          style={{
            left: `${position}%`,
          }}
        >
          <span className="text-[9px] uppercase tracking-[0.12em] text-[#C66A4A] font-semibold mb-1 whitespace-nowrap">
            {bestTime}
          </span>

          <span className="w-2.5 h-2.5 rounded-full bg-[#C66A4A] border-2 border-[#F5F1E8]" />
        </div>

        <div className="flex justify-between mt-3">
          {marks.map((m) => (
            <span
              key={m}
              className="text-[9px] text-[#6F6A61]/70 tracking-wide"
            >
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

/* =========================================================
   EXPLORE
========================================================= */

export default function Explore() {
  const [query, setQuery] = useState("");
  const [activeZone, setActiveZone] = useState("all");
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [selected, setSelected] = useState(
    destinations[0]?.name || ""
  );

  const [hovered, setHovered] = useState(null);
  const [altOpen, setAltOpen] = useState(false);

  const mapSectionRef = useRef(null);

  /* =======================================================
     FILTERS
  ======================================================= */

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return destinations.filter((item) => {
      const matchesZone =
        activeZone === "all" ||
        item.zone === activeZone;

      const matchesCategory =
        activeCategory === "all" ||
        item.category.toLowerCase() ===
          activeCategory.toLowerCase();

      const matchesQuery =
        q === "" ||
        item.name
          .toLowerCase()
          .includes(q) ||
        item.region
          .toLowerCase()
          .includes(q) ||
        item.category
          .toLowerCase()
          .includes(q);

      return (
        matchesZone &&
        matchesCategory &&
        matchesQuery
      );
    });
  }, [
    query,
    activeZone,
    activeCategory,
  ]);

  const selectedDestination =
    results.find(
      (item) => item.name === selected
    ) ||
    destinations.find(
      (item) => item.name === selected
    ) ||
    results[0];

  const regionCount = useMemo(
    () =>
      new Set(
        results.map(
          (item) => item.region
        )
      ).size,
    [results]
  );

  const quieterPicks = useMemo(
    () =>
      [...results]
        .sort(
          (a, b) =>
            a.crowd - b.crowd
        )
        .slice(0, 3),
    [results]
  );

  useEffect(() => {
    setAltOpen(false);
  }, [selected]);

  const selectAndScroll = (name) => {
    setSelected(name);

    mapSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const clearFilters = () => {
    setQuery("");
    setActiveZone("all");
    setActiveCategory("all");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="bg-[#F5F1E8] text-[#24231F]">

      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="relative overflow-hidden border-b border-[#D8D1C5]">

        <IndianOrnament
          variant="corner"
          color="#234236"
          opacity={0.1}
          duration={70}
          className="
            absolute
            -left-16
            -top-10
            w-80
            h-80
            pointer-events-none
          "
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-14">

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C66A4A] font-semibold mb-6">
            Explore India
          </p>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#234236]">
              Find your way
              <br />

              <span className="italic text-[#24231F]">
                beyond the obvious.
              </span>
            </h1>

            <p className="text-sm lg:text-base text-[#6F6A61] leading-relaxed max-w-md">
              Explore destinations through crowd patterns,
              local experiences and smarter alternatives —
              search, filter, or scan the map to start.
            </p>

          </div>

        </div>

      </section>

      {/* ===================================================
          SEARCH + FILTERS
      =================================================== */}

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
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search India..."
                className="
                  w-full
                  bg-transparent
                  border-b
                  border-[#D8D1C5]
                  pl-6
                  pr-2
                  py-2.5
                  text-sm
                  text-[#24231F]
                  placeholder:text-[#6F6A61]/70
                  focus:outline-none
                  focus:border-[#C66A4A]
                  transition-colors
                "
              />

            </div>

            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 -mb-1">

              {ZONE_FILTERS.map((zone) => (

                <button
                  key={zone.id}
                  type="button"
                  onClick={() =>
                    setActiveZone(zone.id)
                  }
                  className={`
                    px-3.5 py-1.5
                    text-[9px]
                    uppercase
                    tracking-[0.15em]
                    font-semibold
                    border
                    transition-colors
                    whitespace-nowrap
                    shrink-0
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
              onClick={() =>
                setActiveCategory("all")
              }
              className={`
                px-4 py-2
                text-xs
                font-semibold
                border
                transition-colors
                whitespace-nowrap
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
                onClick={() =>
                  setActiveCategory(cat)
                }
                className={`
                  px-4 py-2
                  text-xs
                  font-semibold
                  border
                  transition-colors
                  whitespace-nowrap
                  uppercase
                  tracking-wider
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
                : `${results.length} destination${
                    results.length === 1
                      ? ""
                      : "s"
                  } found`}
            </p>

            <p className="text-[9px] uppercase tracking-[0.18em] text-[#6F6A61]">
              Showing{" "}
              <span className="text-[#234236] font-semibold">
                {ZONE_LABELS[activeZone] ||
                  "All India"}
              </span>
            </p>

          </div>

        </div>

      </section>

      {/* ===================================================
          TRAVEL INTELLIGENCE STRIP
      =================================================== */}

      <section className="relative border-b border-[#D8D1C5] overflow-hidden">

        <IndianOrnament
          variant="corner"
          color="#C66A4A"
          opacity={0.07}
          duration={80}
          reverse
          className="
            absolute
            -right-14
            -top-14
            w-60
            h-60
            rotate-180
            pointer-events-none
          "
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-6">

          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">

            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A] font-semibold">
              Travel Intelligence
            </p>

            <p className="text-[10px] text-[#6F6A61] tracking-wide">
              {results.length} destination
              {results.length === 1 ? "" : "s"} ·{" "}
              {regionCount} region
              {regionCount === 1 ? "" : "s"} ·
              live-style crowd signals
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

      {/* ===================================================
          IMPROVED INDIA MAP + DETAIL PANEL
      =================================================== */}

      <section
        ref={mapSectionRef}
        className="border-b border-[#D8D1C5]"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">

            {/* =================================================
                MAP
            ================================================= */}

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
                    <span className="w-2 h-2 rounded-full bg-[#234236]" />
                    Lower
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#9A6A18]" />
                    Moderate
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#A84E38]" />
                    Higher
                  </span>

                </div>

              </div>

              <div className="
                relative
                border
                border-[#D8D1C5]
                bg-[#EEE9DE]
                overflow-hidden
              ">

                <IndianOrnament
                  variant="floral"
                  color="#234236"
                  opacity={0.035}
                  duration={110}
                  className="
                    absolute
                    -right-28
                    -bottom-28
                    w-[420px]
                    h-[420px]
                    pointer-events-none
                  "
                />

                <Compass
                  size={22}
                  strokeWidth={1.2}
                  className="
                    absolute
                    top-5
                    right-5
                    z-20
                    text-[#234236]/30
                  "
                />

                {/* MAP AREA */}

                <div className="
                  relative
                  h-[560px]
                  sm:h-[620px]
                  overflow-hidden
                ">

                  {/* Subtle grid */}

                  <div
                    className="
                      absolute
                      inset-0
                      opacity-40
                      pointer-events-none
                    "
                    style={{
                      backgroundImage: `
                        linear-gradient(
                          to right,
                          rgba(35,66,54,0.06) 1px,
                          transparent 1px
                        ),
                        linear-gradient(
                          to bottom,
                          rgba(35,66,54,0.06) 1px,
                          transparent 1px
                        )
                      `,
                      backgroundSize:
                        "10% 10%",
                    }}
                  />

                  {/* Actual map-style SVG */}

                  <svg
                    viewBox="0 0 100 100"
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                    "
                    preserveAspectRatio="xMidYMid meet"
                  >

                    {/* India outline */}

                    <path
                      d="
                        M37 7
                        C41 6 44 7 47 9
                        C50 10 52 12 54 14
                        C57 14 59 16 61 18
                        C64 18 67 20 70 22
                        C72 24 74 26 77 28
                        C79 30 80 33 81 35
                        C84 36 86 39 87 42
                        C89 44 90 47 89 50
                        C90 53 89 56 87 58
                        C86 61 85 64 84 67
                        C83 70 81 72 79 74
                        C77 77 75 79 73 81
                        C72 84 70 86 68 88
                        C66 91 63 93 60 93
                        C57 95 54 97 51 97
                        C48 96 45 94 43 92
                        C40 91 38 88 36 86
                        C33 85 31 82 29 79
                        C27 76 25 73 24 70
                        C22 67 21 64 20 61
                        C18 59 17 56 17 53
                        C15 50 15 47 17 44
                        C17 41 19 38 21 36
                        C21 33 23 30 26 29
                        C27 26 29 23 31 21
                        C32 18 34 15 35 12
                        C35 10 36 8 37 7
                        Z
                      "
                      fill="#E6EBE3"
                      stroke="#234236"
                      strokeWidth="0.55"
                    />

                    {/* Northern mountain contour */}

                    <path
                      d="
                        M27 29
                        C33 27 36 24 40 23
                        C45 22 50 23 54 25
                        C58 24 63 24 67 27
                        C71 28 74 30 78 32
                      "
                      fill="none"
                      stroke="#234236"
                      strokeOpacity="0.20"
                      strokeWidth="0.35"
                    />

                    {/* Western regional divider */}

                    <path
                      d="
                        M31 30
                        C30 38 28 45 27 51
                        C26 58 28 64 31 70
                      "
                      fill="none"
                      stroke="#234236"
                      strokeOpacity="0.18"
                      strokeWidth="0.35"
                      strokeDasharray="1 1.5"
                    />

                    {/* Central divider */}

                    <path
                      d="
                        M46 24
                        C45 32 44 40 45 47
                        C47 54 48 62 47 70
                        C46 78 48 85 51 91
                      "
                      fill="none"
                      stroke="#234236"
                      strokeOpacity="0.18"
                      strokeWidth="0.35"
                      strokeDasharray="1 1.5"
                    />

                    {/* Eastern divider */}

                    <path
                      d="
                        M62 24
                        C61 33 63 42 65 49
                        C67 58 67 67 64 74
                        C63 81 65 86 68 88
                      "
                      fill="none"
                      stroke="#234236"
                      strokeOpacity="0.18"
                      strokeWidth="0.35"
                      strokeDasharray="1 1.5"
                    />

                    {/* Southern peninsula contours */}

                    <path
                      d="
                        M31 70
                        C36 68 42 69 47 72
                        C53 75 59 74 64 72
                      "
                      fill="none"
                      stroke="#C66A4A"
                      strokeOpacity="0.16"
                      strokeWidth="0.35"
                    />

                    {/* Decorative travel route */}

                    <path
                      d="
                        M43 30
                        C48 38 55 45 52 53
                        C49 60 44 63 48 70
                        C52 76 58 82 60 88
                      "
                      fill="none"
                      stroke="#C66A4A"
                      strokeOpacity="0.32"
                      strokeWidth="0.45"
                      strokeDasharray="1.2 1.8"
                    />

                    {/* Second route */}

                    <path
                      d="
                        M58 25
                        C62 34 63 42 60 49
                        C57 56 58 63 64 70
                      "
                      fill="none"
                      stroke="#234236"
                      strokeOpacity="0.16"
                      strokeWidth="0.35"
                      strokeDasharray="1 1.8"
                    />

                  </svg>

                  {/* Region labels */}

                  <span className="
                    absolute
                    left-[47%]
                    top-[16%]
                    -translate-x-1/2
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-[#234236]/35
                    pointer-events-none
                  ">
                    North
                  </span>

                  <span className="
                    absolute
                    left-[24%]
                    top-[47%]
                    -translate-x-1/2
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-[#234236]/35
                    pointer-events-none
                  ">
                    West
                  </span>

                  <span className="
                    absolute
                    left-[50%]
                    top-[49%]
                    -translate-x-1/2
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-[#234236]/35
                    pointer-events-none
                  ">
                    Central
                  </span>

                  <span className="
                    absolute
                    right-[18%]
                    top-[48%]
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-[#234236]/35
                    pointer-events-none
                  ">
                    East
                  </span>

                  <span className="
                    absolute
                    left-[50%]
                    bottom-[11%]
                    -translate-x-1/2
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-[#234236]/35
                    pointer-events-none
                  ">
                    South
                  </span>

                  <span className="
                    absolute
                    right-[14%]
                    top-[29%]
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-[#234236]/35
                    pointer-events-none
                  ">
                    N.East
                  </span>

                  {/* Destination markers */}

                  {destinations.map((item) => {

                    const isVisible =
                      results.some(
                        (result) =>
                          result.name ===
                          item.name
                      );

                    const isSelected =
                      selectedDestination?.name ===
                      item.name;

                    const isHovered =
                      hovered === item.name;

                    if (!item.coords) {
                      return null;
                    }

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          setSelected(item.name)
                        }
                        onMouseEnter={() =>
                          setHovered(item.name)
                        }
                        onMouseLeave={() =>
                          setHovered(null)
                        }
                        aria-label={`Select ${item.name}`}
                        style={{
                          left: `${item.coords.x}%`,
                          top: `${item.coords.y}%`,
                        }}
                        className="
                          absolute
                          -translate-x-1/2
                          -translate-y-1/2
                          z-10
                          flex
                          items-center
                          justify-center
                        "
                      >

                        {/* Outer pulse */}

                        {isSelected && (
                          <span
                            className="
                              absolute
                              w-8
                              h-8
                              rounded-full
                              border
                              border-[#C66A4A]
                              animate-ping
                              opacity-50
                            "
                          />
                        )}

                        {/* Hover ring */}

                        {isHovered &&
                          !isSelected && (
                            <span
                              className="
                                absolute
                                w-6
                                h-6
                                rounded-full
                                border
                                border-[#234236]/40
                              "
                            />
                          )}

                        {/* Marker */}

                        <span
                          className="
                            relative
                            flex
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-[#F5F1E8]
                            shadow-[0_2px_8px_rgba(35,66,54,0.18)]
                            transition-all
                            duration-300
                          "
                          style={{
                            width:
                              isSelected
                                ? "15px"
                                : "11px",
                            height:
                              isSelected
                                ? "15px"
                                : "11px",
                            background:
                              isSelected
                                ? "#C66A4A"
                                : crowdTone(
                                    item.crowd
                                  ).hex,
                            opacity:
                              isVisible
                                ? 1
                                : 0.25,
                            transform:
                              isHovered
                                ? "scale(1.25)"
                                : "scale(1)",
                          }}
                        />

                        {/* Tooltip */}

                        {(isHovered ||
                          isSelected) && (
                          <span
                            className="
                              absolute
                              bottom-full
                              mb-3
                              left-1/2
                              -translate-x-1/2
                              whitespace-nowrap
                              px-3
                              py-2
                              bg-[#234236]
                              text-[#F5F1E8]
                              text-[9px]
                              uppercase
                              tracking-[0.12em]
                              font-semibold
                              shadow-lg
                              pointer-events-none
                              z-30
                            "
                          >
                            {item.name}
                            <span className="opacity-60">
                              {" "}
                              ·{" "}
                              {item.crowd}%
                            </span>
                          </span>
                        )}

                      </button>
                    );
                  })}

                  {/* Map legend */}

                  <div className="
                    absolute
                    bottom-4
                    left-4
                    right-4
                    flex
                    flex-col
                    sm:flex-row
                    items-start
                    sm:items-end
                    justify-between
                    gap-3
                    pointer-events-none
                  ">

                    <div className="
                      bg-[#F5F1E8]/95
                      px-4
                      py-3
                      border
                      border-[#D8D1C5]
                      shadow-sm
                    ">

                      <p className="
                        text-[8px]
                        uppercase
                        tracking-[0.18em]
                        text-[#6F6A61]
                        mb-2
                      ">
                        Crowd signal
                      </p>

                      <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-4
                      ">

                        <span className="
                          flex
                          items-center
                          gap-1.5
                          text-[9px]
                          uppercase
                          tracking-wider
                          text-[#6F6A61]
                        ">
                          <span className="
                            w-2
                            h-2
                            rounded-full
                            bg-[#234236]
                          />
                          Lower
                        </span>

                        <span className="
                          flex
                          items-center
                          gap-1.5
                          text-[9px]
                          uppercase
                          tracking-wider
                          text-[#6F6A61]
                        ">
                          <span className="
                            w-2
                            h-2
                            rounded-full
                            bg-[#9A6A18]
                          />
                          Moderate
                        </span>

                        <span className="
                          flex
                          items-center
                          gap-1.5
                          text-[9px]
                          uppercase
                          tracking-wider
                          text-[#6F6A61]
                        ">
                          <span className="
                            w-2
                            h-2
                            rounded-full
                            bg-[#A84E38]
                          />
                          Higher
                        </span>

                      </div>
                    </div>

                    <span className="
                      text-[8px]
                      uppercase
                      tracking-[0.16em]
                      text-[#6F6A61]
                      bg-[#F5F1E8]/90
                      px-3
                      py-2
                      border
                      border-[#D8D1C5]
                    ">
                      Indicative positions
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                DETAIL PANEL
            ================================================= */}

            <div className="
              border
              border-[#D8D1C5]
              bg-[#F5F1E8]
              p-8
              lg:p-10
              flex
              flex-col
            ">

              {selectedDestination ? (
                <React.Fragment
                  key={
                    selectedDestination.name
                  }
                >

                  {/* Image */}

                  <div className="
                    relative
                    h-44
                    -mx-8
                    -mt-8
                    lg:-mx-10
                    lg:-mt-10
                    mb-8
                    overflow-hidden
                  ">

                    <img
                      src={
                        selectedDestination.image
                      }
                      alt={
                        selectedDestination.name
                      }
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        animate-[fadeIn_0.5s_ease-out]
                      "
                    />

                    <div className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#234236]/85
                      to-transparent
                    " />

                    <div className="
                      absolute
                      bottom-4
                      left-6
                    ">

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        text-[#F5F1E8]/70
                      ">
                        Destination intelligence
                      </p>

                      <h2 className="
                        font-editorial
                        text-4xl
                        text-[#F5F1E8]
                        mt-1
                      ">
                        {selectedDestination.name}

                        <span className="
                          text-lg
                          text-[#F5F1E8]/60
                          font-sans
                          italic
                        ">
                          {" "}
                          /{" "}
                          {
                            selectedDestination.region
                          }
                        </span>
                      </h2>

                    </div>

                  </div>

                  {/* Category */}

                  <span className="
                    inline-block
                    w-fit
                    px-2.5
                    py-1
                    bg-[#234236]/8
                    text-[#234236]
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-semibold
                    mb-6
                  ">
                    {selectedDestination.category}
                  </span>

                  {/* Main metrics */}

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-6
                      pb-6
                      border-b
                      border-[#D8D1C5]
                      animate-[fadeIn_0.6s_ease-out]
                    "
                  >

                    <div>

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        text-[#6F6A61]
                      ">
                        Crowd level
                      </p>

                      <p className="
                        font-editorial
                        text-3xl
                        text-[#234236]
                        mt-1
                      ">
                        {
                          selectedDestination.crowd
                        }%
                      </p>

                      <p
                        className={`
                          text-xs
                          font-semibold
                          mb-2
                          ${
                            crowdTone(
                              selectedDestination.crowd
                            ).className
                          }
                        `}
                      >
                        {
                          crowdTone(
                            selectedDestination.crowd
                          ).label
                        }
                      </p>

                      <CrowdBar
                        value={
                          selectedDestination.crowd
                        }
                      />

                      <p className="
                        text-[10px]
                        text-[#6F6A61]
                        mt-2
                        leading-relaxed
                      ">
                        {
                          crowdNote(
                            selectedDestination.crowd
                          )
                        }
                      </p>

                    </div>

                    <div>

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        text-[#6F6A61]
                      ">
                        Safety
                      </p>

                      <p className="
                        font-editorial
                        text-3xl
                        text-[#234236]
                        mt-1
                      ">
                        {
                          selectedDestination.safety
                        }

                        <span className="
                          text-base
                          text-[#6F6A61]
                        ">
                          /100
                        </span>
                      </p>

                    </div>

                    <div>

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        text-[#6F6A61]
                      ">
                        Best time
                      </p>

                      <p className="
                        text-sm
                        font-semibold
                        text-[#234236]
                        mt-2
                      ">
                        {
                          selectedDestination.bestTime
                        }
                      </p>

                    </div>

                    <div>

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        text-[#6F6A61]
                        flex
                        items-center
                        gap-1.5
                      ">
                        <MapPin size={11} />
                        Nearby
                      </p>

                      <p className="
                        text-sm
                        font-semibold
                        text-[#234236]
                        mt-2
                      ">
                        {
                          selectedDestination.distance
                        }
                      </p>

                    </div>

                  </div>

                  {/* Timeline */}

                  <div
                    className="
                      py-6
                      border-b
                      border-[#D8D1C5]
                      animate-[fadeIn_0.6s_ease-out]
                    "
                  >
                    <BestTimeTimeline
                      bestTime={
                        selectedDestination.bestTime
                      }
                    />
                  </div>

                  {/* Alternative */}

                  <div
                    className="
                      py-6
                      border-b
                      border-[#D8D1C5]
                      animate-[fadeIn_0.6s_ease-out]
                    "
                  >

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-[0.16em]
                      text-[#6F6A61]
                      mb-4
                    ">
                      Smart alternative
                    </p>

                    <div className="
                      grid
                      grid-cols-2
                      gap-4
                    ">

                      <div className="
                        border
                        border-[#D8D1C5]
                        bg-white/60
                        p-4
                      ">

                        <p className="
                          text-[9px]
                          uppercase
                          tracking-[0.14em]
                          text-[#6F6A61]
                        ">
                          When it's busy
                        </p>

                        <p className="
                          font-editorial
                          text-lg
                          text-[#234236]
                          mt-1.5
                        ">
                          {
                            selectedDestination.name
                          }
                        </p>

                        <p
                          className={`
                            text-xs
                            font-semibold
                            mt-1
                            ${
                              crowdTone(
                                selectedDestination.crowd
                              ).className
                            }
                          `}
                        >
                          {
                            selectedDestination.crowd
                          }% crowd
                        </p>

                      </div>

                      <div className="
                        border
                        border-[#234236]
                        bg-[#234236]
                        text-white
                        p-4
                      ">

                        <p className="
                          text-[9px]
                          uppercase
                          tracking-[0.14em]
                          text-[#C9D2C5]
                        ">
                          Try instead
                        </p>

                        <p className="
                          font-editorial
                          text-lg
                          mt-1.5
                        ">
                          {
                            selectedDestination.alternative
                          }
                        </p>

                        <p className="
                          text-xs
                          font-semibold
                          mt-1
                          text-[#C9D2C5]
                        ">
                          {
                            selectedDestination.altCrowd
                          }%
                          predicted crowd
                        </p>

                      </div>

                    </div>

                    {selectedDestination.crowd >
                      0 && (
                      <p className="
                        text-xs
                        text-[#C66A4A]
                        font-semibold
                        mt-3
                        flex
                        items-center
                        gap-1.5
                      ">

                        <ArrowRight
                          size={12}
                          className="rotate-90"
                        />

                        {Math.round(
                          (
                            (
                              selectedDestination.crowd -
                              selectedDestination.altCrowd
                            ) /
                            selectedDestination.crowd
                          ) * 100
                        )}
                        % quieter

                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setAltOpen(
                          (v) => !v
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        mt-4
                        text-xs
                        font-semibold
                        text-[#234236]
                        hover:text-[#C66A4A]
                        transition-colors
                      "
                    >

                      Explore alternative

                      <ChevronDown
                        size={14}
                        className={`
                          transition-transform
                          duration-300
                          ${
                            altOpen
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      />

                    </button>

                    <div
                      className={`
                        overflow-hidden
                        transition-all
                        duration-[400ms]
                        ease-out
                        ${
                          altOpen
                            ? "max-h-40 opacity-100 mt-3"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >

                      <div className="
                        border
                        border-[#D8D1C5]
                        bg-white/70
                        p-4
                      ">

                        <p className="
                          text-xs
                          text-[#6F6A61]
                          leading-relaxed
                        ">
                          {
                            selectedDestination.altReason
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Why BeyondMaps */}

                  <div
                    className="
                      py-6
                      flex-1
                      animate-[fadeIn_0.6s_ease-out]
                    "
                  >

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-[0.16em]
                      text-[#6F6A61]
                      mb-3
                    ">
                      Why BeyondMaps?
                    </p>

                    <ul className="space-y-2">

                      {recommendationReasons(
                        selectedDestination
                      ).map(
                        (reason, i) => (

                          <li
                            key={reason}
                            className="
                              flex
                              items-center
                              gap-2.5
                              text-sm
                              text-[#24231F]
                              animate-[fadeIn_0.4s_ease-out]
                            "
                            style={{
                              animationDelay: `${
                                280 +
                                i * 90
                              }ms`,
                            }}
                          >

                            <Check
                              size={14}
                              className="
                                text-[#234236]
                                shrink-0
                              "
                            />

                            {reason}

                          </li>

                        )
                      )}

                    </ul>

                  </div>

                  {/* CTA */}

                  <Link
                    to="/plan-my-trip"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-3
                      mt-2
                      px-6
                      py-4
                      bg-[#234236]
                      text-[#F5F1E8]
                      text-xs
                      uppercase
                      tracking-[0.15em]
                      font-semibold
                      hover:bg-[#1a3229]
                      transition-colors
                    "
                  >
                    Plan This Destination
                    <span>→</span>
                  </Link>

                </React.Fragment>
              ) : (
                <p className="
                  text-sm
                  text-[#6F6A61]
                ">
                  Select a destination to see its details.
                </p>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          RESULTS GRID
      =================================================== */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="
            flex
            items-end
            justify-between
            flex-wrap
            gap-4
            mb-10
          ">

            <div>

              <p className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-[#C66A4A]
                font-semibold
                mb-2
              ">
                Destinations
              </p>

              <div className="
                flex
                items-baseline
                gap-3
              ">

                <span className="
                  font-editorial
                  text-5xl
                  text-[#234236]
                ">
                  {String(
                    results.length
                  ).padStart(2, "0")}
                </span>

                <span className="
                  text-xs
                  uppercase
                  tracking-[0.15em]
                  text-[#6F6A61]
                ">
                  Destination
                  {results.length === 1
                    ? ""
                    : "s"}{" "}
                  in view
                </span>

              </div>

            </div>

          </div>

          {/* QUIETER PICKS */}

          {quieterPicks.length > 0 && (

            <RevealOnScroll className="mb-14">

              <div className="
                flex
                items-center
                gap-4
                mb-5
              ">

                <IndianOrnament
                  variant="divider"
                  spin={false}
                  color="#234236"
                  opacity={0.18}
                  className="
                    w-24
                    h-auto
                    hidden
                    sm:block
                  "
                />

                <div>

                  <p className="
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-[#C66A4A]
                    font-semibold
                  ">
                    Quieter picks
                  </p>

                  <p className="
                    text-xs
                    text-[#6F6A61]
                    mt-1
                  ">
                    Places worth looking at before
                    the obvious ones.
                  </p>

                </div>

              </div>

              <div className="
                grid
                sm:grid-cols-3
                gap-4
              ">

                {quieterPicks.map(
                  (item) => (

                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        selectAndScroll(
                          item.name
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-4
                        border
                        border-[#D8D1C5]
                        bg-white
                        p-3
                        text-left
                        hover:border-[#234236]
                        transition-colors
                        group
                      "
                    >

                      <div className="
                        w-16
                        h-16
                        shrink-0
                        overflow-hidden
                      ">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-110
                          "
                        />

                      </div>

                      <div className="
                        min-w-0
                      ">

                        <p className="
                          font-editorial
                          text-lg
                          text-[#234236]
                          truncate
                        ">
                          {item.name}
                        </p>

                        <p className="
                          text-[11px]
                          text-[#234236]
                          font-semibold
                          mt-0.5
                        ">
                          {item.crowd}% ·{" "}
                          {
                            crowdTone(
                              item.crowd
                            ).label
                          } crowd
                        </p>

                      </div>

                    </button>

                  )
                )}

              </div>

            </RevealOnScroll>

          )}

          {/* NO RESULTS */}

          {results.length === 0 ? (

            <div className="
              border
              border-dashed
              border-[#D8D1C5]
              py-20
              text-center
            ">

              <p className="
                font-editorial
                text-3xl
                text-[#234236]
                mb-2
              ">
                Not on the map — yet.
              </p>

              <p className="
                text-sm
                text-[#6F6A61]
                mb-6
              ">
                No destination matched that search.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  text-xs
                  font-semibold
                  text-[#C66A4A]
                  hover:text-[#234236]
                  transition-colors
                  inline-flex
                  items-center
                  gap-2
                "
              >
                Clear search
                <ArrowRight size={12} />
              </button>

            </div>

          ) : (

            /* DESTINATION CARDS */

            <div className="
              grid
              sm:grid-cols-2
              lg:grid-cols-3
              gap-0
              border-l
              border-t
              border-[#D8D1C5]
            ">

              {results.map(
                (item, idx) => {

                  const tone =
                    crowdTone(
                      item.crowd
                    );

                  const isSelected =
                    selectedDestination?.name ===
                    item.name;

                  return (

                    <RevealOnScroll
                      key={item.name}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          selectAndScroll(
                            item.name
                          )
                        }
                        className={`
                          group
                          relative
                          w-full
                          text-left
                          border-r
                          border-b
                          border-[#D8D1C5]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          ${
                            isSelected
                              ? "bg-[#EEE9DE]"
                              : "hover:bg-[#EEE9DE]/60"
                          }
                        `}
                        style={{
                          transitionDelay: `${Math.min(
                            idx,
                            8
                          ) * 60}ms`,
                        }}
                      >

                        <div className="
                          relative
                          h-48
                          overflow-hidden
                        ">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="
                              w-full
                              h-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-105
                            "
                          />

                          <div className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#234236]/70
                            to-transparent
                          " />

                          <span className="
                            absolute
                            top-3
                            left-3
                            px-2
                            py-1
                            bg-[#F5F1E8]/90
                            text-[#234236]
                            text-[9px]
                            uppercase
                            tracking-wider
                            font-semibold
                          ">
                            {item.category}
                          </span>

                          <h3 className="
                            absolute
                            bottom-3
                            left-4
                            font-editorial
                            text-2xl
                            text-[#F5F1E8]
                          ">
                            {item.name}
                          </h3>

                        </div>

                        <div className="p-5">

                          <div className="
                            flex
                            items-center
                            justify-between
                            text-xs
                            mb-2
                          ">

                            <span className="
                              text-[#6F6A61]
                            ">
                              Crowd&nbsp;

                              <span
                                className={`
                                  font-semibold
                                  ${tone.className}
                                `}
                              >
                                {item.crowd}% ·{" "}
                                {tone.label}
                              </span>

                            </span>

                            <span className="
                              text-[#6F6A61]
                            ">
                              Safety{" "}

                              <span className="
                                font-semibold
                                text-[#234236]
                              ">
                                {item.safety}
                              </span>

                            </span>

                          </div>

                          <CrowdBar
                            value={
                              item.crowd
                            }
                            height="h-1"
                          />

                          <p className="
                            text-xs
                            text-[#C66A4A]
                            font-semibold
                            mt-3
                            flex
                            items-center
                            gap-1.5
                          ">

                            Alt:{" "}
                            {item.alternative}

                            <ArrowRight
                              size={12}
                              className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                              "
                            />

                          </p>

                        </div>

                      </button>

                    </RevealOnScroll>

                  );
                }
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}
