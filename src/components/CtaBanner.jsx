import React, { useState } from 'react';
import { Shield, ChevronRight, CheckCircle, Lock } from './Icons';

export default function CtaBanner({ onOpenSosModal }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow backdrop */}
        <div className="relative rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-800 border border-slate-700 p-8 sm:p-14 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <Shield className="w-3.5 h-3.5" />
              <span>TourSafe Free Departure Protection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Don’t Take Chances <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                With Your Next Adventure.
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Get free instant destination safety dossiers, automatic foreign emergency numbers,
              and 1-tap SOS protection for your upcoming travels.
            </p>

            {/* Email Form */}
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Get Shield
                </button>
              </form>
            ) : (
              <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Thank you! Your TourSafe starter safety pack has been dispatched.</span>
              </div>
            )}

            {/* Quick Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Free Basic Plan Included</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Credit Card Required</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Spam Guarantee</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
