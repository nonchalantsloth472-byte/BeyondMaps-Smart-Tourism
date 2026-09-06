import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle, MapPin, PhoneCall, Radio } from './Icons';

export default function SosDemoModal({ isOpen, onClose }) {
  const [stage, setStage] = useState('idle'); // idle, countdown, dispatched
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer;
    if (stage === 'countdown' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (stage === 'countdown' && countdown === 0) {
      setStage('dispatched');
    }
    return () => clearTimeout(timer);
  }, [stage, countdown]);

  if (!isOpen) return null;

  const startCountdown = () => {
    setCountdown(5);
    setStage('countdown');
  };

  const cancelCountdown = () => {
    setStage('idle');
    setCountdown(5);
  };

  const resetAll = () => {
    setStage('idle');
    setCountdown(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Emergency SOS Simulation Mode</h3>
            <p className="text-xs text-slate-400">Safe sandbox test of TourSafe multi-channel dispatch</p>
          </div>
        </div>

        {/* Stage 1: IDLE */}
        {stage === 'idle' && (
          <div className="text-center py-6">
            <div className="relative inline-block mb-6">
              <span className="animate-ping absolute inset-0 rounded-full bg-rose-500/20"></span>
              <button
                onClick={startCountdown}
                className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 text-white font-extrabold text-2xl tracking-wider shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center border-4 border-rose-400/40 cursor-pointer"
              >
                <span>SOS</span>
                <span className="text-[10px] tracking-normal font-medium opacity-90">TAP TO TEST</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Pressing SOS simulates sending a high-priority distress packet with your real-time GPS,
              medical profile, and embassy notification with a 5-second false-alarm cancel window.
            </p>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Satellite Ping</span>
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                <span>Multi-Channel Broadcast</span>
              </span>
            </div>
          </div>
        )}

        {/* Stage 2: COUNTDOWN */}
        {stage === 'countdown' && (
          <div className="text-center py-8">
            <div className="text-6xl font-black text-rose-500 font-mono tracking-tight mb-2 animate-bounce">
              0{countdown}
            </div>
            <div className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
              Dispatching SOS Broadcast...
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
              Accidental trigger? Tap the cancel button below to immediately halt all distress transmissions.
            </p>

            <button
              onClick={cancelCountdown}
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors cursor-pointer"
            >
              Cancel False Alarm
            </button>
          </div>
        )}

        {/* Stage 3: DISPATCHED */}
        {stage === 'dispatched' && (
          <div className="py-2 space-y-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-300">
                  SOS Broadcast Transmitted Successfully
                </div>
                <div className="text-[11px] text-emerald-400/80">
                  Telemetry delivered to 3 emergency channels in 1.4 seconds.
                </div>
              </div>
            </div>

            {/* Telemetry packet details */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">GPS Ping Broadcasted:</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">35.6895° N, 139.6917° E (±1.8m)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-300">Local Police Relay (110):</span>
                </div>
                <span className="font-mono text-teal-400 font-bold">Connected • High Priority</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span className="text-slate-300">Emergency Medical Dossier:</span>
                </div>
                <span className="font-mono text-slate-300">Blood O+ • Penicillin Alert</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={resetAll}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                Reset Simulation
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
