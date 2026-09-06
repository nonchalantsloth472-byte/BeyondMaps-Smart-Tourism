import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const navItems = [
  { label: "Home", href: "/" },
  { label: "Plan My Trip", href: "/plan-trip" },
  { label: "Explore", href: "/explore" },
  { label: "Experiences", href: "/experiences" },
  { label: "Insights", href: "/insights" },
  { label: "Safety", href: "/safety" },
];

  const isActive = (path) => location.pathname === path;
  const firstName = user?.name?.split(" ")[0] || "";

  function handleSignOut() {
    signOut();
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F5F1E8]/95 backdrop-blur-sm border-b border-[#D8D1C5]">

      {/* TOP EDITORIAL STRIP */}
      <div className="relative h-11 overflow-hidden border-b border-[#D8D1C5] bg-[#F5F1E8]">
        <div className="relative z-20 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <span className="text-[#C66A4A] text-sm">✦</span>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold text-[#234236]">
              BeyondMaps · Intelligent Tourism
            </span>

            <span className="hidden md:block text-[#D8D1C5]">
              /
            </span>

            <span className="hidden md:block text-[10px] uppercase tracking-[0.16em] text-[#6F6A61]">
              Explore Beyond the Obvious
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[10px] uppercase tracking-[0.16em] text-[#6F6A61]">
              India
            </span>

            <span className="text-[#D8D1C5]">·</span>

            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#234236] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C66A4A] animate-pulse" />
              Live travel intelligence
            </span>
          </div>

        </div>
      </div>

      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[82px]">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative w-10 h-10 hidden sm:flex items-center justify-center">
              <svg
                viewBox="0 0 40 40"
                className="w-10 h-10"
                fill="none"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  stroke="#234236"
                  strokeWidth="1.2"
                />

                <path
                  d="M9 25C14 19 17 16 21 16C25 16 28 12 31 9"
                  stroke="#234236"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M10 28C16 22 20 20 25 20C28 20 30 18 32 16"
                  stroke="#C66A4A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                <circle
                  cx="29"
                  cy="11"
                  r="1.8"
                  fill="#C66A4A"
                />
              </svg>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#234236] group-hover:text-[#C66A4A] transition-colors">
                BeyondMaps
              </span>

              <span className="text-[10px] uppercase tracking-widest text-[#C66A4A] font-semibold">
                India
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    text-sm relative py-2 transition-colors whitespace-nowrap
                    ${
                      active
                        ? "text-[#234236] font-semibold"
                        : "text-[#6F6A61] hover:text-[#24231F]"
                    }
                  `}
                >
                  {item.label}

                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C66A4A]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex items-center gap-4">

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-semibold text-[#234236] hover:text-[#C66A4A] transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-[#234236] text-[#F5F1E8] flex items-center justify-center text-[11px] font-editorial">
                    {firstName.charAt(0).toUpperCase()}
                  </span>

                  {firstName}

                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      accountMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-[#F5F1E8] border border-[#D8D1C5] shadow-sm py-2 z-50">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider text-[#6F6A61] hover:text-[#C66A4A] hover:bg-[#234236]/5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs uppercase tracking-[0.12em] font-semibold text-[#C66A4A] hover:text-[#234236] transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#234236] hover:bg-[#1a3229] text-[#F5F1E8] text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap"
            >
              Plan My Trip
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

          </div>

          {/* MOBILE BUTTON */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#24231F]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#D8D1C5] py-4 space-y-2 bg-[#F5F1E8]">

            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-3 py-3 text-base
                  ${
                    isActive(item.href)
                      ? "text-[#234236] font-semibold bg-[#234236]/5"
                      : "text-[#6F6A61]"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3 px-3 flex flex-col gap-2">

              {isAuthenticated ? (
                <div className="flex items-center justify-between border border-[#D8D1C5] px-4 py-3">
                  <span className="text-sm text-[#234236] font-semibold">
                    Hi, {firstName}
                  </span>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C66A4A] font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 border border-[#C66A4A] text-[#C66A4A] text-xs uppercase tracking-wider font-semibold"
                >
                  Sign In
                </Link>
              )}

              <Link
                to="/plan-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-[#234236] text-[#F5F1E8] text-xs uppercase tracking-wider font-semibold"
              >
                Plan My Trip
              </Link>

            </div>
          </div>
        )}

      </div>
    </header>
  );
}
