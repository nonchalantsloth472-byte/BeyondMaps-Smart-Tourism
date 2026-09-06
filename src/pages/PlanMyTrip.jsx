import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import {
  Clock,
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  Mountain,
  BookOpen,
  Sun,
  CalendarDays,
  RotateCcw,
  Pencil,
  Bookmark,
  Check,
} from "lucide-react";

import { generateMockItinerary } from "../data/mockItinerary";

const LOADING_STEPS = [
  "Reading destination patterns...",
  "Checking crowd conditions...",
  "Finding meaningful alternatives...",
  "Building your route...",
];

export default function PlanMyTrip() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    destination: "",
    days: "2",
    budget: "5000",
    interests: [],
    crowdPreference: "Less crowded",
  });

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) return undefined;

    setLoadingStep(0);

    const stepTimer = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 550);

    return () => clearInterval(stepTimer);
  }, [loading]);

  const interests = [
    "History",
    "Food",
    "Nature",
    "Culture",
    "Adventure",
  ];

  const handleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", {
        state: { from: "/plan-trip" },
      });
      return;
    }

    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      const result = generateMockItinerary(form);

      setGeneratedItinerary(result);
      setLoading(false);
      setShowResult(true);
    }, 2300);
  };

  const regenerateTrip = () => {
    setShowResult(false);
    setSaved(false);
    setLoading(true);

    setTimeout(() => {
      const result = generateMockItinerary(form);

      setGeneratedItinerary(result);
      setLoading(false);
      setShowResult(true);
    }, 2300);
  };

  const editTrip = () => {
    setShowResult(false);
    setLoading(false);
  };

  const getCrowdLabel = (crowd) => {
    if (crowd <= 35) return "Low";
    if (crowd <= 65) return "Moderate";
    return "High";
  };

  const getCrowdClass = (crowd) => {
    if (crowd <= 35) {
      return "text-[#234236] bg-[#234236]/10";
    }

    if (crowd <= 65) {
      return "text-[#9A6A18] bg-[#9A6A18]/10";
    }

    return "text-[#A84E38] bg-[#A84E38]/10";
  };

  const resetTrip = () => {
    setShowResult(false);
    setLoading(false);
    setGeneratedItinerary(null);
    setSaved(false);
  };

  /* =========================
     LOADING SCREEN
  ========================= */

  if (loading) {
    return (
      <main className="flex-1 min-h-[80vh] flex items-center justify-center px-6 bg-[#C9D2C5]">
        <div className="text-center max-w-md w-full">

          <div className="w-14 h-14 border-4 border-[#D8D1C5] border-t-[#234236] rounded-full animate-spin mx-auto mb-8" />

          <p className="text-xs uppercase tracking-[0.2em] text-[#C66A4A] font-semibold mb-3">
            BeyondMaps Intelligence
          </p>

          <h1 className="font-editorial text-4xl text-[#234236] mb-8">
            Building your journey...
          </h1>

          <div className="space-y-3 text-left">
            {LOADING_STEPS.map((step, index) => {
              const done = index < loadingStep;
              const active = index === loadingStep;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    index > loadingStep ? "opacity-35" : "opacity-100"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 shrink-0 border text-[10px] ${
                      done
                        ? "bg-[#234236] border-[#234236] text-[#F5F1E8]"
                        : active
                        ? "border-[#C66A4A] text-[#C66A4A]"
                        : "border-[#D8D1C5] text-[#D8D1C5]"
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : index + 1}
                  </span>

                  <span
                    className={`text-sm ${
                      active ? "text-[#234236] font-semibold" : "text-[#6F6A61]"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="h-1 bg-[#D8D1C5] mt-8 overflow-hidden">
            <div
              className="h-full bg-[#C66A4A] transition-all duration-500 ease-out"
              style={{
                width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
              }}
            />
          </div>

        </div>
      </main>
    );
  }

  /* =========================
     RESULT SCREEN
  ========================= */

  if (showResult && generatedItinerary) {
    return (
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 bg-[#C9D2C5]">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="border-b border-[#D8D1C5] pb-8 mb-10">

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-[#C66A4A] font-semibold mb-3">
                  Your BeyondMaps Journey
                </p>

                <h1 className="font-editorial text-5xl sm:text-6xl text-[#234236] leading-none mb-4">
                  {generatedItinerary.destination}
                </h1>

                <p className="text-[#6F6A61] max-w-2xl">
                  A smarter itinerary designed around your preferences,
                  predicted crowd levels and better times to explore.
                </p>

              </div>

              <div className="flex flex-wrap items-center gap-3">

                <button
                  onClick={editTrip}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[#D8D1C5] text-sm font-semibold text-[#234236] hover:bg-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Trip
                </button>

                <button
                  onClick={regenerateTrip}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[#D8D1C5] text-sm font-semibold text-[#234236] hover:bg-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Regenerate
                </button>

                <button
                  onClick={() => setSaved(true)}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
                    saved
                      ? "bg-[#234236]/10 text-[#234236] border border-[#234236]/20"
                      : "bg-[#234236] text-[#F5F1E8] hover:bg-[#1a3229]"
                  }`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Itinerary"}
                </button>

              </div>

            </div>

          </div>

          {/* Trip at a glance */}
          <section className="mb-12">

            <p className="text-xs uppercase tracking-[0.18em] text-[#6F6A61] mb-4">
              Trip at a glance
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-5 border-t border-l border-[#D8D1C5]">

              <div className="p-5 border-r border-b border-[#D8D1C5] bg-white/40">
                <p className="text-xs text-[#6F6A61] uppercase tracking-wider mb-2">
                  Duration
                </p>

                <p className="font-editorial text-3xl text-[#234236]">
                  {generatedItinerary.days}
                </p>

                <p className="text-sm text-[#6F6A61]">
                  days
                </p>
              </div>

              <div className="p-5 border-r border-b border-[#D8D1C5] bg-white/40">
                <p className="text-xs text-[#6F6A61] uppercase tracking-wider mb-2">
                  Budget
                </p>

                <p className="font-editorial text-3xl text-[#234236]">
                  ₹{generatedItinerary.budget.toLocaleString()}
                </p>

                <p className="text-sm text-[#6F6A61]">
                  estimated
                </p>
              </div>

              <div className="p-5 border-r border-b border-[#D8D1C5] bg-white/40">
                <p className="text-xs text-[#6F6A61] uppercase tracking-wider mb-2">
                  Stops
                </p>

                <p className="font-editorial text-3xl text-[#234236]">
                  {generatedItinerary.itinerary.reduce(
                    (total, day) => total + day.activities.length,
                    0
                  )}
                </p>

                <p className="text-sm text-[#6F6A61]">
                  planned
                </p>
              </div>

              <div className="p-5 border-r border-b border-[#D8D1C5] bg-white/40">
                <p className="text-xs text-[#6F6A61] uppercase tracking-wider mb-2">
                  Crowd preference
                </p>

                <p className="text-lg font-semibold text-[#234236] mt-1">
                  {form.crowdPreference}
                </p>
              </div>

              <div className="p-5 border-r border-b border-[#D8D1C5] bg-[#234236] text-[#F5F1E8]">
                <p className="text-xs uppercase tracking-wider mb-2 opacity-70">
                  BeyondMaps
                </p>

                <p className="font-editorial text-2xl">
                  Smarter route
                </p>

                <p className="text-sm opacity-70 mt-1">
                  Built for you
                </p>
              </div>

            </div>

          </section>

          {/* Intelligence message */}
          <div className="bg-[#234236] text-[#F5F1E8] p-6 sm:p-8 mb-12">

            <p className="text-xs uppercase tracking-[0.2em] text-[#C66A4A] font-semibold mb-3">
              Beyond the obvious
            </p>

            <h2 className="font-editorial text-3xl sm:text-4xl mb-3">
              We made a smarter route for you.
            </h2>

            <p className="text-[#F5F1E8]/70 max-w-2xl leading-relaxed">
              Instead of simply listing popular attractions, BeyondMaps
              considers crowd patterns, timing, safety and alternative
              experiences to create a more balanced journey.
            </p>

          </div>

          {/* Itinerary */}
          <div className="space-y-12">

            {generatedItinerary.itinerary.map((day) => (

              <section key={day.day}>

                <div className="flex items-center gap-4 mb-6">

                  <span className="text-xs uppercase tracking-[0.2em] text-[#C66A4A] font-semibold">
                    Day {day.day}
                  </span>

                  <div className="h-px bg-[#D8D1C5] flex-1" />

                </div>

                <div className="space-y-5">

                  {day.activities.map((activity, index) => (

                    <article
                      key={`${activity.place}-${index}`}
                      className={`border ${
                        activity.isAlternative
                          ? "border-[#C66A4A]/60 bg-[#C66A4A]/5"
                          : "border-[#D8D1C5] bg-white/30"
                      }`}
                    >

                      <div className="p-5 sm:p-7">

                        <div className="flex flex-col lg:flex-row gap-6">

                          {/* Time */}
                          <div className="lg:w-28 shrink-0">

                            <div className="flex items-center gap-2 text-[#234236] font-semibold">
                              <Clock className="w-4 h-4" />
                              {activity.time}
                            </div>

                            <p className="text-xs text-[#6F6A61] mt-1">
                              {activity.duration}
                            </p>

                          </div>

                          {/* Main content */}
                          <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-3 mb-2">

                              <h3 className="font-editorial text-3xl text-[#234236]">
                                {activity.place}
                              </h3>

                              {activity.isAlternative && (
                                <span className="px-2.5 py-1 bg-[#C66A4A] text-white text-[10px] uppercase tracking-wider font-bold">
                                  Smart Alternative
                                </span>
                              )}

                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">

                              <span className="text-xs px-2.5 py-1 bg-[#234236]/8 text-[#234236]">
                                {activity.category}
                              </span>

                              <span
                                className={`text-xs px-2.5 py-1 ${getCrowdClass(
                                  activity.crowd
                                )}`}
                              >
                                {getCrowdLabel(activity.crowd)} crowd ·{" "}
                                {activity.crowd}%
                              </span>

                            </div>

                            <p className="text-[#6F6A61] leading-relaxed max-w-3xl">
                              {activity.description}
                            </p>

                            {/* Crowd + Safety */}
                            <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-[#D8D1C5]">

                              <div className="flex items-center gap-2">

                                <Users className="w-4 h-4 text-[#C66A4A]" />

                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-[#6F6A61]">
                                    Predicted crowd
                                  </p>

                                  <p className="text-sm font-semibold text-[#234236]">
                                    {activity.crowd}% ·{" "}
                                    {getCrowdLabel(activity.crowd)}
                                  </p>
                                </div>

                              </div>

                              <div className="flex items-center gap-2">

                                <ShieldCheck className="w-4 h-4 text-[#234236]" />

                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-[#6F6A61]">
                                    Safety score
                                  </p>

                                  <p className="text-sm font-semibold text-[#234236]">
                                    {activity.safety}/100
                                  </p>
                                </div>

                              </div>

                            </div>

                          </div>

                        </div>

                        {/* Know before you go */}
                        <div className="mt-7 pt-7 border-t border-[#D8D1C5]">

                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#C66A4A] font-semibold mb-5">
                            Know before you go
                          </p>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

                            {/* History */}
                            <div>

                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-[#234236]" />

                                <p className="text-xs font-semibold text-[#234236]">
                                  History
                                </p>
                              </div>

                              <p className="text-xs text-[#6F6A61] leading-relaxed">
                                {activity.history}
                              </p>

                            </div>

                            {/* Elevation */}
                            <div>

                              <div className="flex items-center gap-2 mb-2">
                                <Mountain className="w-4 h-4 text-[#234236]" />

                                <p className="text-xs font-semibold text-[#234236]">
                                  Elevation
                                </p>
                              </div>

                              <p className="text-xs text-[#6F6A61] leading-relaxed">
                                {activity.elevation}
                              </p>

                            </div>

                            {/* Visiting Hours */}
                            <div>

                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-[#234236]" />

                                <p className="text-xs font-semibold text-[#234236]">
                                  Visiting Hours
                                </p>
                              </div>

                              <p className="text-xs text-[#6F6A61] leading-relaxed">
                                {activity.visitingHours}
                              </p>

                            </div>

                            {/* Best Time */}
                            <div>

                              <div className="flex items-center gap-2 mb-2">
                                <Sun className="w-4 h-4 text-[#234236]" />

                                <p className="text-xs font-semibold text-[#234236]">
                                  Best Time
                                </p>
                              </div>

                              <p className="text-xs text-[#6F6A61] leading-relaxed">
                                {activity.bestTime}
                              </p>

                            </div>

                            {/* Duration */}
                            <div>

                              <div className="flex items-center gap-2 mb-2">
                                <CalendarDays className="w-4 h-4 text-[#234236]" />

                                <p className="text-xs font-semibold text-[#234236]">
                                  Suggested Duration
                                </p>
                              </div>

                              <p className="text-xs text-[#6F6A61] leading-relaxed">
                                {activity.duration}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* Smart Alternative */}
                        {activity.isAlternative && (

                          <div className="mt-6 p-4 border-l-2 border-[#C66A4A] bg-[#F5F1E8]">

                            <p className="text-[10px] uppercase tracking-wider text-[#C66A4A] font-bold mb-1">
                              Why we suggested this
                            </p>

                            <p className="text-sm text-[#24231F]">
                              {activity.reason}
                            </p>

                            {activity.distance && (
                              <p className="text-xs text-[#6F6A61] mt-2">
                                <MapPin className="inline w-3.5 h-3.5 mr-1" />
                                {activity.distance} from{" "}
                                {activity.alternativeFor}
                              </p>
                            )}

                          </div>

                        )}

                      </div>

                    </article>

                  ))}

                </div>

              </section>

            ))}

          </div>

          {/* Bottom CTA */}
          <div className="mt-14 pt-8 border-t border-[#D8D1C5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            <div>

              <p className="font-editorial text-2xl text-[#234236]">
                Ready to explore differently?
              </p>

              <p className="text-sm text-[#6F6A61] mt-1">
                Your itinerary can be refined anytime.
              </p>

            </div>

            <button
              onClick={resetTrip}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#234236] text-[#F5F1E8] text-xs uppercase tracking-wider font-semibold hover:bg-[#1a3229] transition-colors"
            >
              Plan Another Trip
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      </main>
    );
  }

  /* =========================
     TRIP FORM
  ========================= */

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 bg-[#C9D2C5]">

      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">

          {/* Form */}
          <section>

            <p className="text-xs uppercase tracking-[0.2em] text-[#C66A4A] font-semibold mb-4">
              BeyondMaps Planner
            </p>

            <h1 className="font-editorial text-5xl sm:text-6xl text-[#234236] leading-none mb-5">
              Plan a trip
              <br />
              <span className="italic">
                beyond the obvious.
              </span>
            </h1>

            <p className="text-[#6F6A61] max-w-xl leading-relaxed mb-10">
              Tell us what kind of journey you want. We'll build an itinerary
              around your interests, budget and preferred crowd levels.
            </p>

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Destination */}
              <div>

                <label className="block text-xs uppercase tracking-wider font-semibold text-[#234236] mb-2">
                  Where do you want to go?
                </label>

                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      destination: e.target.value,
                    })
                  }
                  placeholder="e.g. Jaipur"
                  className="w-full border border-[#D8D1C5] bg-white/40 px-4 py-3.5 outline-none focus:border-[#234236] transition-colors text-[#24231F]"
                  required
                />

              </div>

              {/* Days + Budget */}
              <div className="grid sm:grid-cols-2 gap-5">

                <div>

                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#234236] mb-2">
                    Number of days
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={form.days}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        days: e.target.value,
                      })
                    }
                    className="w-full border border-[#D8D1C5] bg-white/40 px-4 py-3.5 outline-none focus:border-[#234236]"
                  />

                </div>

                <div>

                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#234236] mb-2">
                    Budget
                  </label>

                  <input
                    type="number"
                    min="500"
                    value={form.budget}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        budget: e.target.value,
                      })
                    }
                    className="w-full border border-[#D8D1C5] bg-white/40 px-4 py-3.5 outline-none focus:border-[#234236]"
                  />

                </div>

              </div>

              {/* Interests */}
              <div>

                <label className="block text-xs uppercase tracking-wider font-semibold text-[#234236] mb-3">
                  What are you interested in?
                </label>

                <div className="flex flex-wrap gap-2">

                  {interests.map((interest) => {

                    const selected =
                      form.interests.includes(interest);

                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() =>
                          handleInterest(interest)
                        }
                        className={`px-4 py-2.5 text-sm border transition-colors ${
                          selected
                            ? "bg-[#234236] text-[#F5F1E8] border-[#234236]"
                            : "border-[#D8D1C5] text-[#6F6A61] hover:border-[#234236] hover:text-[#234236]"
                        }`}
                      >
                        {interest}
                      </button>
                    );

                  })}

                </div>

              </div>

              {/* Crowd preference */}
              <div>

                <label className="block text-xs uppercase tracking-wider font-semibold text-[#234236] mb-3">
                  How do you want to experience the destination?
                </label>

                <div className="grid sm:grid-cols-3 gap-2">

                  {[
                    "Less crowded",
                    "Balanced",
                    "Popular spots",
                  ].map((option) => (

                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          crowdPreference: option,
                        })
                      }
                      className={`px-4 py-3 text-sm border transition-colors ${
                        form.crowdPreference === option
                          ? "border-[#234236] bg-[#234236]/5 text-[#234236] font-semibold"
                          : "border-[#D8D1C5] text-[#6F6A61] hover:border-[#234236]"
                      }`}
                    >
                      {option}
                    </button>

                  ))}

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#234236] text-[#F5F1E8] text-xs uppercase tracking-[0.15em] font-semibold hover:bg-[#1a3229] transition-colors"
              >
                Build My Journey
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

          </section>

          {/* Side panel */}
          <aside className="lg:sticky lg:top-32">

            <div className="bg-[#234236] text-[#F5F1E8] p-7 sm:p-9">

              <p className="text-xs uppercase tracking-[0.2em] text-[#C66A4A] font-semibold mb-6">
                The BeyondMaps difference
              </p>

              <h2 className="font-editorial text-3xl sm:text-4xl leading-tight mb-5">
                Don't just plan a trip.
                <br />
                <span className="italic">
                  Plan a better one.
                </span>
              </h2>

              <div className="space-y-5 pt-5 border-t border-white/15">

                <div>
                  <p className="font-semibold mb-1">
                    Predict
                  </p>

                  <p className="text-sm text-white/65 leading-relaxed">
                    Understand when popular places are likely to be crowded.
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-1">
                    Redistribute
                  </p>

                  <p className="text-sm text-white/65 leading-relaxed">
                    Discover similar experiences with fewer people.
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-1">
                    Discover
                  </p>

                  <p className="text-sm text-white/65 leading-relaxed">
                    Experience local culture beyond the usual tourist route.
                  </p>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}