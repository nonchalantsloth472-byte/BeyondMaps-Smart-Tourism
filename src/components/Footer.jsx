import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#D8D1C5] bg-[#F5F1E8]">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">

              {/* Simple BeyondMaps SVG */}
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
              >
                <circle
                  cx="19"
                  cy="19"
                  r="17"
                  stroke="#234236"
                  strokeWidth="1.5"
                />

                <path
                  d="M10 24C15 21 17 15 22 12C25 10 28 12 29 15"
                  stroke="#234236"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M10 27C17 27 23 24 28 19"
                  stroke="#C66A4A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle
                  cx="29"
                  cy="15"
                  r="2"
                  fill="#C66A4A"
                />
              </svg>

              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#234236]">
                  BeyondMaps
                </h2>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#C66A4A] font-semibold">
                  Intelligent Travel
                </p>
              </div>

            </div>

            <p className="font-editorial italic text-[#234236] mb-3">
              "Explore beyond the obvious."
            </p>

            <p className="text-sm text-[#6F6A61] leading-relaxed max-w-sm">
              An intelligent tourism platform helping travellers discover
              quieter destinations, local experiences and smarter routes.
            </p>
          </div>


          {/* Navigation */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C66A4A] font-bold mb-5">
              Navigation
            </p>

            <div className="space-y-3">

              <a
                href="/"
                className="block text-sm text-[#6F6A61] hover:text-[#234236]"
              >
                Home
              </a>

              <a
                href="/plan-trip"
                className="block text-sm text-[#6F6A61] hover:text-[#234236]"
              >
                Plan My Trip
              </a>

              <a
                href="/explore"
                className="block text-sm text-[#6F6A61] hover:text-[#234236]"
              >
                Explore
              </a>

              <a
                href="/experiences"
                className="block text-sm text-[#6F6A61] hover:text-[#234236]"
              >
                Experiences
              </a>

              <a
                href="/safety"
                className="block text-sm text-[#6F6A61] hover:text-[#234236]"
              >
                Safety
              </a>

            </div>

          </div>


          {/* BeyondMaps */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C66A4A] font-bold mb-5">
              What we do
            </p>

            <div className="space-y-4">

              <div>
                <p className="text-sm font-semibold text-[#234236]">
                  Crowd Intelligence
                </p>

                <p className="text-xs text-[#6F6A61] mt-1">
                  Predict when destinations get crowded.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#234236]">
                  Smart Alternatives
                </p>

                <p className="text-xs text-[#6F6A61] mt-1">
                  Find similar experiences with fewer crowds.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#234236]">
                  Safer Exploration
                </p>

                <p className="text-xs text-[#6F6A61] mt-1">
                  Travel with contextual safety information.
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Bottom */}
        <div className="border-t border-[#D8D1C5] mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3">

          <p className="text-[10px] text-[#6F6A61]">
            © 2026 BeyondMaps. Built for mindful travellers.
          </p>

          <p className="text-[10px] text-[#6F6A61]">
            Explore beyond the obvious.
          </p>

        </div>

      </div>

    </footer>
  );
}