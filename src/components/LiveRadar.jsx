import React, { useState } from 'react';
import { Shield, MapPin, Activity, CheckCircle, Star, ChevronRight, HeartPulse } from './Icons';

export default function LiveRadar() {
  const [filter, setFilter] = useState('all');

  const destinations = [
    {
      city: 'Reykjavik',
      country: 'Iceland',
      score: 98,
      category: 'solo',
      tag: 'Rank #1 Global Peace Index',
      highlight: 'Virtually zero violent crime; safe at any hour',
      hospitals: 'English-speaking university trauma centers',
      nightSafety: '99%',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      score: 96,
      category: 'solo',
      tag: 'Best Solo Female Safety',
      highlight: 'Ubiquitous Koban police booths & well-lit transit',
      hospitals: 'St. Luke’s International & Jikei Hospital',
      nightSafety: '97%',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      score: 97,
      category: 'family',
      tag: 'Safest Family Destination',
      highlight: 'Rigorous municipal laws & immaculate clean zones',
      hospitals: 'Singapore General & Raffles Hospital 24/7',
      nightSafety: '98%',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Zurich',
      country: 'Switzerland',
      score: 95,
      category: 'night',
      tag: 'Top Medical & Transport',
      highlight: 'Swiss Federal Railway safety mesh with zero lag',
      hospitals: 'University Hospital Zurich Trauma Unit',
      nightSafety: '95%',
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Vienna',
      country: 'Austria',
      score: 94,
      category: 'family',
      tag: 'Highest Quality of Living',
      highlight: 'Calm transit network & extensive multilingual assistance',
      hospitals: 'Vienna General Hospital (AKH) 24/7',
      nightSafety: '94%',
      image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Seoul',
      country: 'South Korea',
      score: 93,
      category: 'night',
      tag: '24/7 Vibrant Night Safety',
      highlight: 'Dense CCTV network and tourist safety patrols in Hongdae/Gangnam',
      hospitals: 'Severance Hospital International Health Care',
      nightSafety: '96%',
      image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const filtered = filter === 'all'
    ? destinations
    : destinations.filter((d) => d.category === filter);

  return (
    <section id="radar" className="relative py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>TourSafe Global Index</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Live Safe Destination Radar
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl text-sm sm:text-base">
              Continually updated scores evaluating physical safety, healthcare accessibility,
              night safety, and traveler sentiment across 140+ countries.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Top Cities' },
              { id: 'solo', label: 'Solo Traveler Favorites' },
              { id: 'family', label: 'Family Friendly' },
              { id: 'night', label: '24/7 Night Safe' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-emerald-950/30"
            >
              {/* Image Header with Gradient Overlay */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src={item.image}
                  alt={`${item.city}, ${item.country}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                {/* Score Pill on Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-lg">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white tracking-tight">
                    {item.score}
                    <span className="text-[10px] text-slate-400">/100</span>
                  </span>
                </div>

                {/* Tag on Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/90 text-slate-950 shadow">
                    {item.tag}
                  </span>
                </div>

                {/* City & Country Title */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.country}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{item.city}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.highlight}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                        <span>24/7 Medical Care</span>
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium truncate max-w-[130px]">{item.hospitals}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>Night Corridor Safety</span>
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">{item.nightSafety}</span>
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    TourSafe Verified Hub
                  </span>
                  <a
                    href="#scanner"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Full Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
