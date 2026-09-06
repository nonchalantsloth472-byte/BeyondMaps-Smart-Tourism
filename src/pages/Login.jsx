import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const GREEN = "#234236";
const CREAM = "#F5F1E8";
const TERRACOTTA = "#C66A4A";
const TEXT = "#24231F";
const MUTED = "#6F6A61";
const BORDER = "#D8D1C5";

const INTERESTS = [
  "Heritage",
  "History",
  "Food",
  "Art & Crafts",
  "Nature",
  "Adventure",
  "Beaches",
  "Spirituality",
  "Photography",
  "Shopping",
  "Architecture",
  "Nightlife",
  "Local Culture",
  "Wildlife",
];

const ACTIVITIES = [
  "Museums",
  "Markets",
  "Local Food",
  "Temples",
  "Forts & Monuments",
  "Hiking",
  "Beaches",
  "Art Workshops",
  "Photography",
  "Cafés",
  "Nature Walks",
  "Cultural Shows",
];

const TRANSPORT = [
  "Walking",
  "Public transport",
  "Metro",
  "Train",
  "Cab",
  "Rental car",
  "Bike / Scooter",
];

const FOOD = [
  "Local food",
  "Vegetarian",
  "Vegan",
  "Street food",
  "Fine dining",
  "Cafés",
  "Regional cuisine",
  "No preference",
];

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block uppercase"
        style={{
          fontSize: "10px",
          letterSpacing: "0.16em",
          color: MUTED,
        }}
      >
        {label}
        {required && " *"}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full outline-none transition"
        style={{
          height: "48px",
          padding: "0 15px",
          border: `1px solid ${BORDER}`,
          background: "#FFFFFF",
          color: TEXT,
          fontSize: "14px",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = GREEN;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = BORDER;
        }}
      />
    </label>
  );
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span
        className="mb-2 block uppercase"
        style={{
          fontSize: "10px",
          letterSpacing: "0.16em",
          color: MUTED,
        }}
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full outline-none"
        style={{
          height: "48px",
          padding: "0 14px",
          border: `1px solid ${BORDER}`,
          background: "#FFFFFF",
          color: value ? TEXT : MUTED,
          fontSize: "14px",
        }}
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PreferenceGroup({ label, options, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  function toggle(option) {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div>
      <div
        className="mb-3 uppercase"
        style={{
          fontSize: "10px",
          letterSpacing: "0.16em",
          color: MUTED,
        }}
      >
        {label}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() => toggle(option)}
              className="transition-all"
              style={{
                padding: "8px 12px",
                border: `1px solid ${active ? GREEN : BORDER}`,
                background: active ? GREEN : "#FFFFFF",
                color: active ? "#FFFFFF" : TEXT,
                fontSize: "12px",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Progress({ step }) {
  const steps = ["Account", "Travel preferences", "Verification"];

  return (
    <div className="mb-8 flex items-center gap-3">
      {steps.map((item, index) => {
        const number = index + 1;
        const active = step >= number;

        return (
          <React.Fragment key={item}>
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center"
                style={{
                  borderRadius: "50%",
                  background: active ? GREEN : "#E7E1D7",
                  color: active ? "#FFFFFF" : MUTED,
                  fontSize: "11px",
                }}
              >
                {number}
              </div>

              <span
                className="hidden sm:block"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  color: active ? GREEN : MUTED,
                  textTransform: "uppercase",
                }}
              >
                {item}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className="h-px flex-1"
                style={{ background: BORDER }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const {
    signIn,
    signUp,
    verifyOtp,
    resendOtp,
    googleAuth,
  } = useAuth();

  const [mode, setMode] = useState("signin");
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    gender: "",
    ageGroup: "",
    homeCity: "",

    interests: [],
    travelStyle: "",
    travelPace: "",
    crowdPreference: "",
    budgetStyle: "",
    accommodation: "",
    foodPreference: [],
    activities: [],
    transport: [],
    companions: "",
    safetyPriority: "",
    accessibility: [],
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetMessages() {
    setError("");
    setMessage("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setStep(1);
    setOtp("");
    resetMessages();
  }

  async function handleSignIn(e) {
    e.preventDefault();

    resetMessages();
    setLoading(true);

    try {
      await signIn({
        email: form.email,
        password: form.password,
      });

      navigate("/");
    } catch (err) {
      setError(err?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  function validatePreferences() {
    if (!form.gender) {
      return "Please select your gender.";
    }

    if (!form.ageGroup) {
      return "Please select your age group.";
    }

    if (!form.homeCity.trim()) {
      return "Please enter your home city.";
    }

    if (form.interests.length === 0) {
      return "Please select at least one interest.";
    }

    if (!form.travelStyle) {
      return "Please select your travel style.";
    }

    if (!form.travelPace) {
      return "Please select your travel pace.";
    }

    return "";
  }

  async function handleSignupAccount(e) {
    e.preventDefault();

    resetMessages();

    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStep(2);
  }

  async function handleCreateAccount(e) {
    e.preventDefault();

    resetMessages();

    const preferenceError = validatePreferences();

    if (preferenceError) {
      setError(preferenceError);
      return;
    }

    setLoading(true);

    try {
      await signUp({
        name: form.name,
        email: form.email,
        password: form.password,

        preferences: {
          gender: form.gender,
          ageGroup: form.ageGroup,
          homeCity: form.homeCity,

          interests: form.interests,
          travelStyle: form.travelStyle,
          travelPace: form.travelPace,

          crowdPreference: form.crowdPreference,
          budgetStyle: form.budgetStyle,
          accommodation: form.accommodation,

          foodPreference: form.foodPreference,
          activities: form.activities,
          transport: form.transport,

          companions: form.companions,
          safetyPriority: form.safetyPriority,
          accessibility: form.accessibility,
        },
      });

      setStep(3);
      setMessage("We sent a verification code to your email.");
    } catch (err) {
      setError(err?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();

    resetMessages();

    if (otp.length !== 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(otp);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    resetMessages();
    setLoading(true);

    try {
      await resendOtp();
      setMessage("A new verification code has been sent.");
    } catch (err) {
      setError(err?.message || "Unable to resend code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    resetMessages();
    setLoading(true);

    try {
      await googleAuth();
      navigate("/");
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(e) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: CREAM,
        color: TEXT,
      }}
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section
          className="relative hidden overflow-hidden lg:flex"
          style={{
            background: GREEN,
            color: "#FFFFFF",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute -left-32 -top-32 h-96 w-96 rounded-full"
              style={{
                border: "1px solid #FFFFFF",
              }}
            />

            <div
              className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full"
              style={{
                border: "1px solid #FFFFFF",
              }}
            />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div
                className="mb-20 uppercase"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                }}
              >
                ✦ BeyondMaps
              </div>

              <div style={{ maxWidth: "560px" }}>
                <p
                  className="mb-5 uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    opacity: 0.7,
                  }}
                >
                  Intelligent tourism
                </p>

                <h1
                  className="font-editorial"
                  style={{
                    fontFamily:
                      'Georgia, "Times New Roman", serif',
                    fontSize: "clamp(48px, 6vw, 82px)",
                    lineHeight: 0.98,
                    fontWeight: 400,
                  }}
                >
                  Your journey
                  <br />
                  starts here.
                </h1>

                <p
                  className="mt-8"
                  style={{
                    maxWidth: "430px",
                    color: "rgba(255,255,255,0.72)",
                    fontSize: "15px",
                    lineHeight: 1.8,
                  }}
                >
                  Tell BeyondMaps how you like to travel. Your preferences
                  help us create trips that feel made for you — from quieter
                  places to smarter routes and authentic local experiences.
                </p>
              </div>
            </div>

            <div
              className="flex items-center justify-between border-t pt-6"
              style={{
                borderColor: "rgba(255,255,255,0.18)",
              }}
            >
              <span
                className="uppercase"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  opacity: 0.65,
                }}
              >
                Explore beyond the obvious
              </span>

              <span
                style={{
                  fontSize: "12px",
                  opacity: 0.65,
                }}
              >
                India · Live travel intelligence
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section
          className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8"
          style={{
            background: CREAM,
          }}
        >
          <div className="w-full max-w-[620px]">
            {/* HEADER */}
            <div className="mb-8">
              <p
                className="mb-3 uppercase"
                style={{
                  color: TERRACOTTA,
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                }}
              >
                {mode === "signin"
                  ? "Welcome back"
                  : step === 3
                  ? "Almost there"
                  : "Create your account"}
              </p>

              <h2
                className="font-editorial"
                style={{
                  fontFamily:
                    'Georgia, "Times New Roman", serif',
                  color: GREEN,
                  fontSize: "clamp(38px, 5vw, 58px)",
                  lineHeight: 1,
                  fontWeight: 400,
                }}
              >
                {mode === "signin"
                  ? "Welcome to BeyondMaps."
                  : step === 1
                  ? "Start your journey."
                  : step === 2
                  ? "Make it yours."
                  : "Verify your account."}
              </h2>

              <p
                className="mt-4"
                style={{
                  color: MUTED,
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {mode === "signin"
                  ? "Sign in to continue planning smarter journeys."
                  : step === 1
                  ? "Create an account and tell us a little about yourself."
                  : step === 2
                  ? "These preferences help our AI personalise your trips."
                  : "Enter the verification code to finish creating your account."}
              </p>
            </div>

            {/* SIGN IN */}
            {mode === "signin" && (
              <>
                <form onSubmit={handleSignIn} className="space-y-5">
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) => update("email", value)}
                    placeholder="you@example.com"
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(value) => update("password", value)}
                    placeholder="••••••••"
                    required
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      style={{
                        border: "none",
                        background: "transparent",
                        color: MUTED,
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <ErrorBox message={error} />
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full transition-opacity"
                    style={{
                      height: "50px",
                      border: "none",
                      background: GREEN,
                      color: "#FFFFFF",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: loading ? "wait" : "pointer",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <Divider />

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full transition"
                  style={{
                    height: "50px",
                    border: `1px solid ${BORDER}`,
                    background: "#FFFFFF",
                    color: TEXT,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Continue with Google
                </button>

                <BottomSwitch
                  text="Don't have an account?"
                  action="Create one"
                  onClick={() => switchMode("signup")}
                />
              </>
            )}

            {/* SIGNUP STEP 1 */}
            {mode === "signup" && step === 1 && (
              <>
                <Progress step={1} />

                <form
                  onSubmit={handleSignupAccount}
                  className="space-y-5"
                >
                  <Input
                    label="Full name"
                    value={form.name}
                    onChange={(value) => update("name", value)}
                    placeholder="Your name"
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) => update("email", value)}
                    placeholder="you@example.com"
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(value) => update("password", value)}
                    placeholder="At least 6 characters"
                    required
                  />

                  <Input
                    label="Confirm password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(value) =>
                      update("confirmPassword", value)
                    }
                    placeholder="Repeat your password"
                    required
                  />

                  {error && <ErrorBox message={error} />}

                  <button
                    type="submit"
                    className="w-full"
                    style={{
                      height: "50px",
                      border: "none",
                      background: GREEN,
                      color: "#FFFFFF",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Continue
                  </button>
                </form>

                <Divider />

                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full"
                  style={{
                    height: "50px",
                    border: `1px solid ${BORDER}`,
                    background: "#FFFFFF",
                    color: TEXT,
                    fontSize: "13px",
                  }}
                >
                  Continue with Google
                </button>

                <BottomSwitch
                  text="Already have an account?"
                  action="Sign in"
                  onClick={() => switchMode("signin")}
                />
              </>
            )}

            {/* SIGNUP STEP 2 */}
            {mode === "signup" && step === 2 && (
              <>
                <Progress step={2} />

                <form
                  onSubmit={handleCreateAccount}
                  className="space-y-7"
                >
                  {/* BASIC PROFILE */}
                  <div
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <SelectBox
                      label="Gender"
                      value={form.gender}
                      onChange={(value) =>
                        update("gender", value)
                      }
                      options={[
                        "Female",
                        "Male",
                        "Non-binary",
                        "Trans",
                        "Prefer not to say",
                      ]}
                    />

                    <SelectBox
                      label="Age group"
                      value={form.ageGroup}
                      onChange={(value) =>
                        update("ageGroup", value)
                      }
                      options={[
                        "Under 18",
                        "18–24",
                        "25–34",
                        "35–44",
                        "45–54",
                        "55+",
                      ]}
                    />
                  </div>

                  <Input
                    label="Home city"
                    value={form.homeCity}
                    onChange={(value) =>
                      update("homeCity", value)
                    }
                    placeholder="e.g. Jaipur"
                  />

                  <PreferenceGroup
                    label="What are you interested in?"
                    options={INTERESTS}
                    value={form.interests}
                    onChange={(value) =>
                      update("interests", value)
                    }
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectBox
                      label="Travel style"
                      value={form.travelStyle}
                      onChange={(value) =>
                        update("travelStyle", value)
                      }
                      options={[
                        "Relaxed",
                        "Balanced",
                        "Adventure focused",
                        "Luxury",
                        "Backpacking",
                        "Cultural immersion",
                      ]}
                    />

                    <SelectBox
                      label="Travel pace"
                      value={form.travelPace}
                      onChange={(value) =>
                        update("travelPace", value)
                      }
                      options={[
                        "Slow — fewer places, more time",
                        "Moderate — balanced",
                        "Fast — see as much as possible",
                      ]}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectBox
                      label="Crowd preference"
                      value={form.crowdPreference}
                      onChange={(value) =>
                        update("crowdPreference", value)
                      }
                      options={[
                        "Avoid crowds",
                        "Prefer less crowded",
                        "Balanced",
                        "Don't mind crowds",
                      ]}
                    />

                    <SelectBox
                      label="Budget style"
                      value={form.budgetStyle}
                      onChange={(value) =>
                        update("budgetStyle", value)
                      }
                      options={[
                        "Budget conscious",
                        "Value for money",
                        "Comfortable",
                        "Premium",
                        "Luxury",
                      ]}
                    />
                  </div>

                  <SelectBox
                    label="Accommodation"
                    value={form.accommodation}
                    onChange={(value) =>
                      update("accommodation", value)
                    }
                    options={[
                      "Hostels",
                      "Budget hotels",
                      "Boutique stays",
                      "Hotels",
                      "Resorts",
                      "Homestays",
                      "No preference",
                    ]}
                  />

                  <PreferenceGroup
                    label="Food preferences"
                    options={FOOD}
                    value={form.foodPreference}
                    onChange={(value) =>
                      update("foodPreference", value)
                    }
                  />

                  <PreferenceGroup
                    label="Activities you enjoy"
                    options={ACTIVITIES}
                    value={form.activities}
                    onChange={(value) =>
                      update("activities", value)
                    }
                  />

                  <PreferenceGroup
                    label="Preferred transport"
                    options={TRANSPORT}
                    value={form.transport}
                    onChange={(value) =>
                      update("transport", value)
                    }
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectBox
                      label="Who do you usually travel with?"
                      value={form.companions}
                      onChange={(value) =>
                        update("companions", value)
                      }
                      options={[
                        "Solo",
                        "With partner",
                        "With friends",
                        "With family",
                        "With children",
                        "Group travel",
                      ]}
                    />

                    <SelectBox
                      label="Safety priority"
                      value={form.safetyPriority}
                      onChange={(value) =>
                        update("safetyPriority", value)
                      }
                      options={[
                        "High",
                        "Very high",
                        "Balanced",
                      ]}
                    />
                  </div>

                  <PreferenceGroup
                    label="Accessibility needs"
                    options={[
                      "None",
                      "Wheelchair accessible",
                      "Limited walking",
                      "Step-free routes",
                      "Accessible accommodation",
                      "Other",
                    ]}
                    value={form.accessibility}
                    onChange={(value) =>
                      update("accessibility", value)
                    }
                  />

                  {error && <ErrorBox message={error} />}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        height: "50px",
                        padding: "0 22px",
                        border: `1px solid ${BORDER}`,
                        background: "transparent",
                        color: TEXT,
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                      style={{
                        height: "50px",
                        border: "none",
                        background: GREEN,
                        color: "#FFFFFF",
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading
                        ? "Creating..."
                        : "Create account"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* OTP */}
            {mode === "signup" && step === 3 && (
              <>
                <Progress step={3} />

                <form
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div
                    className="p-5"
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: MUTED,
                        fontSize: "13px",
                        lineHeight: 1.7,
                      }}
                    >
                      We sent a 6-digit verification code to
                      <br />
                      <strong style={{ color: TEXT }}>
                        {form.email}
                      </strong>
                    </p>
                  </div>

                  <label className="block">
                    <span
                      className="mb-2 block uppercase"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.16em",
                        color: MUTED,
                      }}
                    >
                      Verification code
                    </span>

                    <input
                      value={otp}
                      onChange={handleOtpChange}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.45em] outline-none"
                      style={{
                        height: "62px",
                        border: `1px solid ${BORDER}`,
                        background: "#FFFFFF",
                        color: GREEN,
                        fontSize: "24px",
                      }}
                    />
                  </label>

                  {message && (
                    <div
                      style={{
                        color: GREEN,
                        fontSize: "12px",
                      }}
                    >
                      {message}
                    </div>
                  )}

                  {error && <ErrorBox message={error} />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                    style={{
                      height: "50px",
                      border: "none",
                      background: GREEN,
                      color: "#FFFFFF",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Verifying..." : "Verify account"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full"
                    style={{
                      border: "none",
                      background: "transparent",
                      color: TERRACOTTA,
                      fontSize: "12px",
                    }}
                  >
                    Resend code
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full"
                    style={{
                      border: "none",
                      background: "transparent",
                      color: MUTED,
                      fontSize: "12px",
                    }}
                  >
                    ← Edit preferences
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ErrorBox({ message }) {
  return (
    <div
      className="p-3"
      style={{
        border: "1px solid rgba(198,106,74,0.35)",
        background: "rgba(198,106,74,0.08)",
        color: "#9A4933",
        fontSize: "12px",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-4">
      <div
        className="h-px flex-1"
        style={{ background: BORDER }}
      />

      <span
        className="uppercase"
        style={{
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: MUTED,
        }}
      >
        or
      </span>

      <div
        className="h-px flex-1"
        style={{ background: BORDER }}
      />
    </div>
  );
}

function BottomSwitch({ text, action, onClick }) {
  return (
    <div className="mt-7 text-center">
      <span
        style={{
          color: MUTED,
          fontSize: "12px",
        }}
      >
        {text}{" "}
      </span>

      <button
        type="button"
        onClick={onClick}
        style={{
          border: "none",
          background: "transparent",
          color: TERRACOTTA,
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {action}
      </button>
    </div>
  );
}