import React from 'react';
import { Shield, Activity, Globe, HeartPulse } from './Icons';

export default function Stats() {
  const metrics = [
    {
      value: '450,000+',
      label: 'Protected Travelers',
      subtext: 'Solo adventurers, families, and global teams',
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
    },
    {
      value: '142',
      label: 'Countries Active',
      subtext: 'Continually mapped municipal safe havens',
      icon: <Shield className="w-5 h-5 text-teal-400" />,
    },
    {
      value: '< 40s',
      label: 'Emergency Response Relay',
      subtext: 'Fastest multi-channel SOS transmission',
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
    },
    {
      value: '99.8%',
      label: 'SLA Reliability',
      subtext: 'Backed by satellite mesh fallbacks',
      icon: <HeartPulse className="w-5 h-5 text-rose-400" />,
    },
  ];

  return (
    <section className="relative py-16 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  {m.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Live Metric
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {m.value}
                </div>
                <div className="text-sm font-bold text-slate-200 mt-1">{m.label}</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
