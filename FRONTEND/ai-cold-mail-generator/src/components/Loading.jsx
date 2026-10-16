import React from "react";

const SparkleIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  </svg>
);

const Loading = ({ text = "Loading", fullScreen = true }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative flex items-center justify-center overflow-hidden bg-white ${
        fullScreen ? "min-h-screen" : "min-h-[16rem] w-full"
      }`}
    >
      {/* soft gradient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-300/40 via-fuchsia-300/40 to-purple-300/40 blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* spinner */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* faint track */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          {/* gradient spinning arc */}
          <div
            className="absolute inset-0 animate-spin rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(99,102,241,0) 0deg, #6366f1 200deg, #d946ef 330deg, rgba(217,70,239,0) 360deg)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
            }}
          />
          {/* logo tile */}
          <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <SparkleIcon />
          </span>
        </div>

        {/* brand + text */}
        <div className="text-center">
          <p className="text-xl font-extrabold tracking-tight text-indigo-600">
            ColdMail.AI
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-gray-500">
            {text}
            <span className="flex gap-0.5">
              <span className="h-1 w-1 animate-bounce rounded-full bg-fuchsia-500 [animation-delay:-0.3s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-fuchsia-500 [animation-delay:-0.15s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-fuchsia-500" />
            </span>
          </p>
        </div>
      </div>

      <span className="sr-only">{text}</span>
    </div>
  );
};

export default Loading;