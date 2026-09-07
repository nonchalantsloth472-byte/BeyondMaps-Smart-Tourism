import React, { createContext, useContext, useState } from "react";
import { login as apiLogin } from "../api";

const STORAGE_KEY = "beyondmaps_user";
const PENDING_KEY = "beyondmaps_pending_signup";

const defaultPreferences = {
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
};

function getSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function getPendingSignup() {
  try {
    const saved = sessionStorage.getItem(PENDING_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function savePendingSignup(data) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));
}

function clearPendingSignup() {
  sessionStorage.removeItem(PENDING_KEY);
}

/* ---------------- AUTH ACTIONS ---------------- */

async function mockSignIn(email, password) {
  if (!email || !password) {
    throw new Error("Please enter your email and password.");
  }

  const savedUser = getSavedUser();

  /*
   * Demo behaviour:
   * If an account exists, use it.
   * Otherwise create a basic demo session.
   */
  if (savedUser && savedUser.email === email) {
    const user = {
      ...savedUser,
      loggedIn: true,
    };

    saveUser(user);
    return user;
  }

  const name =
    email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Traveller";

  const user = {
    id: `demo-${Date.now()}`,
    name,
    email,
    loggedIn: true,
    preferences: {
      ...defaultPreferences,
    },
  };

  saveUser(user);

  return user;
}

async function mockSignUp(data) {
  if (!data.name?.trim()) {
    throw new Error("Please enter your full name.");
  }

  if (!data.email?.trim()) {
    throw new Error("Please enter your email.");
  }

  if (!data.password) {
    throw new Error("Please enter a password.");
  }

  const signupData = {
    id: `user-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password,

    preferences: {
      ...defaultPreferences,
      ...(data.preferences || {}),
    },
  };

  /*
   * Password stays only in sessionStorage temporarily
   * for this demo OTP flow.
   */
  savePendingSignup(signupData);

  return {
    success: true,
    email: signupData.email,
  };
}

async function mockVerifyOtp(code) {
  const pending = getPendingSignup();

  if (!pending) {
    throw new Error("Signup session expired. Please register again.");
  }

  /*
   * DEMO OTP
   * Later replace this with your backend OTP verification.
   */
  if (code !== "123456") {
    throw new Error("Invalid OTP. Use 123456 for the demo.");
  }

  const user = {
    id: pending.id,
    name: pending.name,
    email: pending.email,

    preferences: {
      ...defaultPreferences,
      ...(pending.preferences || {}),
    },

    loggedIn: true,
  };

  saveUser(user);
  clearPendingSignup();

  return user;
}

async function mockResendOtp() {
  return {
    success: true,
    message: "OTP sent again.",
  };
}

async function mockGoogleAuth() {
  const existing = getSavedUser();

  const user = {
    id: existing?.id || `google-${Date.now()}`,
    name: existing?.name || "Traveller",
    email: existing?.email || "traveller@google.com",

    preferences: {
      ...defaultPreferences,
      ...(existing?.preferences || {}),
    },

    loggedIn: true,
    provider: "google",
  };

  saveUser(user);

  return user;
}

function mockSignOut() {
  const current = getSavedUser();

  if (current) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/* ---------------- AI PROFILE ---------------- */

function createAITravelProfile(user) {
  if (!user) {
    return null;
  }

  const preferences = {
    ...defaultPreferences,
    ...(user.preferences || {}),
  };

  return {
    traveller: {
      name: user.name,
      email: user.email,

      gender: preferences.gender,
      ageGroup: preferences.ageGroup,
      homeCity: preferences.homeCity,
    },

    travelPreferences: {
      interests: preferences.interests,
      travelStyle: preferences.travelStyle,
      travelPace: preferences.travelPace,

      crowdPreference: preferences.crowdPreference,
      budgetStyle: preferences.budgetStyle,
      accommodation: preferences.accommodation,

      foodPreference: preferences.foodPreference,
      activities: preferences.activities,
      transport: preferences.transport,

      companions: preferences.companions,
      safetyPriority: preferences.safetyPriority,
      accessibility: preferences.accessibility,
    },
  };
}

function createAITripRequest(user, tripDetails) {
  return {
    trip: {
      destination: tripDetails?.destination || "",
      duration: tripDetails?.duration || "",
      budget: tripDetails?.budget || "",
      numberOfPlaces: tripDetails?.numberOfPlaces || "",
      startDate: tripDetails?.startDate || "",
      endDate: tripDetails?.endDate || "",
    },

    travellerProfile: createAITravelProfile(user),

    intelligenceRequirements: {
      predictCrowds: true,
      findSmartAlternatives: true,
      considerSafety: true,
      optimizeRoute: true,
      personalizeActivities: true,
      personalizeFood: true,
      personalizeTransport: true,
    },
  };
}

/* ---------------- CONTEXT ---------------- */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSavedUser());

  async function signIn(data) {
  if (!data?.email || !data?.password) {
    throw new Error("Please enter your email and password.");
  }

  const result = await apiLogin(data.email, data.password);

  const user = {
    id: result.user_id,
    name: result.name,
    email: result.email,
    loggedIn: true,

    preferences: {
      ...defaultPreferences,
    },
  };

  // Save the JWT token for future API requests
  localStorage.setItem("beyondmaps_token", result.access_token);

  // Save the logged-in user
  saveUser(user);

  // Update React authentication state
  setUser(user);

  return user;
}

  async function signUp(data) {
    return await mockSignUp(data);
  }

  async function verifyOtp(code) {
    const verifiedUser = await mockVerifyOtp(code);

    setUser(verifiedUser);

    return verifiedUser;
  }

  async function resendOtp() {
    return await mockResendOtp();
  }

  async function googleAuth() {
    const loggedInUser = await mockGoogleAuth();

    setUser(loggedInUser);

    return loggedInUser;
  }

  function signOut() {
    mockSignOut();
    setUser(null);
  }

  function getAITravelProfile() {
    return createAITravelProfile(user);
  }

  function buildAITripRequest(tripDetails) {
    return createAITripRequest(user, tripDetails);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        verifyOtp,
        resendOtp,
        googleAuth,
        signOut,
        getAITravelProfile,
        buildAITripRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
