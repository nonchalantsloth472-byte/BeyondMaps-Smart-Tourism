import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MapPin,
  Users,
  TrendingDown,
  Shuffle,
  Heart,
  ArrowRight,
} from "lucide-react";
import IndianOrnament from "../components/IndianOrnament";
import RevealOnScroll from "../components/RevealOnScroll";
import SpotlightCard from "../components/SpotlightCard";

/* =========================================================
   CITY DATA — unchanged from the original dashboard
========================================================= */

const cityData = {
  Jaipur: {
    popular: "Amber Fort",
    popularCrowd: 89,
    alternative: "Jaigarh Fort",
    alternativeCrowd: 31,
    forecast: [
      { time: "10 AM", crowd: 42 },
      { time: "11 AM", crowd: 55 },
      { time: "12 PM", crowd: 71 },
      { time: "1 PM", crowd: 89 },
      { time: "2 PM", crowd: 94 },
      { time: "3 PM", crowd: 86 },
      { time: "4 PM", crowd: 68 },
      { time: "5 PM", crowd: 51 },
    ],
    reduction: "26%",
    distribution: "2.4×",
    localImpact: "18%",
  },

  Jodhpur: {
    popular: "Mehrangarh Fort",
    popularCrowd: 82,
    alternative: "Jaswant Thada",
    alternativeCrowd: 36,
    forecast: [
      { time: "10 AM", crowd: 38 },
      { time: "11 AM", crowd: 49 },
      { time: "12 PM", crowd: 63 },
      { time: "1 PM", crowd: 76 },
      { time: "2 PM", crowd: 91 },
      { time: "3 PM", crowd: 85 },
      { time: "4 PM", crowd: 69 },
      { time: "5 PM", crowd: 48 },
    ],
    reduction: "22%",
    distribution: "2.1×",
    localImpact: "16%",
  },

  Udaipur: {
    popular: "City Palace",
    popularCrowd: 78,
    alternative: "Sajjangarh",
    alternativeCrowd: 34,
    forecast: [
      { time: "10 AM", crowd: 35 },
      { time: "11 AM", crowd: 47 },
      { time: "12 PM", crowd: 61 },
      { time: "1 PM", crowd: 73 },
      { time: "2 PM", crowd: 88 },
      { time: "3 PM", crowd: 81 },
      { time: "4 PM", crowd: 64 },
      { time: "5 PM", crowd: 45 },
    ],
    reduction: "24%",
    distribution: "2.2×",
    localImpact: "17%",
  },

  Jaisalmer: {
    popular: "Jaisalmer Fort",
    popularCrowd: 86,
    alternative: "Patwon Ki Haveli",
    alternativeCrowd: 39,
    forecast: [
      { time: "10 AM", crowd: 44 },
      { time: "11 AM", crowd: 57 },
      { time: "12 PM", crowd: 70 },
      { time: "1 PM", crowd: 83 },
      { time: "2 PM", crowd: 92 },
      { time: "3 PM", crowd: 79 },
      { time: "4 PM", crowd: 61 },
      { time: "5 PM", crowd: 43 },
    ],
    reduction: "21%",
    distribution: "2.0×",
    localImpact: "15%",
  },

  Pushkar: {
    popular: "Pushkar Lake",
    popularCrowd: 67,
    alternative: "Savitri Mata Temple",
    alternativeCrowd: 29,
    forecast: [
      { time: "10 AM", crowd: 31 },
      { time: "11 AM", crowd: 43 },
      { time: "12 PM", crowd: 56 },
      { time: "1 PM", crowd: 64 },
      { time: "2 PM", crowd: 72 },
      { time: "3 PM", crowd: 66 },
      { time: "4 PM", crowd: 52 },
      { time: "5 PM", crowd: 39 },
    ],
    reduction: "20%",
    distribution: "1.9×",
    localImpact: "14%",
  },

  Ranthambore: {
    popular: "Ranthambore Fort",
    popularCrowd: 61,
    alternative: "Tiger Safari Zone",
    alternativeCrowd: 25,
    forecast: [
      { time: "10 AM", crowd: 28 },
      { time: "11 AM", crowd: 36 },
      { time: "12 PM", crowd: 49 },
      { time: "1 PM", crowd: 58 },
      { time: "2 PM", crowd: 65 },
      { time: "3 PM", crowd: 59 },
      { time: "4 PM", crowd: 44 },
      { time: "5 PM", crowd: 32 },
    ],
    reduction: "19%",
    distribution: "1.8×",
    localImpact: "13%",
  },
};

/* Mood imagery per region — reuses the same photo pool already
   trusted elsewhere in the app (see data/destinations.js) rather
   than introducing new, unverified image sources. */
const cityImages = {
  Jaipur:
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
  Jodhpur:
    "https://images.unsplash.com/photo-1767633994425-0eb9a3f20671?auto=format&fit=crop&w=1200&q=85",
  Udaipur:
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85",
  Jaisalmer:
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
  Pushkar:
    "https://images.unsplash.com/photo-1609276804051-8c5e906cc430?auto=format&fit=crop&w=1200&q=85",
  Ranthambore:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85",
};

