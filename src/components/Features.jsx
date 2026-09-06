import React from 'react';
import { Shield, MapPin, Radio, Bell, HeartPulse, Lock, Users, Activity, CheckCircle } from './Icons';

export default function Features({ onOpenSosModal }) {
  const features = [
    {
      icon: <Radio className="w-6 h-6 text-emerald-400" />,
      title: 'Real-Time Danger Zone Geofencing',
      badge: 'Automated AI Detection',
      description:
        'Continuous background spatial monitoring alerts you 300 meters before stepping into unvetted, high-theft, or municipal curfew perimeters.',
      details: ['Sub-second boundary alerts', 'Protest & civil unrest warnings', 'Night illumination indicators'],
    },
    {
      icon: <Activity className="w-6 h-6 text-rose-400" />,
      title: '1-Tap Multi-Channel SOS Broadcast',
      badge: 'Zero-Lag Relay',
      description:
        'A single tap dispatches your precise satellite GPS coordinates, medical profile, and live audio relay to local authorities and emergency contacts simultaneously.',
      details: ['Silent stealth activation mode', 'Consular & embassy direct relay', 'Works via satellite mesh'],
      action: { label: 'Test SOS Trigger', onClick: onOpenSosModal },
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-teal-400" />,
      title: 'Verified 24/7 Safe Haven Directory',
      badge: 'Audited Safety Nodes',
      description:
        'Pre-screened hospitals with English-speaking trauma staff, accredited police kiosks, and 24-hour pharmacy hubs within walking distance anywhere you travel.',
      details: ['Multilingual hospital staff tags', 'Direct route guidance', 'Verified emergency contacts'],
    },
    {
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      title: 'Offline Emergency Rescue Vault',
      badge: 'Zero Signal Resilient',
      description:
        'Biometrically encrypted vault for offline passport copies, emergency medical records (blood type, allergies), and downloaded regional safety maps.',
      details: ['AES-256 local hardware encryption', 'Full offline searchability', 'Instant embassy verification code'],
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Family & Group Guardian Sync',
      badge: 'Mutual Oversight',
      description:
        'Keep family members or expedition groups in mutual sync without invasive tracking. Automatic alerts for missed scheduled check-ins and low phone batteries.',
      details: ['Scheduled check-in reminders', 'Low battery (<15%) alerts', 'Group meeting point beacons'],
    },
    {
      icon: <Bell className="w-6 h-6 text-amber-400" />,
      title: 'Live Scam & Touting Radar',
      badge: 'Community + Police Feeds',
      description:
        'Crowdsourced and police-verified alerts about common tourist traps, unauthorized taxi rings, overcharging scams, and unlicensed street guides.',
      details: ['Location-triggered fraud alerts', 'Verified taxi stand coordinates', 'Official pricing references'],
    },
  ];

  return (
    <section id="features" className="relative py-24 bg-slate-900/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Complete Defense Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed To Keep You Safe At Every Mile
          </h2>
          <p className="mt-4 text-base text-slate-400">
            From arrival at foreign airports to late-night wanders in quiet alleys,
            TourSafe provides multi-layered protection backed by global emergency infrastructure.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-md hover:shadow-xl"
            >
              <div>
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {f.description}
                </p>
              </div>

              <div>
                {/* Micro checklist */}
                <ul className="space-y-1.5 pt-4 border-t border-slate-800 text-xs text-slate-300 mb-2">
                  {f.details.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {f.action && (
                  <div className="mt-4 pt-3 border-t border-slate-800/60">
                    <button
                      onClick={f.action.onClick}
                      className="w-full py-2 px-3 text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      {f.action.label}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
