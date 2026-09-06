import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import IndianOrnament from "../components/IndianOrnament";
import { useAuth } from "../lib/auth";

/* =========================================================
   DESTINATIONS
========================================================= */

const destinations = [
  {
    name: "Rajasthan",
    region: "North West India",
    zone: "west",
    category: "HERITAGE",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=85",
    description:
      "Forts, desert landscapes, living craft traditions and stories beyond the famous landmarks.",
    crowd: 31,
    safety: 88,
    distance: "6.2 km",
    bestTime: "08:00–10:00",
    alternative: "Jaigarh Fort",
    altCrowd: 9,
    altReason:
      "Similar heritage experience with significantly lower predicted crowd.",
  },

  {
    name: "Varanasi",
    region: "North India",
    zone: "north",
    category: "CULTURE",
    image:
     "https://images.unsplash.com/photo-1665413793087-d58c23e3a177?auto=format&fit=crop&w=1400&q=85",
    description:
      "Ancient streets, living traditions and a city whose best stories aren't always on the postcard.",
    crowd: 24,
    safety: 79,
    distance: "2.8 km",
    bestTime: "05:30–07:00",
    alternative: "Ramnagar Heritage Trail",
    altCrowd: 6,
    altReason:
      "The same riverside ritual, without the crowd pressing in.",
  },

  {
    name: "Kerala",
    region: "South India",
    zone: "south",
    category: "SLOW TRAVEL",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
    description:
      "Backwaters, coastal communities, local food and journeys that move at their own pace.",
    crowd: 36,
    safety: 91,
    distance: "14 km",
    bestTime: "16:00–18:00",
    alternative: "Fort Kochi Art Walk",
    altCrowd: 14,
    altReason:
      "Same coastal culture, a fraction of the houseboat traffic.",
  },

  {
    name: "Leh",
    region: "Himalayas",
    zone: "north",
    category: "ADVENTURE",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85",
    description:
      "High-altitude landscapes, mountain villages and quieter routes through the Himalayas.",
    crowd: 18,
    safety: 85,
    distance: "148 km",
    bestTime: "06:00–08:00",
    alternative: "Sham Valley",
    altCrowd: 5,
    altReason:
      "The same high-altitude drama, largely untouched by tour buses.",
  },

  {
    name: "Shillong",
    region: "North East India",
    zone: "northeast",
    category: "NATURE",
    image:
      "https://images.unsplash.com/photo-1609276804051-8c5e906cc430?auto=format&fit=crop&w=1400&q=85",
    description:
      "Waterfalls, forests, music and local life in one of India's most atmospheric regions.",
    crowd: 27,
    safety: 90,
    distance: "78 km",
    bestTime: "09:00–11:00",
    alternative: "Laitlum Canyon",
    altCrowd: 8,
    altReason:
      "Cleaner air and wider views, almost no tour buses.",
  },

  {
    name: "Goa",
    region: "West India",
    zone: "west",
    category: "FOOD",
    image:
      "https://images.unsplash.com/photo-1695453463057-aa5d48d9e3d4?auto=format&fit=crop&w=1400&q=85",
    description:
      "Portuguese-era lanes and Konkan cooking along a coastline longer than its reputation suggests.",
    crowd: 58,
    safety: 82,
    distance: "38 km",
    bestTime: "17:30–19:00",
    alternative: "Agonda & Patnem, South Goa",
    altCrowd: 16,
    altReason:
      "Same coastline, a fifth of the footfall, better food.",
  },

  {
    name: "Hampi",
    region: "South India",
    zone: "south",
    category: "HERITAGE",
    image:
      "https://images.unsplash.com/photo-1767633994425-0eb9a3f20671?auto=format&fit=crop&w=1400&q=85",
    description:
      "A ruined empire scattered across boulder-strewn plains, best seen once the temple crowds thin out.",
    crowd: 35,
    safety: 87,
    distance: "4.1 km",
    bestTime: "16:30–18:00",
    alternative: "Malyavanta Hill",
    altCrowd: 11,
    altReason:
      "A quiet ruined temple with sunset views, and no queues.",
  },
];

