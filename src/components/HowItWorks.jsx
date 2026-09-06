import React from 'react';
import { MapPin, Radio, Shield, ChevronRight, Activity } from './Icons';

export default function HowItWorks({ onOpenSosModal }) {
  const steps = [
    {
      num: '01',
      title: 'Plan & Synchronize Itinerary',
      subtitle: 'Instant Risk Pre-Scan',
      description:
        'Enter your flight, hotel, or destination. TourSafe scans historical crime patterns, hospital proximity, and local safety advisories, automatically generating an offline survival kit.',
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      tag: 'Pre-Trip Preparation',
    },
    {
      num: '02',
      title: 'Explore With Background Guardian',
      subtitle: 'Passive Spatial Geofencing',
      description:
        'Walk through foreign cities with confidence. TourSafe operates silently in your pocket, conserving battery while pinging you discrete warnings if you approach high-theft or unlit sectors.',
      icon: <Radio className="w-5 h-5 text-teal-400" />,
      tag: 'Real-Time Protection',
    },
    {
      num: '03',
      title: 'Rapid SOS Multi-Channel Dispatch',
      subtitle: 'Immediate Global Response',
      description:
        'In any critical situation, 1-tap broadcasts your precise GPS, emergency contacts, and vital medical notes to local emergency responders, tour operators, and consular aid.',
      icon: <Activity className="w-5 h-5 text-rose-400" />,
      tag: 'Emergency Rescue',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How TourSafe Protects Your Journey
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Intelligent, non-intrusive safety architecture designed to give you complete peace of mind without ruining the joy of spontaneous travel.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step Number & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-slate-800 group-hover:text-emerald-500/30 transition-colors font-mono">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {step.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {step.title}
                  </h3>
                </div>

                <div className="text-xs font-semibold text-slate-400 mb-3">{step.subtitle}</div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx === 2 && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={onOpenSosModal}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    Try The SOS Simulation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
