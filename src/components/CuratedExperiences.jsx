import React from 'react';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';

export default function CuratedExperiences() {
  const stories = [
    {
      chapter: 'CHAPTER I · WATER ARCHITECTURE',
      title: 'The Sacred Geometry of Stepwells',
      subtitle: 'How 16th-century desert engineers created subterranean sanctuaries of water and shadow.',
      location: 'Amer & Abhaneri, Rajasthan',
      duration: '3 Hours · Early Morning',
      crowdIndex: '12 / 100 (Quiet)',
      image: 'https://images.unsplash.com/photo-1609947017136-9e208b072c72?auto=format&fit=crop&w=800&q=80',
      tag: 'Architectural Heritage',
    },
    {
      chapter: 'CHAPTER II · CULINARY CARTOGRAPHY',
      title: 'Dawn at the Halwai Kettles of Johari Bazaar',
      subtitle: 'Tasting slow-cooked hing kachori, hand-churned buttermilk, and mawa sweets before the city awakes.',
      location: 'Old City, Jaipur',
      duration: '2 Hours · 06:30 AM',
      crowdIndex: '19 / 100 (Authentic Local)',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      tag: 'Gastronomy & Living Traditions',
    },
    {
      chapter: 'CHAPTER III · TEXTILE MASTERY',
      title: 'Dabu Mud-Resist & Indigo Vats of Bagru',
      subtitle: 'Walking the riverbed drying grounds with fifth-generation block printers and natural herb dyers.',
      location: 'Bagru Artisan Enclave',
      duration: '4 Hours · Hands-on Workshop',
      crowdIndex: '08 / 100 (Undiscovered)',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      tag: 'Master Craftsmanship',
    },
    {
      chapter: 'CHAPTER IV · TWILIGHT CARTOGRAPHY',
      title: 'The Silent Ramparts Above Nahargarh Ridge',
      subtitle: 'A sunset perimeter walk along the rugged crest of the Aravalli hills overlooking the amber glow of Jaipur.',
      location: 'Nahargarh Escarpment',
      duration: '2.5 Hours · Golden Hour',
      crowdIndex: '22 / 100 (Breezy Solitude)',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      tag: 'Landscape & Solitude',
    },
  ];

  return (
    <section id="experiences" className="py-24 bg-[#F5F1E8] border-b border-[#D8D1C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#D8D1C5] gap-6">
          <div>
            <span className="text-[#C66A4A] text-xs uppercase font-bold tracking-[0.2em] block mb-2">
              Curated Field Experiences
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#24231F] font-normal">
              Stories Beyond The Guidebook
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#6F6A61] max-w-md leading-relaxed">
            Direct connections to certified local storytellers, master craftsmen,
            and secluded heritage landscapes unmarred by commercial mass tourism.
          </p>
        </div>

        {/* Editorial Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] border border-[#D8D1C5] p-6 sm:p-8 flex flex-col justify-between group hover:border-[#234236] transition-all duration-300"
            >
              <div>
                {/* Story Image Crop */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#D8D1C5] mb-6">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#234236] text-[#F5F1E8] text-[10px] font-sans uppercase font-bold tracking-widest px-2.5 py-1">
                    {story.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#F5F1E8] border border-[#D8D1C5] text-[#24231F] text-[11px] font-mono px-2.5 py-1">
                    Crowd Index: <strong className="text-[#234236]">{story.crowdIndex}</strong>
                  </div>
                </div>

                {/* Chapter & Title */}
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C66A4A] block mb-2">
                  {story.chapter}
                </span>

                <h3 className="font-editorial text-2xl sm:text-3xl text-[#24231F] group-hover:text-[#234236] transition-colors leading-tight mb-3">
                  {story.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6F6A61] leading-relaxed mb-6 font-sans">
                  {story.subtitle}
                </p>
              </div>

              {/* Metadata Footer */}
              <div className="pt-4 border-t border-[#D8D1C5] flex items-center justify-between text-xs text-[#6F6A61]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#234236]" />
                    <span>{story.location}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C66A4A]" />
                    <span>{story.duration}</span>
                  </span>
                </div>
                <a
                  href="#plan-trip"
                  className="font-bold text-[#234236] hover:text-[#C66A4A] flex items-center gap-1 transition-colors"
                >
                  <span>Explore Route</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
