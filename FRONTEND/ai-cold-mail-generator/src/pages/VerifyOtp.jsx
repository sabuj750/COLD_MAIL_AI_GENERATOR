import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const SparkleIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ArrowIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const VerifyOtp = () => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const userId = location.state?.userId;
  const email = location.state?.email;

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH;

  // focus first box on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!userId || !email) {
    return <Navigate to="/login" replace />;
  }

  const focusBox = (i) => inputsRef.current[i]?.focus();

  const handleChange = (i, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setError(false);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < OTP_LENGTH - 1) focusBox(i + 1);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      focusBox(i - 1);
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusBox(i - 1);
    } else if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) {
      focusBox(i + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, idx) => (next[idx] = c));
    setDigits(next);
    focusBox(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-otp", { email, otp });
      login(data);
      toast.success("OTP verified successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(true);
      setDigits(Array(OTP_LENGTH).fill(""));
      focusBox(0);
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // NOTE: adjust this endpoint to match your backend
  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await api.post("/api/auth/resend-otp", { email });
      toast.success("A new code has been sent");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend code");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white flex flex-col">
      {/* soft gradient glows (same vibe as landing hero) */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-300/40 via-fuchsia-300/40 to-purple-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-fuchsia-200/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-[-6rem] h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />

      {/* top bar / logo */}
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <SparkleIcon />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-indigo-600">
            ColdMail.AI
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="relative w-full max-w-md">
          {/* floating badge */}
          <div className="absolute -top-4 -right-2 z-20 hidden sm:flex -rotate-6 items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-lg">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500 text-emerald-500">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Secure verification
          </div>

          {/* card */}
          <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.25)] backdrop-blur-xl sm:p-10">
            {/* icon */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-fuchsia-50 text-indigo-600 ring-1 ring-indigo-100">
              <ShieldIcon />
            </div>

            <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900">
              Verify your{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
                email
              </span>
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
              We sent a 6-digit code to
              <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    aria-label={`Digit ${i + 1}`}
                    className={`h-14 w-full min-w-0 rounded-xl border bg-white text-center font-mono text-2xl font-bold text-gray-900 shadow-sm outline-none transition-all duration-150
                      ${
                        error
                          ? "border-red-300 bg-red-50/50 ring-2 ring-red-100"
                          : d
                          ? "border-indigo-400 ring-2 ring-indigo-100"
                          : "border-gray-200 hover:border-gray-300"
                      }
                      focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !isComplete}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-900 via-slate-700 to-gray-900 bg-[length:200%_100%] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-gray-900/20 transition-all duration-300 hover:bg-right hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-90" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Didn&apos;t get the code?{" "}
              {cooldown > 0 ? (
                <span className="font-medium text-gray-400">Resend in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtp;