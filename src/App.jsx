import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PlanMyTrip from "./pages/PlanMyTrip";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import LocalExperiences from "./pages/LocalExperiences";
import Safety from "./pages/Safety";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#24231F] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <Routes>

          {/* =========================
              MAIN PAGES
          ========================= */}

          <Route path="/" element={<Home />} />

          <Route
            path="/plan-trip"
            element={<PlanMyTrip />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />


          {/* =========================
              TEAMMATE / INTELLIGENCE PAGES
          ========================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/insights"
            element={<Dashboard />}
          />

          <Route
            path="/experiences"
            element={<LocalExperiences />}
          />

          <Route
            path="/safety"
            element={<Safety />}
          />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}