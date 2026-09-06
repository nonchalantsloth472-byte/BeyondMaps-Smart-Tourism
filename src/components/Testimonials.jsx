import React from 'react';
import { Star, Shield, CheckCircle } from './Icons';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Elena Rostova',
      role: 'Solo Backpacker & Travel Writer',
      location: 'Traveled across 28 countries',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      story:
        'As a solo female traveler, TourSafe is the first app I turn on when landing. While walking in Naples at dusk, it buzzed gently warning me I was heading into an unlit zone with high scooter thefts, rerouting me seamlessly. Irreplaceable peace of mind.',
      rating: 5,
      destination: 'Naples, Italy',
    },
    {
      name: 'Marcus & Sarah Davies',
      role: 'Family Vacationers (2 Kids, 6 & 9)',
      location: 'London, United Kingdom',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      story:
        'Our youngest had an acute allergic reaction while we were in Kyoto. TourSafe pinned the nearest pediatric emergency hospital with English-speaking staff and called an emergency taxi. We arrived in 6 minutes. It literally saved our holiday.',
      rating: 5,
      destination: 'Kyoto, Japan',
    },
    {
      name: 'Arjun Mehta',
      role: 'Remote Software Engineer & Nomad',
      location: 'Remote Explorer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      story:
        'My daypack with my physical passport was pickpocketed at a train terminus. TourSafe’s encrypted offline document vault gave me instant verified ID proof at the embassy, cutting red tape from 4 days to 4 hours.',
      rating: 5,
      destination: 'Barcelona, Spain',
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 bg-slate-900/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Real Traveler Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted By 450,000+ Adventurers
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Read how TourSafe's proactive danger alerts and rapid emergency dispatch protected travelers in real situations worldwide.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all duration-300 shadow-md"
            >
              <div>
                {/* Rating Stars & Location Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {r.destination}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{r.story}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <span>{r.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