/* =========================================================
   FILTERS
========================================================= */

const ZONE_FILTERS = [
  { id: "all", label: "All" },
  { id: "north", label: "North" },
  { id: "south", label: "South" },
  { id: "east", label: "East" },
  { id: "west", label: "West" },
  { id: "northeast", label: "North East" },
];

/* =========================================================
   PREDICT / REDISTRIBUTE / DISCOVER
========================================================= */

const stories = [
  {
    number: "01",
    title: "Predict",
    text:
      "Understand when the places you want to visit are likely to become crowded.",
    stat: "31%",
    statLabel: "avg. predicted crowd, peak hour",
  },

  {
    number: "02",
    title: "Redistribute",
    text:
      "When a destination is under pressure, discover meaningful alternatives nearby.",
    stat: "6.2 km",
    statLabel: "avg. distance to an alternative",
  },

  {
    number: "03",
    title: "Discover",
    text:
      "Experience more of India instead of spending your journey waiting in queues.",
    stat: "7",
    statLabel: "regions mapped in this preview",
  },
];

/* =========================================================
   FEATURED EXPERIENCES
========================================================= */

const FEATURED_EXPERIENCES = [
  {
    title: "Local Food",
    text:
      "Taste neighbourhood favourites instead of following the queue.",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=85",
  },

  {
    title: "Craft & Artisans",
    text:
      "Meet artisans and discover living traditions.",
    image:
      "https://images.unsplash.com/photo-1633112046092-a161d99563d1?auto=format&fit=crop&w=1200&q=85",
  },

  {
    title: "Quiet Heritage",
    text:
      "Experience history without standing shoulder-to-shoulder.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85",
  },

  {
    title: "Nature & Landscapes",
    text:
      "Forests, coastlines and mountains beyond the viewpoint car park.",
    image:
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=85",
  },
];

/* =========================================================
   STICKY STORY
========================================================= */

const STICKY_STORY = [
  {
    title: "See it before you go",
    text:
      "Every destination comes with a predicted crowd level, built from patterns in footfall, season and time of day.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
  },

  {
    title: "Find what's nearby",
    text:
      "For every landmark under pressure, we surface a genuinely comparable alternative close by — not a compromise.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
  },

  {
    title: "Travel with context",
    text:
      "Safety scores and emergency information travel with you, adjusted for the place, time and conditions.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85",
  },

  {
    title: "Plan it in minutes",
    text:
      "Turn any destination and its alternative into a route, a rough schedule and a plan worth following.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85",
  },
];

/* =========================================================
   SPOTLIGHT CARD
========================================================= */

