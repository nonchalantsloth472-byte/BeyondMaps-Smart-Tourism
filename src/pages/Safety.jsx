import { useEffect, useRef, useState } from "react";
import {
  Siren,
  Ambulance,
  Flame,
  BookmarkCheck,
  Eye,
  Share2,
  Info,
  Phone,
  PhoneOff,
  MapPin,
  Clock,
  Users,
  Cloud,
  ShieldCheck,
  Wifi,
  Navigation,
  Check,
  X,
} from "lucide-react";
import IndianOrnament from "../components/IndianOrnament";
import RevealOnScroll from "../components/RevealOnScroll";
import SpotlightCard from "../components/SpotlightCard";

const EMERGENCY_CONTACTS = [
  {
    icon: Siren,
    title: "Police",
    number: "112",
    tel: "tel:112",
    description: "For immediate emergency assistance.",
  },
  {
    icon: Ambulance,
    title: "Ambulance",
    number: "108",
    tel: "tel:108",
    description: "For medical emergencies and urgent care.",
  },
  {
    icon: Flame,
    title: "Fire & Rescue",
    number: "101",
    tel: "tel:101",
    description: "For fire and rescue emergencies.",
  },
];

const TIPS = [
  {
    icon: BookmarkCheck,
    title: "Keep emergency contacts accessible",
    description:
      "Save important numbers before heading to a new destination.",
  },
  {
    icon: Eye,
    title: "Stay aware in crowded places",
    description:
      "Keep your belongings secure and stay aware of your surroundings.",
  },
  {
    icon: Share2,
    title: "Share your travel plans",
    description:
      "Let someone you trust know your itinerary and expected route.",
  },
  {
    icon: Info,
    title: "Follow local guidance",
    description:
      "Pay attention to official warnings, weather conditions and local instructions.",
  },
];

const SAFETY_INTEL = [
  { icon: ShieldCheck, label: "Safety Status", value: "Good" },
  { icon: Users, label: "Crowd Level", value: "Low" },
  { icon: Clock, label: "Best Travel Window", value: "08:00 – 18:00" },
  { icon: MapPin, label: "Emergency Services", value: "Nearby" },
  { icon: Cloud, label: "Weather", value: "Clear" },
];

