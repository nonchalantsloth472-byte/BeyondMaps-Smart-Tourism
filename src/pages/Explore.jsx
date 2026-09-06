import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import IndianOrnament from "../components/IndianOrnament";
import {
  destinations,
  ZONE_FILTERS,
  CATEGORY_FILTERS,
} from "../data/destinations";

function crowdTone(crowd) {
  if (crowd <= 35) return { label: "Low", className: "text-[#234236]" };
  if (crowd <= 65) return { label: "Moderate", className: "text-[#9A6A18]" };
  return { label: "High", className: "text-[#A84E38]" };
}

export default function Explore() {
  const [query, setQuery] = useState("");
  const [activeZone, setActiveZone] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState(destinations[0].name);
  const [hovered, setHovered] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return destinations.filter((item) => {
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
  }, [query, activeZone, activeCategory]);

  const selectedDestination =
    results.find((item) => item.name === selected) ||
    destinations.find((item) => item.name === selected) ||
    results[0];

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

            <div className="flex flex-wrap gap-2">
              {ZONE_FILTERS.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZone(zone.id)}
                  className={`
                    px-3.5 py-1.5 text-[9px] uppercase tracking-[0.15em] font-semibold
                    border transition-colors whitespace-nowrap
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

          <p className="text-xs text-[#6F6A61] mt-6">
            {results.length === 0
              ? "No destinations found. Try another search."
              : `${results.length} destination${results.length === 1 ? "" : "s"} found`}
          </p>

        </div>

      </section>


      {/* =====================================================
          MAP + DETAIL PANEL
      ===================================================== */}

      <section className="border-b border-[#D8D1C5]">

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">

            {/* MOCK INDIA MAP */}
            <div className="relative border border-[#D8D1C5] bg-[#EEE9DE]/50 aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[560px] overflow-hidden">

              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Stylised India silhouette — not geographically precise,
                    just enough to read as "a map of India" */}
                <path
                  d="M45 4 C55 4 58 10 60 16 C64 18 70 20 74 26 C78 32 76 38 80 42
                     C86 46 88 54 84 60 C82 66 84 72 78 76 C74 82 68 82 64 88
                     C60 94 52 96 46 92 C40 96 32 92 30 86 C24 82 20 74 22 68
                     C16 64 14 56 18 50 C16 44 20 38 26 36 C28 28 34 24 38 18
                     C38 12 40 6 45 4Z"
                  fill="#234236"
                  fillOpacity="0.06"
                  stroke="#234236"
                  strokeOpacity="0.25"
                  strokeWidth="0.6"
                />
              </svg>

              {destinations.map((item) => {
                const isVisible = results.some((r) => r.name === item.name);
                const isSelected = selectedDestination?.name === item.name;
                const isHovered = hovered === item.name;

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
                      left: `${item.coords.x}%`,
                      top: `${item.coords.y}%`,
                    }}
                    className={`
                      absolute -translate-x-1/2 -translate-y-1/2
                      flex items-center justify-center
                      transition-all duration-300
                      ${isVisible ? "opacity-100" : "opacity-25"}
                    `}
                  >
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
                    {isSelected && (
                      <span className="absolute w-6 h-6 rounded-full border border-[#C66A4A] animate-pulse" />
                    )}

                    {(isHovered || isSelected) && (
                      <span
                        className="
                          absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                          whitespace-nowrap px-2.5 py-1 bg-[#234236] text-[#F5F1E8]
                          text-[10px] uppercase tracking-wider font-semibold
                        "
                      >
                        {item.name} · {item.crowd}%
                      </span>
                    )}
                  </button>
                );
              })}

              <p className="absolute bottom-3 right-4 text-[9px] uppercase tracking-[0.15em] text-[#6F6A61]">
                Stylised map · not to scale
              </p>

            </div>

            {/* DETAIL PANEL */}
            <div className="border border-[#D8D1C5] bg-[#F5F1E8] p-8 lg:p-10 flex flex-col">

              {selectedDestination ? (
                <>
                  <div className="relative h-44 -mx-8 -mt-8 lg:-mx-10 lg:-mt-10 mb-8 overflow-hidden">
                    <img
                      key={selectedDestination.name}
                      src={selectedDestination.image}
                      alt={selectedDestination.name}
                      className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_0.5s_ease-out]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#234236]/85 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#F5F1E8]/70">
                        {selectedDestination.region}
                      </p>
                      <h2 className="font-editorial text-4xl text-[#F5F1E8] mt-1">
                        {selectedDestination.name}
                      </h2>
                    </div>
                  </div>

                  <span className="inline-block w-fit px-2.5 py-1 bg-[#234236]/8 text-[#234236] text-[10px] uppercase tracking-wider font-semibold mb-6">
                    {selectedDestination.category}
                  </span>

                  <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[#D8D1C5]">

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61]">
                        Crowd
                      </p>
                      <p className="font-editorial text-3xl text-[#234236] mt-1">
                        {selectedDestination.crowd}%
                      </p>
                      <p className={`text-xs font-semibold ${crowdTone(selectedDestination.crowd).className}`}>
                        {crowdTone(selectedDestination.crowd).label}
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
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61]">
                        Suggested duration
                      </p>
                      <p className="text-sm font-semibold text-[#234236] mt-2">
                        {selectedDestination.duration}
                      </p>
                    </div>

                  </div>

                  <div className="py-6 flex-1">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6A61]">
                      Smart alternative
                    </p>
                    <p className="text-sm font-semibold text-[#234236] mt-2">
                      {selectedDestination.alternative}
                    </p>
                    <p className="text-xs text-[#6F6A61] leading-relaxed mt-2">
                      {selectedDestination.description}
                    </p>
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
                </>
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

          {results.length === 0 ? (
            <div className="border border-dashed border-[#D8D1C5] py-20 text-center">
              <p className="font-editorial text-3xl text-[#234236] mb-2">
                No destinations found.
              </p>
              <p className="text-sm text-[#6F6A61]">
                Try another search or a different filter.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-[#D8D1C5]">
              {results.map((item) => {
                const tone = crowdTone(item.crowd);
                const isSelected = selectedDestination?.name === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelected(item.name)}
                    className={`
                      group relative text-left border-r border-b border-[#D8D1C5]
                      transition-colors
                      ${isSelected ? "bg-[#EEE9DE]" : "hover:bg-[#EEE9DE]/60"}
                    `}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                      <div className="flex items-center justify-between text-xs">
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

                      <p className="text-xs text-[#C66A4A] font-semibold mt-3">
                        Alt: {item.alternative} →
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        </div>

      </section>

    </main>
  );
}
