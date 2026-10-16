import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  BoltIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const perks = [
  { icon: BoltIcon, text: "Pick up where you left off" },
  { icon: DocumentTextIcon, text: "All your saved sequences in one place" },
  { icon: ChartBarIcon, text: "Keep improving your reply rates" },
];

const inputClass =
  "block w-full rounded-xl border border-gray-200 bg-white/70 py-3 pl-11 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/15";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // fixed: useAuth must be called

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      login(data);
      toast.success(data.message);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      <style>{`
        @keyframes blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-50px) scale(1.15); } 66% { transform: translate(-30px,30px) scale(0.9); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes gradient-x { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pop-in { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        .animate-blob { animation: blob 14s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease infinite; }
        .animate-fade-up { animation: fade-up .8s ease-out both; }
        .animate-fade-left { animation: fade-left .8s ease-out both; }
        .animate-pop-in { animation: pop-in .6s cubic-bezier(.2,.8,.2,1) both; }
        .btn-shimmer::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          transform: translateX(-100%); animation: shimmer 2.8s infinite;
        }
        .bg-grid {
          background-image: linear-gradient(to right, rgba(99,102,241,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        }
        .field:focus-within .field-icon { color: rgb(79 70 229); transform: scale(1.1); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
        }
      `}</style>

      {/* Animated background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-grid absolute inset-0" />
        <div className="animate-blob absolute left-[8%] top-10 h-72 w-72 rounded-full bg-[#ff80b5] opacity-30 blur-3xl" />
        <div
          className="animate-blob absolute right-[6%] top-32 h-80 w-80 rounded-full bg-[#9089fc] opacity-30 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
        <div
          className="animate-blob absolute bottom-0 left-[40%] h-72 w-72 rounded-full bg-sky-300 opacity-25 blur-3xl"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-16 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left: brand panel */}
        <div className="animate-fade-left hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-2xl font-black text-transparent">
              ColdMail.AI
            </span>
          </Link>

          <h1 className="mt-10 text-5xl font-extrabold tracking-tight text-gray-900">
            Welcome back to{" "}
            <span className="animate-gradient-x bg-gradient-to-r from-primary-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              better outreach
            </span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600">
            Sign in to keep generating personalized sequences that actually get replies.
          </p>

          <ul className="mt-10 space-y-4">
            {perks.map((perk, i) => (
              <li
                key={perk.text}
                className="animate-fade-up flex items-center gap-3"
                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-transform duration-300 hover:rotate-6 hover:scale-110">
                  <perk.icon className="h-5 w-5" />
                </span>
                <span className="font-medium text-gray-700">{perk.text}</span>
              </li>
            ))}
          </ul>

          <div className="animate-float mt-12 inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
            <SparklesIcon className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-semibold text-gray-700">
              Your next sequence is 10 seconds away
            </span>
          </div>
        </div>

        {/* Right: form */}
        <div className="animate-pop-in mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-2xl font-black text-transparent">
              ColdMail.AI
            </span>
          </Link>

          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary-400/30 via-fuchsia-300/30 to-indigo-400/30 blur-xl" />
            <div className="relative rounded-2xl border border-gray-200/70 bg-white/90 px-6 py-8 shadow-2xl shadow-primary-500/10 backdrop-blur sm:px-10">
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Good to see you again.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="animate-fade-up" style={{ animationDelay: ".15s" }}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="field relative mt-1.5">
                    <EnvelopeIcon className="field-icon pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-all duration-200" />
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="animate-fade-up" style={{ animationDelay: ".25s" }}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="field relative mt-1.5">
                    <LockClosedIcon className="field-icon pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-all duration-200" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-primary-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer animate-fade-up group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/20 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  style={{ animationDelay: ".35s" }}
                >
                  {loading ? (
                    <>
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                        style={{ animation: "spin .8s linear infinite" }}
                      />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to="/signup"
                  className="font-semibold text-primary-600 transition-colors hover:text-primary-500"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;