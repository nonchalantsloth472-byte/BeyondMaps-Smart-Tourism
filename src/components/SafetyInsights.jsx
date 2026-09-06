import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, CheckCircle2, Lock, HeartHandshake } from 'lucide-react';

export default function SafetyInsights() {
  return (
    <section id="safety" className="py-24 bg-[#F5F1E8] border-b border-[#D8D1C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#D8D1C5] gap-6">
          <div>
            <span className="text-[#C66A4A] text-xs uppercase font-bold tracking-[0.2em] block mb-2">
              Contextual Intelligence & Safety
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#24231F] font-normal">
              Travel Safely, Tread Respectfully
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#6F6A61] max-w-md leading-relaxed">
            Real safety is knowing where to step, who to call, and how to honor the cultural sanctuary of every space you enter.
          </p>
        </div>

        {/* Safety Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Regional Safety Telemetry Card */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D8D1C5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D1C5]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#234236]" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#234236]">
                  Jaipur Heritage Belt · Safety Index
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#234236] bg-[#234236]/10 px-2 py-0.5">
                92 / 100 (HIGH CONFIDENCE)
              </span>
            </div>

            {/* Sub-ratings */}
            <div className="mt-6 space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-[#24231F] mb-1 font-medium">
                  <span>Solo Traveler Security</span>
                  <span className="font-bold text-[#234236]">94% Safe</span>
                </div>
                <div className="w-full bg-[#D8D1C5]/50 h-1.5 rounded-none">
                  <div className="bg-[#234236] h-full w-[94%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#24231F] mb-1 font-medium">
                  <span>Daylight & Walled City Navigation</span>
                  <span className="font-bold text-[#234236]">96% Safe</span>
                </div>
                <div className="w-full bg-[#D8D1C5]/50 h-1.5 rounded-none">
                  <div className="bg-[#234236] h-full w-[96%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#24231F] mb-1 font-medium">
                  <span>Transit & Fair Fare Transparency</span>
                  <span className="font-bold text-[#C66A4A]">86% (Use Prepaid Stands)</span>
                </div>
                <div className="w-full bg-[#D8D1C5]/50 h-1.5 rounded-none">
                  <div className="bg-[#C66A4A] h-full w-[86%]"></div>
                </div>
              </div>
            </div>

            {/* Verified Emergency Lines */}
            <div className="mt-8 pt-6 border-t border-[#D8D1C5] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#F5F1E8] border border-[#D8D1C5]">
                <span className="text-[10px] text-[#6F6A61] uppercase tracking-wider block">Universal Helpline</span>
                <strong className="text-sm font-mono text-[#234236] font-bold">112</strong>
              </div>
              <div className="p-3 bg-[#F5F1E8] border border-[#D8D1C5]">
                <span className="text-[10px] text-[#6F6A61] uppercase tracking-wider block">Women Safety Helpline</span>
                <strong className="text-sm font-mono text-[#234236] font-bold">1090</strong>
              </div>
              <div className="p-3 bg-[#F5F1E8] border border-[#D8D1C5]">
                <span className="text-[10px] text-[#6F6A61] uppercase tracking-wider block">Tourist Police Desk</span>
                <strong className="text-sm font-mono text-[#234236] font-bold">1363 (24/7)</strong>
              </div>
            </div>

            {/* Offline Advisory Notice */}
            <div className="mt-6 p-4 bg-[#F5F1E8]/70 border border-[#D8D1C5] text-xs text-[#6F6A61] flex items-start gap-3">
              <Lock className="w-4 h-4 text-[#234236] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                All safety contacts and verified hospital geo-points are cached into your device’s local memory so you remain equipped even without active roaming data.
              </p>
            </div>
          </div>

          {/* Right Column: The Ethical Explorer Charter */}
          <div className="lg:col-span-5 bg-[#234236] text-[#F5F1E8] p-6 sm:p-8 border border-[#234236] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C66A4A] block mb-2">
              BeyondMaps Responsible Travel Code
            </span>
            <h3 className="font-editorial text-2xl text-[#F5F1E8] font-normal mb-6">
              The Ethical Traveler Charter
            </h3>

            <div className="space-y-4 text-xs text-[#D8D1C5]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#C66A4A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#FFFFFF] block mb-0.5">Honor Living Sanctuaries</strong>
                  <span>Always remove footwear at stepwell thresholds and temples. Maintain silence in cenotaph chambers.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#C66A4A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#FFFFFF] block mb-0.5">Pay Artisans Directly</strong>
                  <span>Refuse commercial middlemen fees. Purchase directly from family workshops in Sanganer and Kot Jewar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#C66A4A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#FFFFFF] block mb-0.5">Zero Single-Use Waste</strong>
                  <span>Carry reusable copper or steel flasks. Desert heritage monuments face severe plastic litter pressures.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#C66A4A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#FFFFFF] block mb-0.5">Photograph with Permission</strong>
                  <span>Always request verbal consent before photographing local artisans, elders, or sacred rituals.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#D8D1C5]">
              <span>Eco-Heritage Compliant</span>
              <span className="text-[#C66A4A] font-semibold">100% Community Grounded</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
