import React, { useState } from 'react';
import { ArrowRight, Clock, Users, MapPin, Check, AlertCircle, ArrowLeftRight } from 'lucide-react';

export default function CrowdComparison() {
  const [activeCase, setActiveCase] = useState(0);

  const cases = [
    {
      title: 'Amer Heritage Basin',
      location: 'Jaipur, Rajasthan',
      overcrowded: {
        name: 'Amber Palace Central Courtyards',
        tag: 'Overcrowded Hotspot',
        crowdScore: 89,
        avgWait: '45–60 min queue',
        dailyFootfall: '~7,800 visitors/day',
        experience:
          'Midday tourist coach influx, loud megaphone tour guides, pushy souvenir touts, and long lines at the Ganesh Pol gate.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      },
      alternative: {
        name: 'Panna Meena Ka Kund & Anokhi Museum',
        tag: 'The Beyond Alternative',
        crowdScore: 14,
        distance: '650m from Amber gate',
        dailyFootfall: '~240 visitors/day',
        experience:
          'A quiet 16th-century stepwell with mesmerizing geometric stairways, followed by a restored haveli museum showcasing indigenous woodblock textile arts.',
        highlights: ['Solitary reflection', 'Direct interaction with master printers', 'Zero admission queue'],
        image: 'https://images.unsplash.com/photo-1609947017136-9e208b072c72?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      title: 'Pink City Royal Facades',
      location: 'Walled City, Jaipur',
      overcrowded: {
        name: 'Hawa Mahal Roadside Selfie Rush',
        tag: 'Overcrowded Hotspot',
        crowdScore: 92,
        avgWait: 'No queue, extreme sidewalk congestion',
        dailyFootfall: '~11,000 passers-by',
        experience:
          'Heavy vehicular traffic exhaust, honking auto-rickshaws, aggressive street hawkers, and hurried five-minute selfie stops.',
        image: 'https://images.unsplash.com/photo-1603201667141-5a2d4c673378?auto=format&fit=crop&w=800&q=80',
      },
      alternative: {
        name: 'Gaitor Ki Chhatriyan (Royal Cenotaphs)',
        tag: 'The Beyond Alternative',
        crowdScore: 18,
        distance: '3.2 km north along the hills',
        dailyFootfall: '~180 visitors/day',
        experience:
          'Secluded complex of intricately carved marble and sandstone cenotaphs beneath the forested slopes of the Aravalli hills. Pure architectural stillness.',
        highlights: ['Exquisite stone lace carvings', 'Peacock calls at sunset', 'Rarely featured in standard package tours'],
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      title: 'Craft & Market Encounters',
      location: 'Greater Jaipur Region',
      overcrowded: {
        name: 'Bapu Bazaar Tourist Souvenir Corridor',
        tag: 'Overcrowded Hotspot',
        crowdScore: 84,
        avgWait: 'Dense foot traffic',
        dailyFootfall: '~14,500 footfalls',
        experience:
          'Mass-manufactured synthetic textiles sold at marked-up tourist rates, high-pressure bargaining, and overcrowded pedestrian walkways.',
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
      },
      alternative: {
        name: 'Bagru Dabu Mud-Resist Printing Enclave',
        tag: 'The Beyond Alternative',
        crowdScore: 11,
        distance: '28 km west of Jaipur',
        dailyFootfall: '~65 visiting travelers/day',
        experience:
          'A centuries-old artisan village where the Chippa community prints fabrics using river mud, natural indigo, and tamarind seed paste. You can dye your own scarf.',
        highlights: ['100% genuine artisan revenue', 'Tactile workshop experience', 'Support living cultural heritage'],
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      },
    },
  ];

  const current = cases[activeCase];

  return (
    <section id="comparison" className="py-24 bg-[#F5F1E8] border-b border-[#D8D1C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#D8D1C5] gap-6">
          <div>
            <span className="text-[#C66A4A] text-xs uppercase font-bold tracking-[0.2em] block mb-2">
              The BeyondMaps Methodology
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#24231F] font-normal">
              The Obvious vs. The Intimate
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#6F6A61] max-w-md font-sans leading-relaxed">
            Every tourist bottleneck has an extraordinary, quiet alternative just minutes away.
            Here is how intelligent rerouting transforms your perception of Rajasthan.
          </p>
        </div>

        {/* Case Study Selection Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {cases.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCase(idx)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                activeCase === idx
                  ? 'bg-[#234236] text-[#F5F1E8] border-[#234236]'
                  : 'bg-[#FFFFFF] text-[#6F6A61] border-[#D8D1C5] hover:border-[#234236]'
              }`}
            >
              Case 0{idx + 1}: {c.title}
            </button>
          ))}
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Overcrowded Hotspot (The Obvious) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D8D1C5] p-6 sm:p-7 flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D1C5]">
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#6F6A61]">
                  THE CONGESTED PATH
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 rounded-none">
                  Crowd Index: {current.overcrowded.crowdScore}/100
                </span>
              </div>

              {/* Photo Frame */}
              <div className="relative aspect-[16/9] w-full mt-4 mb-4 overflow-hidden bg-[#D8D1C5] filter grayscale-[25%]">
                <img
                  src={current.overcrowded.image}
                  alt={current.overcrowded.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#24231F]/80 text-[#FFFFFF] text-[10px] uppercase font-mono px-2 py-0.5">
                  High Density Bottleneck
                </div>
              </div>

              <h3 className="font-editorial text-2xl text-[#24231F] font-semibold">
                {current.overcrowded.name}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-[#6F6A61]">
                <div>Average Influx: <strong className="text-[#24231F]">{current.overcrowded.dailyFootfall}</strong></div>
                <div>Queue Times: <strong className="text-[#24231F]">{current.overcrowded.avgWait}</strong></div>
              </div>

              <p className="mt-4 text-xs text-[#6F6A61] leading-relaxed">
                {current.overcrowded.experience}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D8D1C5] text-[11px] text-[#6F6A61] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#C66A4A]" />
              <span>Heavy congestion window: 10:30 AM – 03:45 PM daily</span>
            </div>
          </div>

          {/* Middle Transition Column / Indicator */}
          <div className="lg:col-span-2 flex lg:flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#234236] text-[#F5F1E8] flex items-center justify-center shadow-sm">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="hidden lg:block font-editorial text-sm italic text-[#234236] mt-3 font-semibold">
              Reroute via BeyondMaps
            </span>
          </div>

          {/* Right Column: Beyond Alternative (The Intimate) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border-2 border-[#234236] p-6 sm:p-7 flex flex-col justify-between shadow-md relative">
            
            {/* Top Accent Stamp */}
            <div className="absolute -top-3 right-6 bg-[#C66A4A] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
              Verified Quiet Haven
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D1C5]">
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#234236]">
                  THE BEYONDMAPS ROUTE
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#234236]">
                  Crowd Index: {current.alternative.crowdScore}/100 (Serene)
                </span>
              </div>

              {/* Photo Frame */}
              <div className="relative aspect-[16/9] w-full mt-4 mb-4 overflow-hidden bg-[#D8D1C5] border border-[#D8D1C5]">
                <img
                  src={current.alternative.image}
                  alt={current.alternative.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 bg-[#234236] text-[#F5F1E8] text-[10px] font-mono px-2 py-0.5">
                  Proximity: {current.alternative.distance}
                </div>
              </div>

              <h3 className="font-editorial text-2xl text-[#234236] font-semibold">
                {current.alternative.name}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-[#6F6A61]">
                <div>Daily Visitors: <strong className="text-[#234236]">{current.alternative.dailyFootfall}</strong></div>
                <div>Proximity to hotspot: <strong className="text-[#234236]">{current.alternative.distance}</strong></div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#24231F] leading-relaxed">
                {current.alternative.experience}
              </p>

              {/* Highlights Checkmark List */}
              <ul className="mt-4 space-y-1.5 pt-3 border-t border-[#D8D1C5]/80 text-xs text-[#24231F]">
                {current.alternative.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#234236] stroke-[2.5]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D8D1C5] flex items-center justify-between">
              <span className="text-xs text-[#6F6A61]">
                Coordinates & route cached offline
              </span>
              <a
                href="#plan-trip"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#234236] hover:text-[#C66A4A] transition-colors"
              >
                <span>Add To Custom Route</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
