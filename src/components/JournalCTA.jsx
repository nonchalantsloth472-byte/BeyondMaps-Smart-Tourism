import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function JournalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="plan-trip" className="py-24 bg-[#F5F1E8] border-b border-[#D8D1C5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <span className="text-[#C66A4A] text-xs uppercase font-bold tracking-[0.2em] block mb-3">
          Start Your Discovery
        </span>

        <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#24231F] font-normal leading-tight">
          Ready to wander where <br className="hidden sm:inline" />
          <span className="italic text-[#234236]">the crowds don’t?</span>
        </h2>

        <p className="mt-6 text-base sm:text-lg text-[#6F6A61] max-w-xl mx-auto leading-relaxed">
          Receive curated seasonal field routes, crowd telemetry forecasts, and invitations to private artisan workshops across Rajasthan.
        </p>

        {/* Minimalist Editorial Input Form */}
        <div className="mt-10 max-w-md mx-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 bg-[#FFFFFF] p-2 border border-[#D8D1C5] shadow-sm">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-xs sm:text-sm text-[#24231F] placeholder-[#6F6A61] bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#234236] hover:bg-[#1a3229] text-[#F5F1E8] text-xs uppercase font-semibold tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              >
                Join Dispatch
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#FFFFFF] border border-[#234236] flex items-center justify-center gap-2 text-xs font-semibold text-[#234236]">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>You are subscribed to the BeyondMaps field dispatches.</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#6F6A61]">
          <span>• Zero tourist commercial spam</span>
          <span>• Curated monthly dispatches</span>
          <span>• 100% verified artisan routes</span>
        </div>

      </div>
    </section>
  );
}
