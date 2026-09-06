import React from 'react';
import { Compass, ShieldCheck, Cpu, HeartHandshake } from 'lucide-react';

export default function Pillars() {
  const pillars = [
    {
      num: '01',
      title: 'Predictive Crowd Telemetry',
      subtitle: 'Anticipating Congestion Before It Materializes',
      description:
        'We monitor hourly visitor surges across historic monument gates and transit axes, giving you exact time windows where iconic spaces are virtually empty.',
      icon: <Cpu className="w-5 h-5 text-[#234236]" />,
      tag: 'Spatial Intelligence',
    },
    {
      num: '02',
      title: 'Intelligent Route Diversion',
      subtitle: 'Trading Queues for Architectural Sanctuaries',
      description:
        'Instead of following standard Delhi-Agra-Jaipur tour bus itineraries, our algorithm weaves serene stepwells, hillside cenotaphs, and living artisan havelis into your day.',
      icon: <Compass className="w-5 h-5 text-[#C66A4A]" />,
      tag: 'Alternative Cartography',
    },
    {
      num: '03',
      title: 'Living Artisan Heritage',
      subtitle: 'Direct Revenue to Traditional Custodians',
      description:
        'Bypassing commercial emporiums and commission-heavy middlemen. We connect you directly to authentic woodblock printers, blue pottery masters, and generational cooks.',
      icon: <HeartHandshake className="w-5 h-5 text-[#234236]" />,
      tag: 'Equitable Tourism',
    },
    {
      num: '04',
      title: 'Contextual Traveler Safety',
      subtitle: 'Security Rooted in Local Knowledge',
      description:
        'Real-time safety indexes tailored for solo female travelers, night walking route illuminations, verified tourist police desks, and transparent local fare guidelines.',
      icon: <ShieldCheck className="w-5 h-5 text-[#C66A4A]" />,
      tag: 'Guardian Security',
    },
  ];

  return (
    <section className="py-24 bg-[#F5F1E8] border-b border-[#D8D1C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C66A4A] text-xs uppercase font-bold tracking-[0.2em] block mb-2">
            The System Architecture
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#24231F] font-normal">
            Four Pillars of Mindful Exploration
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#6F6A61] leading-relaxed">
            BeyondMaps replaces generic commercial tourism with intelligent crowd redistribution,
            deep cultural respect, and safety-grounded discovery.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] border border-[#D8D1C5] p-6 sm:p-7 flex flex-col justify-between hover:border-[#234236] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D8D1C5]">
                  <span className="font-mono text-2xl font-bold text-[#234236]">
                    {p.num}
                  </span>
                  <div className="p-2 bg-[#F5F1E8] border border-[#D8D1C5]">
                    {p.icon}
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C66A4A] block mb-1">
                  {p.tag}
                </span>

                <h3 className="font-editorial text-xl text-[#24231F] font-semibold mb-2">
                  {p.title}
                </h3>

                <p className="text-xs text-[#6F6A61] leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8D1C5] text-[11px] text-[#6F6A61] italic">
                {p.subtitle}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