function Dashboard() {
  const [selectedCity, setSelectedCity] = useState("Jaipur");

  const data = cityData[selectedCity];

  const lessCrowded = Math.round(
    ((data.popularCrowd - data.alternativeCrowd) / data.popularCrowd) * 100
  );

  return (
    <main className="bg-[#F5F1E8] text-[#24231F] overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#C9D2C5] border-b border-[#D8D1C5]">

        <IndianOrnament
          variant="corner"
          color="#234236"
          opacity={0.1}
          duration={68}
          className="absolute -left-16 -top-10 w-96 h-96 pointer-events-none"
        />

        <IndianOrnament
          variant="corner"
          color="#C66A4A"
          opacity={0.08}
          duration={80}
          reverse
          className="absolute -right-20 -bottom-16 w-72 h-72 rotate-180 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

            <RevealOnScroll>

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C66A4A] font-semibold mb-6">
                Tourism Intelligence
              </p>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#234236]">
                See the story
                <br />
                <span className="italic text-[#24231F]">
                  behind the journey.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-base leading-relaxed text-[#6F6A61]">
                Understand visitor movement, crowd patterns and how
                smarter recommendations create better travel experiences
                across Rajasthan.
              </p>

              <div className="mt-9 flex items-center gap-4 flex-wrap">

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#234236] font-semibold flex items-center gap-2">
                  <MapPin size={14} strokeWidth={1.75} />
                  Explore region
                </span>

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="
                    bg-white border border-[#D8D1C5]
                    text-[#234236] text-sm font-semibold
                    px-5 py-3 pr-9
                    outline-none cursor-pointer
                    focus:border-[#234236]
                    transition-colors
                  "
                >
                  {Object.keys(cityData).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

              </div>

              <div className="mt-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C66A4A] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#6F6A61]">
                  {selectedCity} · Visitor activity updated continuously
                </span>
              </div>

            </RevealOnScroll>

            <RevealOnScroll className="lg:pt-4">

              <SpotlightCard>
                <div className="relative border border-[#D8D1C5] bg-[#F5F1E8] p-2">
                  <div className="relative h-[380px] lg:h-[440px] overflow-hidden">
                    <img
                      key={selectedCity}
                      src={cityImages[selectedCity]}
                      alt={selectedCity}
                      className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_0.7s_ease-out]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#234236]/85 via-[#234236]/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#F5F1E8]/70">
                        Currently viewing
                      </p>
                      <h2 className="font-editorial text-4xl text-[#F5F1E8] mt-2">
                        {selectedCity}
                      </h2>

                      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#F5F1E8]/25 pt-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-[#F5F1E8]/50">
                            {data.popular}
                          </p>
                          <p className="font-editorial text-2xl text-[#F5F1E8] mt-1">
                            {data.popularCrowd}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-[#F5F1E8]/50">
                            {data.alternative}
                          </p>
                          <p className="font-editorial text-2xl text-[#F5F1E8] mt-1">
                            {data.alternativeCrowd}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>

            </RevealOnScroll>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS STRIP
      ===================================================== */}

      <section className="border-b border-[#D8D1C5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll>
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D8D1C5] py-12">

              <div className="sm:pr-10 pb-8 sm:pb-0">
                <MapPin size={18} strokeWidth={1.5} className="text-[#6F6A61] mb-3" />
                <h2 className="font-editorial text-4xl text-[#234236]">
                  {Object.keys(cityData).length}
                </h2>
                <p className="text-sm text-[#6F6A61] mt-1">
                  Destinations tracked
                </p>
              </div>

              <div className="sm:px-10 py-8 sm:py-0">
                <Users size={18} strokeWidth={1.5} className="text-[#C66A4A] mb-3" />
                <h2 className="font-editorial text-4xl text-[#C66A4A]">
                  {data.popularCrowd}%
                </h2>
                <p className="text-sm text-[#6F6A61] mt-1">
                  {data.popular} crowd level
                </p>
              </div>

              <div className="sm:pl-10 pt-8 sm:pt-0">
                <Users size={18} strokeWidth={1.5} className="text-[#234236] mb-3" />
                <h2 className="font-editorial text-4xl text-[#234236]">
                  {data.alternativeCrowd}%
                </h2>
                <p className="text-sm text-[#6F6A61] mt-1">
                  {data.alternative} crowd level
                </p>
              </div>

            </div>
          </RevealOnScroll>
        </div>
      </section>


      {/* =====================================================
          CROWD FORECAST
      ===================================================== */}

      <section className="py-24 border-b border-[#D8D1C5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <RevealOnScroll>
            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-end mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Crowd Forecast
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                  When should
                  <br />
                  <span className="italic text-[#24231F]">you visit?</span>
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#6F6A61]">
                Predicted visitor density at {data.popular} throughout the
                day, built from patterns in footfall, season and time.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="relative bg-white border border-[#D8D1C5] p-6 lg:p-10">

              <IndianOrnament
                variant="divider"
                color="#234236"
                opacity={0.14}
                spin={false}
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-64 h-auto pointer-events-none"
              />

              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data.forecast}>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#6F6A61", fontSize: 12 }}
                    axisLine={{ stroke: "#D8D1C5" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#6F6A61", fontSize: 12 }}
                    axisLine={{ stroke: "#D8D1C5" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#F5F1E8",
                      border: "1px solid #D8D1C5",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="crowd"
                    stroke="#234236"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#C66A4A", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#C66A4A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </RevealOnScroll>

        </div>
      </section>


      {/* =====================================================
          SMART REDISTRIBUTION
      ===================================================== */}

      <section className="py-24 border-b border-[#D8D1C5] bg-[#E6EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <RevealOnScroll>
            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-end mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Smart Redistribution
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                  Go where the
                  <br />
                  <span className="italic text-[#24231F]">crowds aren't.</span>
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#6F6A61]">
                When popular attractions become overcrowded, BeyondMaps
                surfaces nearby alternatives so visitors can explore more
                comfortably — and local businesses see more footfall too.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-stretch">

              <SpotlightCard className="border border-[#D8D1C5] bg-white p-9">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6F6A61] flex items-center gap-2">
                  <Users size={14} strokeWidth={1.75} />
                  Popular attraction
                </p>
                <h3 className="font-editorial text-3xl text-[#234236] mt-4">
                  {data.popular}
                </h3>
                <p className="font-editorial text-5xl text-[#C66A4A] mt-6">
                  {data.popularCrowd}%
                </p>
                <p className="text-sm text-[#6F6A61] mt-1">
                  Current crowd level
                </p>
              </SpotlightCard>

              <div className="hidden lg:flex items-center justify-center text-[#C66A4A]">
                <ArrowRight size={28} strokeWidth={1.5} />
              </div>
              <div className="flex lg:hidden items-center justify-center text-[#C66A4A] py-2">
                <ArrowRight size={22} strokeWidth={1.5} className="rotate-90" />
              </div>

              <SpotlightCard className="border border-[#234236] bg-[#234236] text-white p-9">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9D2C5] flex items-center gap-2">
                  <MapPin size={14} strokeWidth={1.75} />
                  Recommended alternative
                </p>
                <h3 className="font-editorial text-3xl mt-4">
                  {data.alternative}
                </h3>
                <p className="font-editorial text-5xl mt-6">
                  {data.alternativeCrowd}%
                </p>
                <p className="text-sm text-[#C9D2C5] mt-1">
                  {lessCrowded}% less crowded
                </p>
              </SpotlightCard>

            </div>
          </RevealOnScroll>

        </div>
      </section>


      {/* =====================================================
          TOURISM IMPACT
      ===================================================== */}

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <RevealOnScroll>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
              Tourism Impact
            </p>
            <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 mb-14 leading-[0.95]">
              Better journeys.
              <br />
              <span className="italic text-[#24231F]">Better destinations.</span>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid sm:grid-cols-3 gap-8">

              <div className="border-t-2 border-[#234236] pt-6">
                <TrendingDown size={18} strokeWidth={1.5} className="text-[#234236] mb-4" />
                <h3 className="font-editorial text-4xl text-[#234236]">
                  {data.reduction}
                </h3>
                <p className="text-sm text-[#6F6A61] mt-2">
                  Potential reduction in crowd concentration
                </p>
              </div>

              <div className="border-t-2 border-[#234236] pt-6">
                <Shuffle size={18} strokeWidth={1.5} className="text-[#234236] mb-4" />
                <h3 className="font-editorial text-4xl text-[#234236]">
                  {data.distribution}
                </h3>
                <p className="text-sm text-[#6F6A61] mt-2">
                  More balanced visitor distribution
                </p>
              </div>

              <div className="border-t-2 border-[#234236] pt-6">
                <Heart size={18} strokeWidth={1.5} className="text-[#234236] mb-4" />
                <h3 className="font-editorial text-4xl text-[#234236]">
                  {data.localImpact}
                </h3>
                <p className="text-sm text-[#6F6A61] mt-2">
                  More opportunities for local businesses
                </p>
              </div>

            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-16 pt-10 border-t border-[#D8D1C5] flex flex-wrap items-center justify-between gap-6">
              <p className="text-sm text-[#6F6A61] max-w-md">
                Want to see how these patterns play out on the ground?
                Explore every tracked destination in detail.
              </p>
              <Link
                to="/explore"
                className="
                  inline-flex items-center gap-3 px-7 py-3.5
                  border border-[#234236] text-[#234236]
                  text-xs uppercase tracking-[0.18em] font-semibold
                  hover:bg-[#234236] hover:text-[#F5F1E8]
                  transition-all
                "
              >
                Explore destinations
                <ArrowRight size={14} />
              </Link>
            </div>
          </RevealOnScroll>

        </div>
      </section>

    </main>
  );
}

export default Dashboard;
