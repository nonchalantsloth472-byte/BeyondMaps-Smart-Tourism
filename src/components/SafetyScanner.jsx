import React, { useState } from 'react';
import { Search, Shield, MapPin, CheckCircle, AlertCircle, HeartPulse, Lock, ChevronRight, Star, Users } from './Icons';

export default function SafetyScanner() {
  const [selectedCity, setSelectedCity] = useState('tokyo');
  const [travelerType, setTravelerType] = useState('solo');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const database = {
    tokyo: {
      name: 'Tokyo, Japan',
      country: 'Japan',
      score: 96,
      riskLevel: 'Ultra Low Risk',
      crimeScore: 98,
      healthScore: 95,
      nightScore: 94,
      scamScore: 97,
      hotline: '110 (Police) / 119 (Ambulance)',
      touristPolice: '+81 3-3501-0110 (English available)',
      embassyDistance: 'Roppongi Diplomatic Hub (1.8km)',
      keyAdvisory: 'Extremely safe for solo travelers and night walks. Low pickpocketing risk; keep passport in digital offline vault.',
      recommendedZones: ['Shinjuku Gyoen', 'Ginza', 'Ueno', 'Asakusa', 'Chiyoda'],
      cautionZones: ['Kabukicho back-alleys late at night (touting/overcharging bars)'],
    },
    zurich: {
      name: 'Zurich, Switzerland',
      country: 'Switzerland',
      score: 95,
      riskLevel: 'Ultra Low Risk',
      crimeScore: 97,
      healthScore: 98,
      nightScore: 93,
      scamScore: 94,
      hotline: '117 (Police) / 144 (Ambulance)',
      touristPolice: '112 (Universal EU Rescue)',
      embassyDistance: 'Bern / Zurich Consular Desk (2.1km)',
      keyAdvisory: 'World-class public transport with immaculate lighting and 24/7 security surveillance on all trains.',
      recommendedZones: ['Altstadt', 'Enge', 'Seefeld', 'Lindenhof'],
      cautionZones: ['Langstrasse area late on weekends (standard nightlife awareness)'],
    },
    singapore: {
      name: 'Singapore',
      country: 'Singapore',
      score: 97,
      riskLevel: 'Zero Threat Baseline',
      crimeScore: 99,
      healthScore: 96,
      nightScore: 98,
      scamScore: 95,
      hotline: '999 (Police) / 995 (Ambulance)',
      touristPolice: '1800 736 2000 (Tourist Hotline)',
      embassyDistance: 'Tanglin Diplomatic Enclave (1.2km)',
      keyAdvisory: 'One of the safest global cities. Strict municipal laws; automated surveillance covers transit and tourist areas.',
      recommendedZones: ['Marina Bay', 'Orchard', 'Sentosa', 'Chinatown', 'Bugis'],
      cautionZones: ['No major high-risk zones recorded by TourSafe telemetry.'],
    },
    rome: {
      name: 'Rome, Italy',
      country: 'Italy',
      score: 86,
      riskLevel: 'Low-Moderate Watch',
      crimeScore: 84,
      healthScore: 89,
      nightScore: 82,
      scamScore: 78,
      hotline: '112 (Single European Emergency)',
      touristPolice: '06 4686 (Polizia di Stato Roma)',
      embassyDistance: 'Via Veneto Embassy Corridor (1.4km)',
      keyAdvisory: 'Violent crime is rare, but opportunist pickpockets target crowded Termini transit and Colosseum entrances.',
      recommendedZones: ['Prati', 'Monti', 'Trastevere (Main piazza)', 'Aventine'],
      cautionZones: ['Termini Station exterior plazas after 22:00', 'Metro Line A during peak rush'],
    },
    bangkok: {
      name: 'Bangkok, Thailand',
      country: 'Thailand',
      score: 83,
      riskLevel: 'Moderate Watch Zone',
      crimeScore: 85,
      healthScore: 88,
      nightScore: 79,
      scamScore: 74,
      hotline: '1155 (Tourist Police 24/7)',
      touristPolice: '191 (General Police) / 1669 (Medical)',
      embassyDistance: 'Witthayu Road Corridor (2.5km)',
      keyAdvisory: 'Friendly locals and great medical tourism facilities. Watch for unregulated tuk-tuk tours and gemstone deals.',
      recommendedZones: ['Sukhumvit (Asok/Phrom Phong)', 'Siam', 'Silom (Day/Evening)'],
      cautionZones: ['Khao San Road late night alleys', 'Unmetered riverboat touts'],
    },
  };

  const activeData = database[selectedCity] || database['tokyo'];

  const handleScan = (cityKey) => {
    setIsScanning(true);
    setSelectedCity(cityKey);
    setTimeout(() => {
      setIsScanning(false);
    }, 400);
  };

  return (
    <section id="scanner" className="relative py-20 bg-slate-950/70 border-t border-b border-slate-900">
      {/* Background Accent */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>Interactive Risk Telemetry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Check Any City's Live Safety Profile
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Real-time crime statistics, safe haven hospital locations, emergency hotlines,
            and tailored precautions for your exact travel profile.
          </p>
        </div>

        {/* Scanner Control Deck */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl">
          
          {/* Quick City Presets */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-slate-400 mr-2">Featured Destinations:</span>
            {Object.keys(database).map((key) => {
              const item = database[key];
              const isSelected = selectedCity === key;
              return (
                <button
                  key={key}
                  onClick={() => handleScan(key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {item.name.split(',')[0]}
                </button>
              );
            })}
          </div>

          {/* Traveler Style Switcher */}
          <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Customize For Travel Style:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'solo', label: 'Solo Female / Solo Traveler' },
                { id: 'family', label: 'Family with Kids' },
                { id: 'night', label: 'Night Explorer' },
                { id: 'business', label: 'Executive Travel' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTravelerType(t.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    travelerType === t.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Display Grid */}
          <div className={`transition-opacity duration-200 ${isScanning ? 'opacity-40' : 'opacity-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Score Gauge Panel */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeData.name}</span>
                </div>

                {/* Score Number Display */}
                <div className="my-4">
                  <div className="inline-flex items-baseline justify-center">
                    <span className="text-6xl font-black tracking-tight text-white">
                      {activeData.score}
                    </span>
                    <span className="text-lg font-bold text-slate-400 ml-1">/100</span>
                  </div>
                  <div className="mt-1">
                    <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {activeData.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Micro Sub-meters */}
                <div className="space-y-2.5 text-left text-xs pt-4 border-t border-slate-800/80">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Violent Crime Defense</span>
                      <span className="font-semibold text-emerald-400">{activeData.crimeScore}% Safe</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${activeData.crimeScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Healthcare & Trauma Speed</span>
                      <span className="font-semibold text-teal-400">{activeData.healthScore}% Safe</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full rounded-full" style={{ width: `${activeData.healthScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Night Travel & Transit</span>
                      <span className="font-semibold text-cyan-400">{activeData.nightScore}% Safe</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${activeData.nightScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Scam & Touting Resistance</span>
                      <span className="font-semibold text-amber-400">{activeData.scamScore}% Safe</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${activeData.scamScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Advisory & Intelligence Panel */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Key Advisory Callout */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Verified Travel Intelligence</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeData.keyAdvisory}
                  </p>
                </div>

                {/* Emergency Hotlines Directory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Emergency Dispatch</span>
                    <span className="text-xs font-bold text-white font-mono">{activeData.hotline}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Tourist Assistance Desk</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{activeData.touristPolice}</span>
                  </div>
                </div>

                {/* Recommended vs Caution Zones */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="mb-2">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Recommended Safe Neighborhoods</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeData.recommendedZones.map((zone, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-3">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Exercise Heightened Awareness In</span>
                    </span>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                      {activeData.cautionZones.map((z, idx) => (
                        <li key={idx}>{z}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Updated 4 mins ago via Global Police Feed</span>
                  </div>
                  <button
                    onClick={() => alert(`Subscribed to real-time safety advisories for ${activeData.name}!`)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                  >
                    <span>Track This Trip</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
