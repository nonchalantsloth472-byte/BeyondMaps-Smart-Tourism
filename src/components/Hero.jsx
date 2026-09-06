import React from 'react';
import { ArrowUpRight, MapPin, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-[#F5F1E8] text-[#24231F] border-b border-[#D8D1C5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Small editorial strip */}
        <div className="flex items-center justify-between py-4 border-b border-[#D8D1C5] text-[10px] sm:text-xs uppercase tracking-[0.16em] text-[#6F6A61]">
          <span>BeyondMaps · Intelligent Travel</span>

          <span className="hidden sm:block">
            Jaipur · Live crowd intelligence
          </span>
        </div>

        {/* HERO */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 py-12 sm:py-16 lg:py-20 items-center">

          {/* LEFT */}
          <div className="lg:col-span-6">

            <p className="text-[#C66A4A] text-xs font-semibold uppercase tracking-[0.22em] mb-5">
              Explore beyond the obvious
            </p>

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[0.98] font-normal tracking-tight">
              Travel
              <span className="block italic text-[#234236]">
                differently.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base sm:text-lg leading-8 text-[#6F6A61]">
              Discover remarkable places without following the crowd.
              BeyondMaps plans smarter journeys using crowd intelligence,
              local experiences, and quieter alternatives.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-9">
              <a
                href="#plan-trip"
                className="inline-flex items-center gap-3 bg-[#234236] text-[#F5F1E8] px-6 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#1a3229] transition-colors"
              >
                Plan My Trip
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#comparison"
                className="inline-flex items-center gap-3 border border-[#234236] text-[#234236] px-6 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#234236] hover:text-[#F5F1E8] transition-colors"
              >
                Explore
              </a>
            </div>

            {/* Small proof */}
            <div className="flex flex-wrap gap-x-7 gap-y-3 mt-10 pt-6 border-t border-[#D8D1C5] text-xs text-[#6F6A61]">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#234236]" />
                Crowd-aware routes
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#234236]" />
                Local discoveries
              </span>
            </div>
          </div>

          {/* RIGHT — IMAGE */}
          <div className="lg:col-span-6">

            <div className="relative">

              {/* Main image */}
              <div className="border border-[#D8D1C5] bg-white p-2">
                <div className="relative aspect-[4/3] overflow-hidden">

                  <img
                    src="https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1400&q=85"
                    alt="Rajasthan heritage architecture"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />

                  {/* Image label */}
                  <div className="absolute top-4 left-4 bg-[#F5F1E8] px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-[#234236]">
                    Jaipur · Rajasthan
                  </div>

                </div>
              </div>

              {/* Crowd intelligence card */}
              <div className="absolute -bottom-6 left-5 sm:left-8 bg-[#234236] text-[#F5F1E8] px-5 py-4 shadow-lg max-w-[290px]">

                <div className="flex items-center justify-between gap-8 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#D8D1C5]">
                    Crowd intelligence
                  </span>

                  <span className="text-[#C66A4A] text-xs">
                    LIVE
                  </span>
                </div>

                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="font-editorial text-3xl">
                      89%
                    </p>

                    <p className="text-xs text-[#D8D1C5] mt-1">
                      Amber Palace
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[#C66A4A] font-semibold text-sm">
                      31%
                    </p>

                    <p className="text-xs text-[#D8D1C5] mt-1">
                      Jaigarh · quieter
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Innovation statement */}
        <div className="grid md:grid-cols-3 border-t border-[#D8D1C5] py-8 sm:py-10 gap-8">

          <div>
            <p className="text-[#C66A4A] text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">
              01 · Predict
            </p>
            <p className="font-editorial text-xl">
              Know when places get crowded.
            </p>
          </div>

          <div>
            <p className="text-[#C66A4A] text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">
              02 · Redistribute
            </p>
            <p className="font-editorial text-xl">
              Find better alternatives nearby.
            </p>
          </div>

          <div>
            <p className="text-[#C66A4A] text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">
              03 · Discover
            </p>
            <p className="font-editorial text-xl">
              Experience more than the usual.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}