const CHECKLIST = [
  "Keep emergency contacts saved",
  "Keep your phone charged",
  "Stay aware in unfamiliar areas",
  "Avoid isolated routes late at night",
  "Share your itinerary with someone you trust",
];

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Safety() {
  const [emergencyActive, setEmergencyActive] = useState(false);

  const [activeCall, setActiveCall] = useState(null); // { title, number, tel }
  const [callStatus, setCallStatus] = useState("connecting"); // "connecting" | "connected"
  const [callSeconds, setCallSeconds] = useState(0);

  const audioCtxRef = useRef(null);
  const ringIntervalRef = useRef(null);
  const connectTimeoutRef = useRef(null);
  const callTimerRef = useRef(null);
  const emergencyIntervalRef = useRef(null);

  // ---------- shared audio helpers ----------

  const getAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  };

  const playBeep = (freq = 480, duration = 0.3, volume = 0.22) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  };

  // ---------- emergency call overlay ----------

  const stopRinging = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
  };

  const clearCallTimers = () => {
    stopRinging();
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };

  const startCall = (contact) => {
    // Reset any previous call state before starting a new one.
    clearCallTimers();

    setActiveCall(contact);
    setCallStatus("connecting");
    setCallSeconds(0);

    // Ringing tone: a soft pulse repeated while "connecting".
    playBeep(480, 0.35, 0.22);
    ringIntervalRef.current = setInterval(() => playBeep(480, 0.35, 0.22), 1400);

    // Deterministic connect delay for a reliable demo.
    connectTimeoutRef.current = setTimeout(() => {
      stopRinging();
      setCallStatus("connected");
    }, 2400);

    // Call timer ticks regardless of connecting/connected state.
    callTimerRef.current = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
  };

  const endCall = () => {
    clearCallTimers();
    setActiveCall(null);
    setCallStatus("connecting");
    setCallSeconds(0);
  };

  const handleContactClick = (event, contact) => {
    // Always show the simulated overlay first and on its own terms —
    // we don't rely on the anchor's default navigation, since some
    // mobile browsers interrupt in-page state updates while resolving
    // a tel: link. Preventing default guarantees the demo UI renders,
    // then we attempt the real dial a beat later so it never blocks
    // or races with the overlay appearing.
    event.preventDefault();
    startCall(contact);

    window.setTimeout(() => {
      window.location.href = contact.tel;
    }, 350);
  };

  // ---------- SOS / emergency activation ----------

  const stopEmergencySound = () => {
    if (emergencyIntervalRef.current) {
      clearInterval(emergencyIntervalRef.current);
      emergencyIntervalRef.current = null;
    }
  };

  const activateEmergency = () => {
    setEmergencyActive(true);
    playBeep(820, 0.32, 0.25);
    emergencyIntervalRef.current = setInterval(() => playBeep(820, 0.32, 0.25), 1100);
  };

  const deactivateEmergency = () => {
    setEmergencyActive(false);
    stopEmergencySound();
  };

  const toggleEmergency = () => {
    if (emergencyActive) {
      deactivateEmergency();
    } else {
      activateEmergency();
    }
  };

  // ---------- cleanup on unmount ----------

  useEffect(() => {
    return () => {
      clearCallTimers();
      stopEmergencySound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  return (
    <main className="bg-[#F5F1E8] text-[#24231F] overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#C9D2C5] border-b border-[#D8D1C5]">

        <IndianOrnament
          variant="corner"
          color="#234236"
          opacity={0.16}
          duration={65}
          className="absolute -left-14 -top-10 w-96 h-96 pointer-events-none"
        />

        <IndianOrnament
          variant="corner"
          color="#C66A4A"
          opacity={0.15}
          duration={80}
          reverse
          className="absolute -right-16 -bottom-16 w-80 h-80 pointer-events-none rotate-180"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16 items-center">

            <RevealOnScroll>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C66A4A] font-semibold mb-6">
                Travel with confidence
              </p>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#234236]">
                India,
                <br />
                <span className="italic text-[#24231F]">explored safely.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-relaxed text-[#6F6A61]">
                Quick access to emergency support, important contacts and
                safety information while you travel.
              </p>

              <button
                type="button"
                onClick={toggleEmergency}
                className={`
                  inline-flex items-center gap-3 mt-9
                  px-8 py-4 text-xs uppercase tracking-[0.18em] font-semibold
                  text-white transition-all duration-300
                  ${
                    emergencyActive
                      ? "bg-[#8f2f24] animate-pulse"
                      : "bg-[#C66A4A] hover:bg-[#234236]"
                  }
                `}
              >
                <Siren size={16} strokeWidth={1.75} />
                {emergencyActive ? "Deactivate emergency" : "Activate emergency"}
              </button>

              {/* EMERGENCY STATUS PANEL */}
              <div
                className={`
                  grid transition-all duration-500 ease-out overflow-hidden
                  ${emergencyActive ? "grid-rows-[1fr] opacity-100 mt-7" : "grid-rows-[0fr] opacity-0 mt-0"}
                `}
              >
                <div className="min-h-0">
                  <div className="border border-[#8f2f24]/30 bg-white/70 backdrop-blur-0 px-6 py-5 max-w-md">
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8f2f24] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8f2f24]" />
                      </span>
                      <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#8f2f24]">
                        Emergency Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="flex items-start gap-2.5">
                        <Navigation size={15} strokeWidth={1.75} className="text-[#234236] mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6F6A61]">Location</p>
                          <p className="text-sm text-[#24231F] mt-0.5">Current location detected</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <ShieldCheck size={15} strokeWidth={1.75} className="text-[#234236] mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6F6A61]">Response</p>
                          <p className="text-sm text-[#24231F] mt-0.5">Response initiated</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Wifi size={15} strokeWidth={1.75} className="text-[#234236] mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6F6A61]">Signal</p>
                          <p className="text-sm text-[#24231F] mt-0.5">Strong</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Siren size={15} strokeWidth={1.75} className="text-[#8f2f24] mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6F6A61]">Status</p>
                          <p className="text-sm font-semibold text-[#8f2f24] mt-0.5">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="lg:pt-4">
              <div className="relative h-[340px] lg:h-[400px] flex items-center justify-center overflow-hidden border border-[#D8D1C5]/60 bg-[#234236]">

                <IndianOrnament
                  variant="floral"
                  color="#F5F1E8"
                  opacity={0.16}
                  duration={90}
                  className="absolute w-[460px] h-[460px] pointer-events-none"
                />

                <div className="relative z-10 w-[190px] h-[190px] rounded-full border border-white/70 flex flex-col items-center justify-center text-white">
                  <span className="font-editorial text-5xl">24/7</span>
                  <small className="text-[9px] tracking-[0.2em] mt-1.5">
                    TRAVEL SUPPORT
                  </small>
                </div>

              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>


      {/* =====================================================
          EMERGENCY CONTACTS
      ===================================================== */}

      <section className="py-24 border-b border-[#D8D1C5] bg-[#E6EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <RevealOnScroll>
            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-end mb-14">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Emergency support
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                  Help when
                  <br />
                  <span className="italic text-[#24231F]">you need it.</span>
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#6F6A61]">
                These numbers work across India. Tap a card to place the call —
                on a phone it dials directly, and you'll see a live status
                overlay either way.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid sm:grid-cols-3 gap-6">
              {EMERGENCY_CONTACTS.map((contact) => {
                const Icon = contact.icon;
                return (
                  <SpotlightCard
                    key={contact.title}
                    className="bg-white border border-[#D8D1C5] p-9 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(35,66,54,0.35)]"
                  >
                    <Icon size={20} strokeWidth={1.5} className="text-[#C66A4A]" />

                    <h3 className="font-editorial text-2xl text-[#234236] mt-7">
                      {contact.title}
                    </h3>

                    <a
                      href={contact.tel}
                      onClick={(e) => handleContactClick(e, contact)}
                      className="block font-editorial text-5xl text-[#C66A4A] mt-3 hover:text-[#234236] transition-colors"
                    >
                      {contact.number}
                    </a>

                    <p className="text-sm text-[#6F6A61] mt-4 leading-relaxed">
                      {contact.description}
                    </p>

                    <span className="inline-flex items-center gap-2 mt-5 text-[10px] uppercase tracking-[0.16em] text-[#234236] font-semibold">
                      <Phone size={12} strokeWidth={2} />
                      Tap number to call
                    </span>
                  </SpotlightCard>
                );
              })}
            </div>
          </RevealOnScroll>

        </div>
      </section>


      {/* =====================================================
          TRAVEL SAFETY INTELLIGENCE + CHECKLIST
      ===================================================== */}

      <section className="relative py-24 border-b border-[#D8D1C5] overflow-hidden">

        <IndianOrnament
          variant="floral"
          color="#234236"
          opacity={0.13}
          duration={110}
          className="absolute right-[-14%] top-[-10%] w-[440px] h-[440px] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

          <RevealOnScroll>
            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-end mb-14">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Travel intelligence
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                  Travel safety
                  <br />
                  <span className="italic text-[#24231F]">intelligence.</span>
                </h2>
              </div>
              <div>
                <p className="max-w-xl text-sm leading-relaxed text-[#6F6A61]">
                  A quick snapshot to plan your day around, styled the way
                  live conditions will appear.
                </p>
                <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 border border-[#D8D1C5] text-[10px] uppercase tracking-[0.16em] text-[#6F6A61]">
                  <Info size={11} strokeWidth={2} />
                  Demo snapshot — not live data
                </span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
              {SAFETY_INTEL.map((item) => {
                const Icon = item.icon;
                return (
                  <SpotlightCard
                    key={item.label}
                    className="bg-white border border-[#D8D1C5] px-6 py-7 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <Icon size={18} strokeWidth={1.5} className="text-[#C66A4A]" />
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#6F6A61] mt-5">
                      {item.label}
                    </p>
                    <p className="font-editorial text-2xl text-[#234236] mt-1.5">
                      {item.value}
                    </p>
                  </SpotlightCard>
                );
              })}
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 border-t border-[#D8D1C5] pt-14">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Before you head out
                </p>
                <h3 className="font-editorial text-3xl text-[#234236] mt-4 leading-[0.95] mb-8">
                  Quick safety
                  <br />
                  <span className="italic text-[#24231F]">checklist.</span>
                </h3>

                <ul className="space-y-4">
                  {CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#234236]/10">
                        <Check size={12} strokeWidth={2.5} className="text-[#234236]" />
                      </span>
                      <span className="text-sm text-[#24231F] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative flex items-center justify-center border border-[#D8D1C5] bg-[#E6EBE3] py-14 px-8 overflow-hidden">
                <IndianOrnament
                  variant="floral"
                  color="#234236"
                  opacity={0.16}
                  duration={95}
                  className="absolute w-[340px] h-[340px] pointer-events-none"
                />
                <div className="relative z-10 text-center max-w-xs">
                  <ShieldCheck size={26} strokeWidth={1.5} className="text-[#C66A4A] mx-auto" />
                  <p className="font-editorial text-2xl text-[#234236] mt-5 leading-tight">
                    Prepared travelers have safer journeys.
                  </p>
                  <p className="text-sm text-[#6F6A61] mt-3 leading-relaxed">
                    A few minutes of preparation goes a long way across
                    India's cities, heritage sites and countryside routes.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

        </div>
      </section>


      {/* =====================================================
          SAFETY TIPS
      ===================================================== */}

      <section className="relative py-24 border-b border-[#D8D1C5]">

        <IndianOrnament
          variant="floral"
          color="#234236"
          opacity={0.13}
          duration={100}
          className="absolute left-[-12%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-14">

            <RevealOnScroll>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                Travel smart
              </p>
              <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                A few things
                <br />
                <span className="italic text-[#24231F]">worth knowing.</span>
              </h2>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="border-t border-[#D8D1C5]">
                {TIPS.map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={tip.title}
                      className="grid grid-cols-[40px_1fr] gap-5 py-7 border-b border-[#D8D1C5]"
                    >
                      <Icon size={18} strokeWidth={1.5} className="text-[#C66A4A] mt-1" />
                      <div>
                        <h3 className="font-editorial text-xl text-[#234236]">
                          {tip.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#6F6A61] mt-2">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#234236] text-white py-28 text-center">

        <IndianOrnament
          variant="divider"
          color="#C66A4A"
          opacity={0.5}
          spin={false}
          className="relative mx-auto w-[420px] max-w-[75%] h-auto mb-8"
        />

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C66A4A]">
            BeyondMaps
          </p>

          <h2 className="font-editorial text-5xl lg:text-6xl mt-6 leading-[0.95]">
            Explore more.
            <br />
            <span className="italic">Worry less.</span>
          </h2>

          <p className="max-w-md mx-auto text-sm text-white/75 leading-relaxed mt-7">
            Your journey should be about discovering a place, not
            worrying about what could go wrong.
          </p>
        </div>
      </section>


      {/* =====================================================
          CALLING OVERLAY
      ===================================================== */}

      {activeCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24231F]/60 px-6">
          <div className="relative w-full max-w-sm bg-[#F5F1E8] border border-[#D8D1C5] px-8 py-10 text-center overflow-hidden">

            <IndianOrnament
              variant="floral"
              color="#234236"
              opacity={0.1}
              duration={80}
              className="absolute -bottom-16 -right-16 w-64 h-64 pointer-events-none"
            />

            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A] font-semibold">
                {callStatus === "connecting" ? "Calling" : "Connected"}
              </p>

              <h3 className="font-editorial text-3xl text-[#234236] mt-3">
                {activeCall.title}
              </h3>

              <p className="font-editorial text-5xl text-[#24231F] mt-2">
                {activeCall.number}
              </p>

              <div className="flex items-center justify-center gap-2 mt-7">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
                      callStatus === "connecting"
                        ? "animate-ping bg-[#C66A4A]"
                        : "bg-[#234236]"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      callStatus === "connecting" ? "bg-[#C66A4A]" : "bg-[#234236]"
                    }`}
                  />
                </span>
                <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#6F6A61]">
                  {callStatus === "connecting" ? "Connecting..." : "Call connected"}
                </span>
              </div>

              <p className="font-editorial text-2xl text-[#234236] mt-6 tabular-nums">
                {formatTime(callSeconds)}
              </p>

              <button
                type="button"
                onClick={endCall}
                className="inline-flex items-center gap-2.5 mt-9 px-7 py-3.5 bg-[#8f2f24] hover:bg-[#234236] text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors"
              >
                <PhoneOff size={15} strokeWidth={1.75} />
                End call
              </button>

              <p className="text-[11px] text-[#6F6A61] mt-6 leading-relaxed">
                On a phone, the {activeCall.number} dialer may open alongside
                this screen. On desktop this is a simulated call for the demo.
              </p>
            </div>

            <button
              type="button"
              onClick={endCall}
              aria-label="Close"
              className="absolute top-4 right-4 text-[#6F6A61] hover:text-[#24231F] transition-colors z-10"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}

    </main>
  );
}

export default Safety;