function SpotlightCard({ children, className = "" }) {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );

    card.style.setProperty(
      "--mouse-y",
      `${e.clientY - rect.top}px`
    );
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      className={`relative overflow-hidden group ${className}`}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-500
          z-0
        "
        style={{
          background:
            "radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(198,106,74,0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   REVEAL ON SCROLL
========================================================= */

function RevealOnScroll({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all
        duration-1000
        ease-out
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const { user } = useAuth();

  const [activeDestination, setActiveDestination] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [query, setQuery] = useState("");
  const [activeZone, setActiveZone] = useState("all");
  const [activeMethod, setActiveMethod] = useState(0);

  /* =====================================================
     SCROLL
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =====================================================
     AUTO ROTATING DESTINATION
  ===================================================== */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveDestination(
        (current) =>
          (current + 1) % destinations.length
      );
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const destination =
    destinations[activeDestination];

  /* =====================================================
     FILTERED DESTINATIONS
  ===================================================== */

  const visibleDestinations = destinations
    .map((item, index) => ({
      ...item,
      index,
    }))
    .filter((item) => {
      const matchesZone =
        activeZone === "all" ||
        item.zone === activeZone;

      const q = query
        .trim()
        .toLowerCase();

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
        matchesQuery
      );
    });

  return (
    <main className="bg-[#F5F1E8] text-[#24231F] overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[calc(100vh-124px)] overflow-hidden bg-[#C9D2C5]">

        <IndianOrnament
          variant="corner"
          color="#234236"
          opacity={0.11}
          duration={65}
          className="
            absolute
            -left-12
            top-16
            w-[430px]
            h-[430px]
            pointer-events-none
          "
        />

        <IndianOrnament
          variant="corner"
          color="#C66A4A"
          opacity={0.08}
          duration={80}
          reverse
          className="
            absolute
            -right-20
            bottom-0
            w-[360px]
            h-[360px]
            rotate-180
            pointer-events-none
          "
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

          {/* Editorial strip */}

          <div className="
            border-b
            border-[#D8D1C5]
            py-4
            flex
            justify-between
            items-center
          ">
            <span className="
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-[#6F6A61]
            ">
              ✦ BeyondMaps · Intelligent Tourism
            </span>

            <span className="
              hidden
              sm:block
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-[#6F6A61]
            ">
              India · Live travel intelligence
            </span>
          </div>

          <div className="
            grid
            lg:grid-cols-[0.9fr_1.1fr]
            gap-12
            lg:gap-20
            items-center
            min-h-[calc(100vh-190px)]
            py-16
          ">

            {/* HERO TEXT */}

            <RevealOnScroll>

              {user && (
                <p className="
                  text-sm
                  text-[#6F6A61]
                  mb-4
                ">
                  Welcome back,{" "}
                  <span className="
                    text-[#234236]
                    font-semibold
                  ">
                    {user.name}
                  </span>
                </p>
              )}

              <p className="
                text-[11px]
                uppercase
                tracking-[0.3em]
                text-[#C66A4A]
                font-semibold
                mb-7
              ">
                Intelligent travel · India
              </p>

              <h1 className="
                font-editorial
                text-[clamp(4.5rem,9vw,8.5rem)]
                leading-[0.82]
                tracking-[-0.045em]
                text-[#234236]
              ">
                India,
                <br />

                <span className="
                  italic
                  text-[#24231F]
                ">
                  differently.
                </span>
              </h1>

              <p className="
                mt-9
                max-w-lg
                text-base
                lg:text-lg
                leading-relaxed
                text-[#6F6A61]
              ">
                BeyondMaps helps you discover India
                through intelligent travel planning —
                predicting crowds, finding meaningful
                alternatives and revealing places worth
                slowing down for.
              </p>

              <div className="
                flex
                flex-wrap
                gap-4
                mt-9
              ">

                <Link
                  to="/login"
                  className="
                    relative
                    overflow-hidden
                    group
                    inline-flex
                    items-center
                    gap-3
                    px-8
                    py-4
                    bg-[#234236]
                    text-[#F5F1E8]
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    font-semibold
                  "
                >
                  <span className="relative z-10">
                    Start Exploring
                  </span>

                  <span className="
                    relative
                    z-10
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  ">
                    →
                  </span>

                  <span className="
                    absolute
                    inset-y-0
                    -left-20
                    w-20
                    bg-[#C66A4A]/30
                    skew-x-[-20deg]
                    group-hover:left-[120%]
                    transition-all
                    duration-700
                  " />
                </Link>

                <Link
                  to="/plan-trip"
                  className="
                    inline-flex
                    items-center
                    px-8
                    py-4
                    border
                    border-[#234236]
                    text-[#234236]
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    font-semibold
                    hover:bg-[#234236]
                    hover:text-[#F5F1E8]
                    transition-all
                  "
                >
                  Plan a Journey
                </Link>

              </div>

              <div className="
                flex
                flex-wrap
                gap-6
                mt-8
              ">
                {[
                  "Crowd intelligence",
                  "Smart alternatives",
                  "Safer exploration",
                ].map((item) => (
                  <span
                    key={item}
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.16em]
                      text-[#6F6A61]
                    "
                  >
                    ✦ {item}
                  </span>
                ))}
              </div>

            </RevealOnScroll>

            {/* HERO IMAGE */}

            <RevealOnScroll className="lg:pt-8">

              <div className="relative">

                <div className="
                  absolute
                  -inset-8
                  bg-[#234236]/[0.035]
                  blur-3xl
                  pointer-events-none
                " />

                <SpotlightCard>

                  <div className="
                    relative
                    border
                    border-[#D8D1C5]
                    bg-[#F5F1E8]
                    p-2
                  ">

                    <div className="
                      relative
                      h-[500px]
                      lg:h-[590px]
                      overflow-hidden
                    ">

                      <img
                        key={destination.name}
                        src={destination.image}
                        alt={destination.name}
                        className="
                          absolute
                          inset-0
                          w-full
                          h-full
                          object-cover
                          animate-[fadeIn_0.7s_ease-out]
                        "
                        style={{
                          transform: `
                            translateY(
                              ${Math.min(
                                scrollY * 0.06,
                                40
                              )}px
                            )
                            scale(1.08)
                          `,
                        }}
                      />

                      <div className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#234236]/90
                        via-[#234236]/10
                        to-transparent
                      " />

                      {/* Top labels */}

                      <div className="
                        absolute
                        top-5
                        left-5
                        right-5
                        flex
                        justify-between
                        items-center
                      ">

                        <span className="
                          px-3
                          py-1.5
                          bg-[#F5F1E8]/90
                          text-[#234236]
                          text-[9px]
                          uppercase
                          tracking-[0.18em]
                          font-semibold
                        ">
                          {destination.category}
                        </span>

                        <span className="
                          text-[9px]
                          uppercase
                          tracking-[0.18em]
                          text-[#F5F1E8]
                        ">
                          India · 0
                          {activeDestination + 1}
                        </span>

                      </div>

                      {/* Bottom info */}

                      <div className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-7
                        lg:p-9
                        text-[#F5F1E8]
                      ">

                        <p className="
                          text-[9px]
                          uppercase
                          tracking-[0.2em]
                          text-[#F5F1E8]/60
                        ">
                          {destination.region}
                        </p>

                        <h2 className="
                          font-editorial
                          text-5xl
                          lg:text-6xl
                          mt-2
                        ">
                          {destination.name}
                        </h2>

                        <div className="
                          mt-5
                          grid
                          grid-cols-2
                          gap-4
                          border-t
                          border-[#F5F1E8]/25
                          pt-5
                        ">

                          <div>

                            <p className="
                              text-[9px]
                              uppercase
                              tracking-[0.15em]
                              text-[#F5F1E8]/50
                            ">
                              Predicted crowd
                            </p>

                            <p className="
                              font-editorial
                              text-3xl
                              mt-1
                            ">
                              {destination.crowd}%
                            </p>

                          </div>

                          <div>

                            <p className="
                              text-[9px]
                              uppercase
                              tracking-[0.15em]
                              text-[#F5F1E8]/50
                            ">
                              Suggested
                            </p>

                            <p className="
                              text-sm
                              text-[#F5F1E8]
                              mt-2
                            ">
                              {destination.alternative}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </SpotlightCard>

                <IndianOrnament
                  variant="floral"
                  color="#C66A4A"
                  opacity={0.12}
                  duration={72}
                  className="
                    absolute
                    -right-24
                    -bottom-24
                    w-64
                    h-64
                    pointer-events-none
                  "
                />

              </div>

            </RevealOnScroll>

          </div>

        </div>

      </section>


      {/* =====================================================
          DESTINATION EXPLORER
      ===================================================== */}

      <section className="
        relative
        py-24
        border-t
        border-[#D8D1C5]
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-12
        ">

          <RevealOnScroll>

            <div className="
              grid
              lg:grid-cols-[0.7fr_1.3fr]
              gap-10
              items-end
            ">

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#C66A4A]
                ">
                  Discover India
                </p>

                <h2 className="
                  font-editorial
                  text-5xl
                  lg:text-6xl
                  text-[#234236]
                  mt-4
                  leading-[0.95]
                ">
                  Beyond the
                  <br />

                  <span className="
                    italic
                    text-[#24231F]
                  ">
                    postcard.
                  </span>
                </h2>

              </div>

              <p className="
                max-w-xl
                text-sm
                leading-relaxed
                text-[#6F6A61]
              ">
                Choose a destination. BeyondMaps
                changes the story around it — from the
                places people usually visit to the
                quieter experiences waiting nearby.
              </p>

            </div>

          </RevealOnScroll>


          {/* SEARCH + FILTER */}

          <RevealOnScroll className="mt-12">

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              gap-4
              md:gap-6
            ">

              <div className="
                relative
                w-full
                md:w-72
              ">

                <span className="
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  text-[#6F6A61]
                  text-sm
                ">
                  ⌕
                </span>

                <input
                  type="text"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="
                    Search destinations, experiences or regions...
                  "
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

              <div className="
                flex
                flex-wrap
                gap-2
              ">

                {ZONE_FILTERS.map((zone) => (

                  <button
                    key={zone.id}
                    type="button"
                    onClick={() =>
                      setActiveZone(zone.id)
                    }
                    className={`
                      px-3.5
                      py-1.5
                      text-[9px]
                      uppercase
                      tracking-[0.15em]
                      font-semibold
                      border
                      transition-colors

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

          </RevealOnScroll>


          {/* DESTINATION TABS */}

          <div className="
            flex
            flex-wrap
            gap-2
            mt-8
            border-b
            border-[#D8D1C5]
            pb-3
            min-h-[52px]
          ">

            {visibleDestinations.length === 0 && (
              <p className="
                text-xs
                text-[#6F6A61]
                py-3
              ">
                Nothing matches yet — try a different
                region or word.
              </p>
            )}

            {visibleDestinations.map((item) => (

              <button
                key={item.name}
                type="button"
                onClick={() =>
                  setActiveDestination(item.index)
                }
                className={`
                  px-5
                  py-3
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                  font-semibold
                  transition-all

                  ${
                    activeDestination === item.index
                      ? "bg-[#234236] text-[#F5F1E8]"
                      : "text-[#6F6A61] hover:text-[#234236]"
                  }
                `}
              >
                {item.name}
              </button>

            ))}

          </div>


          {/* DYNAMIC DESTINATION PANEL */}

          <div className="
            grid
            lg:grid-cols-[1.25fr_0.75fr]
            min-h-[560px]
            border-x
            border-b
            border-[#D8D1C5]
          ">

            {/* Image */}

            <div className="
              relative
              overflow-hidden
            ">

              <img
                key={destination.name}
                src={destination.image}
                alt={destination.name}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  animate-[fadeIn_0.7s_ease-out]
                "
              />

              <div className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#234236]/80
                to-transparent
              " />

              <div className="
                absolute
                bottom-8
                left-8
                text-[#F5F1E8]
              ">

                <p className="
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-[#C66A4A]
                ">
                  {destination.category}
                </p>

                <h3 className="
                  font-editorial
                  text-5xl
                  mt-2
                ">
                  {destination.name}
                </h3>

              </div>

            </div>


            {/* Information */}

            <div className="
              p-8
              lg:p-10
              flex
              flex-col
              justify-between
              bg-[#F5F1E8]
            ">

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-[#6F6A61]
                ">
                  A different way in
                </p>

                <p className="
                  text-lg
                  leading-relaxed
                  text-[#24231F]
                  mt-6
                ">
                  {destination.description}
                </p>

              </div>


              <div>

                <div className="
                  border-t
                  border-[#D8D1C5]
                  pt-6
                  grid
                  grid-cols-2
                  gap-6
                ">

                  <div>

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-[0.16em]
                      text-[#6F6A61]
                    ">
                      Crowd prediction
                    </p>

                    <p className="
                      font-editorial
                      text-5xl
                      text-[#234236]
                      mt-2
                    ">
                      {destination.crowd}%
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-[0.16em]
                      text-[#6F6A61]
                    ">
                      Smart alternative
                    </p>

                    <p className="
                      text-sm
                      text-[#234236]
                      font-semibold
                      mt-3
                    ">
                      {destination.alternative}
                    </p>

                    <p className="
                      text-xs
                      text-[#6F6A61]
                      leading-relaxed
                      mt-2
                    ">
                      {destination.altReason}
                    </p>

                  </div>

                </div>


                <div className="
                  grid
                  grid-cols-2
                  gap-6
                  mt-6
                ">

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
                      text-[#234236]
                      mt-2
                      font-semibold
                    ">
                      {destination.bestTime}
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-[0.16em]
                      text-[#6F6A61]
                    ">
                      Safety score
                    </p>

                    <p className="
                      text-sm
                      text-[#234236]
                      mt-2
                      font-semibold
                    ">
                      {destination.safety}/100
                    </p>

                  </div>

                </div>


                <Link
                  to="/plan-trip"
                  className="
                    inline-flex
                    mt-8
                    text-xs
                    uppercase
                    tracking-[0.17em]
                    font-semibold
                    text-[#C66A4A]
                    hover:text-[#234236]
                    transition-colors
                  "
                >
                  Plan around this destination →
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BEYONDMAPS METHOD
      ===================================================== */}

      <section className="
        relative
        bg-[#234236]
        text-[#F5F1E8]
        py-20
        lg:py-24
        overflow-hidden
      ">

        <IndianOrnament
          variant="floral"
          color="#F5F1E8"
          opacity={0.05}
          duration={95}
          reverse
          className="
            absolute
            -right-56
            top-1/2
            -translate-y-1/2
            w-[520px]
            h-[520px]
            pointer-events-none
          "
        />

        <div className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          lg:px-12
        ">

          <RevealOnScroll>

            <div className="
              flex
              flex-col
              lg:flex-row
              lg:items-end
              lg:justify-between
              gap-6
            ">

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#C66A4A]
                ">
                  The BeyondMaps method
                </p>

                <h2 className="
                  font-editorial
                  text-4xl
                  lg:text-5xl
                  leading-[0.95]
                  mt-4
                  max-w-lg
                ">
                  Travel smarter.
                  {" "}
                  <span className="italic">
                    Not harder.
                  </span>
                </h2>

              </div>

              <p className="
                text-sm
                text-[#F5F1E8]/60
                leading-relaxed
                max-w-sm
              ">
                A travel experience that responds
                to the world around you instead of
                sending everyone down the same path.
              </p>

            </div>

          </RevealOnScroll>


          {/* INTERACTIVE STRIP */}

          <RevealOnScroll className="mt-12">

            <div className="
              flex
              border-b
              border-[#F5F1E8]/15
              overflow-x-auto
            ">

              {stories.map((story, index) => {

                const isActive =
                  activeMethod === index;

                return (
                  <button
                    key={story.number}
                    type="button"
                    onClick={() =>
                      setActiveMethod(index)
                    }
                    className="
                      relative
                      shrink-0
                      pr-10
                      md:pr-14
                      pb-4
                      text-left
                    "
                  >

                    <span className={`
                      block
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      transition-colors
                      duration-300

                      ${
                        isActive
                          ? "text-[#F5F1E8]/70"
                          : "text-[#F5F1E8]/35"
                      }
                    `}>
                      {story.number}
                    </span>

                    <span className={`
                      block
                      font-editorial
                      text-2xl
                      md:text-3xl
                      mt-1
                      transition-colors
                      duration-300

                      ${
                        isActive
                          ? "text-[#F5F1E8]"
                          : "text-[#F5F1E8]/40"
                      }
                    `}>
                      {story.title}
                    </span>

                    <span className={`
                      absolute
                      left-0
                      -bottom-[1px]
                      h-[2px]
                      bg-[#C66A4A]
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "w-full"
                          : "w-0"
                      }
                    `} />

                  </button>
                );

              })}

            </div>


            <div className="
              grid
              md:grid-cols-[1fr_auto]
              gap-6
              md:gap-10
              items-end
              pt-8
            ">

              <div>

                <p
                  key={activeMethod}
                  className="
                    max-w-lg
                    text-base
                    lg:text-lg
                    leading-relaxed
                    text-[#F5F1E8]/70
                    animate-[fadeIn_0.5s_ease-out]
                  "
                >
                  {stories[activeMethod].text}
                </p>

                <div className="
                  flex
                  items-center
                  gap-4
                  mt-6
                ">

                  <span className="
                    font-editorial
                    text-3xl
                    text-[#C66A4A]
                  ">
                    {stories[activeMethod].stat}
                  </span>

                  <span className="
                    text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[#F5F1E8]/40
                  ">
                    {stories[activeMethod].statLabel}
                  </span>

                </div>

              </div>

              <span className="
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-[#F5F1E8]/35
                whitespace-nowrap
              ">
                0{activeMethod + 1} / 03
              </span>

            </div>

          </RevealOnScroll>

        </div>

      </section>


      {/* =====================================================
          LOCAL STORIES
      ===================================================== */}

      <section className="py-28 bg-[#E6EBE3]">

        <div className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-12
        ">

          <RevealOnScroll>

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-end
              justify-between
              gap-8
            ">

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#C66A4A]
                ">
                  Local stories
                </p>

                <h2 className="
                  font-editorial
                  text-5xl
                  lg:text-6xl
                  text-[#234236]
                  mt-4
                ">
                  Beyond the
                  <br />

                  <span className="
                    italic
                    text-[#24231F]
                  ">
                    guidebook.
                  </span>
                </h2>

              </div>

              <p className="
                max-w-md
                text-sm
                text-[#6F6A61]
                leading-relaxed
              ">
                Find the food, craft, culture and
                quiet corners that make a place
                feel like itself.
              </p>

            </div>

          </RevealOnScroll>


          {/* IMAGE STORIES */}

          <div className="
            grid
            md:grid-cols-12
            gap-4
            mt-14
          ">

            {FEATURED_EXPERIENCES.map(
              (experience, index) => {

                const layouts = [
                  "md:col-span-7 md:row-span-2 min-h-[520px]",
                  "md:col-span-5 min-h-[250px]",
                  "md:col-span-5 min-h-[250px]",
                  "md:col-span-12 min-h-[340px]",
                ];

                return (
                  <SpotlightCard
                    key={experience.title}
                    className={`
                      relative
                      overflow-hidden
                      ${layouts[index]}
                    `}
                  >

                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="
                        absolute
                        inset-0
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
                      from-[#234236]/90
                      via-[#234236]/25
                      to-transparent
                    " />

                    <div className="
                      absolute
                      left-7
                      right-7
                      bottom-7
                      text-[#F5F1E8]
                    ">

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        text-[#F5F1E8]/60
                        mb-2
                      ">
                        0{index + 1}
                      </p>

                      <h3 className="
                        font-editorial
                        text-3xl
                        lg:text-4xl
                      ">
                        {experience.title}
                      </h3>

                      <p className="
                        text-sm
                        text-[#F5F1E8]/70
                        mt-2
                        max-w-md
                      ">
                        {experience.text}
                      </p>

                    </div>

                  </SpotlightCard>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS / STICKY STORY
      ===================================================== */}

      <section className="
        py-28
        border-t
        border-[#D8D1C5]
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-12
        ">

          <RevealOnScroll>

            <div className="
              grid
              lg:grid-cols-[0.8fr_1.2fr]
              gap-12
              lg:gap-20
            ">

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#C66A4A]
                ">
                  Intelligence that travels with you
                </p>

                <h2 className="
                  font-editorial
                  text-5xl
                  lg:text-6xl
                  leading-[0.92]
                  text-[#234236]
                  mt-5
                ">
                  A better way
                  <br />
                  to see India.
                </h2>

                <p className="
                  text-sm
                  leading-relaxed
                  text-[#6F6A61]
                  mt-7
                  max-w-md
                ">
                  BeyondMaps combines destination
                  intelligence, crowd prediction,
                  alternatives and safety context
                  into one travel experience.
                </p>

              </div>


              <div className="
                space-y-4
              ">

                {STICKY_STORY.map(
                  (item, index) => (

                    <SpotlightCard
                      key={item.title}
                      className="
                        border
                        border-[#D8D1C5]
                        bg-[#F5F1E8]
                      "
                    >

                      <div className="
                        grid
                        md:grid-cols-[180px_1fr]
                        min-h-[180px]
                      ">

                        <div className="
                          relative
                          overflow-hidden
                        ">

                          <img
                            src={item.image}
                            alt={item.title}
                            className="
                              absolute
                              inset-0
                              w-full
                              h-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-105
                            "
                          />

                        </div>

                        <div className="
                          p-7
                          flex
                          flex-col
                          justify-center
                        ">

                          <div className="
                            flex
                            items-center
                            gap-4
                          ">

                            <span className="
                              text-[9px]
                              uppercase
                              tracking-[0.18em]
                              text-[#C66A4A]
                            ">
                              0{index + 1}
                            </span>

                            <span className="
                              h-px
                              w-8
                              bg-[#D8D1C5]
                            " />

                            <span className="
                              text-[9px]
                              uppercase
                              tracking-[0.18em]
                              text-[#6F6A61]
                            ">
                              BeyondMaps
                            </span>

                          </div>

                          <h3 className="
                            font-editorial
                            text-3xl
                            text-[#234236]
                            mt-4
                          ">
                            {item.title}
                          </h3>

                          <p className="
                            text-sm
                            leading-relaxed
                            text-[#6F6A61]
                            mt-3
                            max-w-lg
                          ">
                            {item.text}
                          </p>

                        </div>

                      </div>

                    </SpotlightCard>

                  )
                )}

              </div>

            </div>

          </RevealOnScroll>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="
        relative
        overflow-hidden
        bg-[#C9D2C5]
        py-32
        border-t
        border-[#D8D1C5]
      ">

        <IndianOrnament
          variant="divider"
          color="#C66A4A"
          opacity={0.55}
          className="
            relative
            mx-auto
            w-[420px]
            max-w-[75%]
            h-auto
          "
        />

        <div className="
          relative
          max-w-4xl
          mx-auto
          px-6
          text-center
          mt-8
        ">

          <p className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-[#C66A4A]
          ">
            Your journey begins here
          </p>

          <h2 className="
            font-editorial
            text-6xl
            sm:text-7xl
            lg:text-8xl
            leading-[0.88]
            text-[#234236]
            mt-6
          ">
            Where will you
            <br />

            <span className="
              italic
              text-[#24231F]
            ">
              go differently?
            </span>
          </h2>

          <p className="
            max-w-xl
            mx-auto
            text-sm
            text-[#6F6A61]
            leading-relaxed
            mt-7
          ">
            Tell BeyondMaps what kind of journey
            you want. We'll help you find the places,
            moments and routes that fit.
          </p>

          <Link
            to="/login"
            className="
              inline-flex
              items-center
              gap-3
              mt-9
              px-9
              py-4
              bg-[#234236]
              text-[#F5F1E8]
              text-xs
              uppercase
              tracking-[0.18em]
              font-semibold
              hover:bg-[#1a3229]
              transition-all
            "
          >
            Start Your Journey
            <span>→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;