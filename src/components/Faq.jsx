import React, { useState } from 'react';
import { ChevronDown, Shield, Lock } from './Icons';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Does TourSafe work without internet or international cellular data?',
      a: 'Yes! Before departure, TourSafe automatically caches your destination’s offline safety pack—including offline street maps, 24/7 hospital GPS locations, embassy hotlines, and local scam advisories. In distress, our emergency SOS broadcasts via satellite mesh and low-bandwidth SMS relay even when mobile internet is zero.',
    },
    {
      q: 'How does the SOS dispatch work in countries where I do not speak the language?',
      a: 'TourSafe’s automated emergency bridge translates your distress call into the official local language of the police or medical dispatcher. It automatically reads out your exact GPS coordinates, foreign national status, passport country, and urgent medical needs (e.g., blood type, insulin dependency).',
    },
    {
      q: 'Will background geofencing drain my phone battery during day-long excursions?',
      a: 'Not at all. TourSafe uses an intelligent multi-tiered spatial algorithm that relies on low-power cell tower and Wi-Fi perimeter triangulation rather than continuous power-hungry GPS. It consumes less than 3% battery across a full 12-hour travel day.',
    },
    {
      q: 'How is my private location data secured?',
      a: 'We adhere to zero-knowledge privacy principles. Your real-time location is stored locally on your device and is never uploaded or monitored by TourSafe servers unless you explicitly activate an SOS broadcast or choose to share mutual live tracking with a designated family guardian.',
    },
    {
      q: 'Can TourSafe be shared with family members or tour groups?',
      a: 'Yes! Our Mutual Guardian feature allows you to link with family members or travel companions. You can configure automated "Safe Arrival" check-ins and receive battery telemetry if a companion’s phone falls below 10% in a foreign city.',
    },
  ];

  return (
    <section id="faq" className="relative py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Everything you need to know about TourSafe's emergency architecture, offline coverage, and privacy.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-800 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>256-bit Encryption • Zero Commercial Data Tracking • ISO 27001 Security Standard</span>
        </div>

      </div>
    </section>
  );
}
