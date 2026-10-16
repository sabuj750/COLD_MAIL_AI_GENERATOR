import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api.js";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  SparklesIcon,
  EnvelopeIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const EXAMPLES = [
  "Cold email to a marketing director at a SaaS company about our AI analytics tool that boosts retention by 20%",
  "Congratulate a startup founder on their new office and pitch our sales automation platform",
  "Reach out to an HR head about our employee onboarding software",
];

const CARD_META = {
  subject: { icon: TagIcon, tone: "from-blue-50 to-indigo-50 text-indigo-600 ring-indigo-100" },
  email: { icon: EnvelopeIcon, tone: "from-indigo-50 to-purple-50 text-purple-600 ring-purple-100" },
  linkedin: { icon: ChatBubbleLeftRightIcon, tone: "from-sky-50 to-blue-50 text-blue-600 ring-blue-100" },
  followup: { icon: ArrowPathIcon, tone: "from-fuchsia-50 to-pink-50 text-fuchsia-600 ring-fuchsia-100" },
};

const ResultCard = ({ title, content, type, copied, onCopy }) => {
  const { icon: Icon, tone } = CARD_META[type];
  const isCopied = copied === type;

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(99,102,241,0.3)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ${tone}`}>
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <button
          onClick={() => onCopy(content, type)}
          title="Copy"
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
            isCopied
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          {isCopied ? (
            <>
              <CheckIcon className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-4 w-4" /> Copy
            </>
          )}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{content}</p>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-100 to-fuchsia-100" />
      <div className="h-4 w-28 rounded-full bg-gray-100" />
    </div>
    <div className="space-y-2.5">
      <div className="h-3 w-full rounded-full bg-gray-100" />
      <div className="h-3 w-11/12 rounded-full bg-gray-100" />
      <div className="h-3 w-3/4 rounded-full bg-gray-100" />
    </div>
  </div>
);

const DashBoard = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/ai/generate-email", { prompt });
      if (!data.emailHistory) {
        throw new Error("The server response did not include generated email data.");
      }
      setResult(data.emailHistory);
      toast.success("Email generated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to generate. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(""), 2000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  return (
    <div className="relative">
      {/* soft background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/3 -z-10 h-72 w-[34rem] rounded-full bg-gradient-to-r from-blue-200/40 via-fuchsia-200/40 to-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full bg-fuchsia-100/60 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:h-[calc(100vh-8rem)] lg:flex-row">
        {/* Input Section */}
        <div className="flex w-full flex-col rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(99,102,241,0.25)] backdrop-blur-xl lg:w-1/3">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-gray-900">New Campaign</h2>
              <p className="text-xs text-gray-500">Describe your prospect, AI does the rest</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-1 flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">Context / Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={1000}
              className="min-h-[10rem] w-full flex-1 resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              placeholder="e.g. Write a cold email to a marketing director at a SaaS company offering our AI-driven analytics tool that increases retention by 20%..."
            />
            <div className="mt-1.5 text-right text-xs text-gray-400">{prompt.length}/1000</div>

            {/* example chips */}
            <div className="mt-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Try an example</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(ex)}
                    className="max-w-full truncate rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
                    title={ex}
                  >
                    {ex.length > 38 ? ex.slice(0, 38) + "…" : ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-900 via-slate-700 to-gray-900 bg-[length:200%_100%] px-6 py-3.5 font-semibold text-white shadow-lg shadow-gray-900/20 transition-all duration-300 hover:bg-right hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  Generate Output
                  <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="flex w-full flex-col overflow-y-auto pr-1 lg:w-2/3">
          {loading ? (
            <div>
              <h2 className="mb-4 text-lg font-extrabold tracking-tight text-gray-900">
                Crafting your{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
                  sequence
                </span>
                ...
              </h2>
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          ) : result ? (
            <div>
              <h2 className="mb-4 text-lg font-extrabold tracking-tight text-gray-900">
                AI{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
                  Results
                </span>
              </h2>
              <div className="space-y-4 pb-4">
                <ResultCard title="Subject Line" content={result.subject} type="subject" copied={copied} onCopy={copyToClipboard} />
                <ResultCard title="Cold Email" content={result.emailBody} type="email" copied={copied} onCopy={copyToClipboard} />
                <ResultCard title="LinkedIn DM" content={result.linkedInDM} type="linkedin" copied={copied} onCopy={copyToClipboard} />
                <ResultCard title="Follow-up Email" content={result.followUpEmail} type="followup" copied={copied} onCopy={copyToClipboard} />
              </div>
            </div>
          ) : (
            <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-indigo-200 bg-white/70 px-6 py-16 text-center backdrop-blur-xl">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-200/40 via-fuchsia-200/40 to-purple-200/40 blur-3xl" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-fuchsia-50 text-indigo-600 ring-1 ring-indigo-100">
                  <SparklesIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
                  Your{" "}
                  <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
                    outreach
                  </span>{" "}
                  appears here
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  Submit a prompt to generate a cold email, follow-up and LinkedIn DM in seconds.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;