import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
    ArrowRightIcon,
    BoltIcon,
    ChartBarIcon,
    DocumentTextIcon,
    SparklesIcon,
    PencilSquareIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Fires once when the element scrolls into view
const useInView = (threshold = 0.15) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
};

// Fade + slide up on scroll
const Reveal = ({ children, delay = 0, className = '' }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${className}`}
        >
            {children}
        </div>
    );
};

// Counts up to a number when visible
const Counter = ({ to, suffix = '', duration = 1800 }) => {
    const [ref, inView] = useInView(0.4);
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!inView) return;
        let raf;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, to, duration]);
    return (
        <span ref={ref}>
            {value.toLocaleString()}
            {suffix}
        </span>
    );
};

// Typewriter that loops through lines
const useTypewriter = (text, speed = 28, startDelay = 600) => {
    const [out, setOut] = useState('');
    useEffect(() => {
        let i = 0;
        let timer;
        const begin = setTimeout(function type() {
            i += 1;
            setOut(text.slice(0, i));
            if (i < text.length) timer = setTimeout(type, speed);
        }, startDelay);
        return () => {
            clearTimeout(begin);
            clearTimeout(timer);
        };
    }, [text, speed, startDelay]);
    return out;
};

// Card with a spotlight that follows the cursor
const SpotlightCard = ({ children, className = '' }) => {
    const ref = useRef(null);
    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
        ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    return (
        <div
            ref={ref}
            onMouseMove={onMove}
            className={`spotlight-card group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 ${className}`}
        >
            <div className="spotlight-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">{children}</div>
        </div>
    );
};


const Home = () => {
    const { user , loading } = useAuth();

    const features = [
        {
            name: 'Lightning Fast Generation',
            description: 'Generate highly custom cold emails in seconds using state-of-the-art AI.',
            icon: BoltIcon,
        },
        {
            name: 'Omnichannel Outreach',
            description: 'Get an email, a follow-up, and a LinkedIn DM perfectly synced for your prospect.',
            icon: DocumentTextIcon,
        },
        {
            name: 'Higher Conversion Rates',
            description: 'Personalized copy ensures higher open rates and better reply outcomes.',
            icon: ChartBarIcon,
        },
    ];

    const steps = [
        { title: 'Add prospect context', text: 'Paste a role, company, or LinkedIn blurb.', icon: PencilSquareIcon },
        { title: 'AI writes the sequence', text: 'Email, follow-up and DM generated in one go.', icon: SparklesIcon },
        { title: 'Send & get replies', text: 'Copy, tweak, and watch the inbox light up.', icon: PaperAirplaneIcon },
    ];

    const stats = [
        { value: 50000, suffix: '+', label: 'Emails generated' },
        { value: 38, suffix: '%', label: 'Avg. reply rate lift' },
        { value: 10, suffix: 's', label: 'Per full sequence' },
        { value: 500, suffix: '+', label: 'Sales pros onboard' },
    ];

    const marquee = ['SaaS Founders', 'SDR Teams', 'Agencies', 'Recruiters', 'Freelancers', 'Growth Marketers', 'Consultants', 'Startups'];

    const demoEmail =
        "Hi Priya,\n\nSaw Acme just opened a Bengaluru office — congrats! Teams scaling that fast often struggle to keep outreach personal. We help sales teams draft tailored sequences in seconds.\n\nOpen to a quick 10-min chat this week?";
    const typed = useTypewriter(demoEmail, 22, 900);

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden">
            {/* Custom keyframes & utilities */}
            <style>{`
                @keyframes blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-50px) scale(1.15); } 66% { transform: translate(-30px,30px) scale(0.9); } }
                @keyframes float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-14px) rotate(var(--r,0deg)); } }
                @keyframes gradient-x { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                @keyframes shimmer { 100% { transform: translateX(100%); } }
                @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
                @keyframes fade-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes blink { 50% { opacity: 0; } }
                @keyframes draw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
                @keyframes spin-slow { to { transform: rotate(360deg); } }

                .animate-blob { animation: blob 14s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease infinite; }
                .animate-marquee { animation: marquee 28s linear infinite; }
                .animate-fade-down { animation: fade-down .8s ease-out both; }
                .animate-fade-up { animation: fade-up .9s ease-out both; }
                .animate-blink { animation: blink 1s step-end infinite; }
                .animate-spin-slow { animation: spin-slow 22s linear infinite; }
                .btn-shimmer::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
                    transform: translateX(-100%); animation: shimmer 2.8s infinite;
                }
                .spotlight-glow {
                    background: radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(99,102,241,.14), transparent 60%);
                }
                .bg-grid {
                    background-image: linear-gradient(to right, rgba(99,102,241,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,.07) 1px, transparent 1px);
                    background-size: 44px 44px;
                    mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
                    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
                }
                .marquee-mask { mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent); }
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
                }
            `}</style>

            {/* Navigation */}
            <nav className="animate-fade-down border-b border-gray-100 bg-white/80 backdrop-blur-md fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30">
                                <SparklesIcon className="h-5 w-5" />
                            </span>
                            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                ColdMail.AI
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="btn-shimmer relative overflow-hidden inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 text-sm transition-colors">
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="btn-shimmer relative overflow-hidden inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105 transition-all duration-200"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 -z-10" aria-hidden="true">
                    <div className="bg-grid absolute inset-0" />
                    <div className="animate-blob absolute top-10 left-[10%] h-72 w-72 rounded-full bg-[#ff80b5] opacity-30 blur-3xl" />
                    <div className="animate-blob absolute top-24 right-[8%] h-80 w-80 rounded-full bg-[#9089fc] opacity-30 blur-3xl" style={{ animationDelay: '-4s' }} />
                    <div className="animate-blob absolute bottom-0 left-[40%] h-72 w-72 rounded-full bg-sky-300 opacity-25 blur-3xl" style={{ animationDelay: '-8s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Copy */}
                    <div className="text-center lg:text-left">
                        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50/70 px-4 py-1.5 text-sm font-medium text-primary-700 backdrop-blur">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-primary-500" style={{ animation: 'pulse-ring 1.8s ease-out infinite' }} />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
                            </span>
                            AI-powered outreach is live
                        </div>

                        <h1 className="animate-fade-up mt-6 text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight" style={{ animationDelay: '.1s' }}>
                            Write Cold Emails That{' '}
                            <span className="animate-gradient-x text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-fuchsia-500 to-indigo-600">
                                Actually Get Replies
                            </span>
                        </h1>

                        <p className="animate-fade-up mt-6 text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ animationDelay: '.25s' }}>
                            Stop wasting hours drafting outreach. Enter your prospect's context, and let our AI generate the perfect structured sequence. Email, Follow-up, and LinkedIn DM all at once.
                        </p>

                        <div className="animate-fade-up mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4" style={{ animationDelay: '.4s' }}>
                            <Link
                                to={user ? '/dashboard' : '/signup'}
                                className="btn-shimmer group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-gray-900 hover:bg-gray-800 hover:scale-105 hover:shadow-2xl hover:shadow-gray-900/30 transition-all duration-200"
                            >
                                Start Generating for Free
                                <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-gray-700 bg-white border border-gray-200 hover:border-primary-300 hover:text-primary-700 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                See how it works
                            </a>
                        </div>
                    </div>

                    {/* Floating demo mockup */}
                    <div className="animate-fade-up relative mx-auto w-full max-w-lg" style={{ animationDelay: '.5s' }}>
                        <div className="animate-spin-slow absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary-400/30 via-fuchsia-300/30 to-indigo-400/30 blur-2xl" />

                        <div className="animate-float rounded-2xl border border-gray-200/70 bg-white/90 shadow-2xl shadow-primary-500/10 backdrop-blur">
                            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                                <span className="h-3 w-3 rounded-full bg-red-400" />
                                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                <span className="h-3 w-3 rounded-full bg-green-400" />
                                <span className="ml-3 text-xs font-medium text-gray-400">New cold email · generated by AI</span>
                            </div>
                            <div className="p-5">
                                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                                    <span className="rounded-md bg-gray-100 px-2 py-0.5">To: priya@acme.com</span>
                                    <span className="rounded-md bg-primary-50 px-2 py-0.5 text-primary-700">Subject: Congrats on Bengaluru 🎉</span>
                                </div>
                                <p className="min-h-[190px] whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                    {typed}
                                    <span className="animate-blink ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-primary-600" />
                                </p>
                            </div>
                        </div>

                        {/* Floating chips */}
                        <div className="animate-float absolute -left-6 top-16 hidden sm:flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg" style={{ '--r': '-4deg', animationDelay: '-2s' }}>
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            <span className="text-xs font-semibold text-gray-700">Follow-up ready</span>
                        </div>
                        <div className="animate-float absolute -right-4 bottom-10 hidden sm:flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg" style={{ '--r': '4deg', animationDelay: '-4s' }}>
                            <SparklesIcon className="h-5 w-5 text-indigo-500" />
                            <span className="text-xs font-semibold text-gray-700">LinkedIn DM synced</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marquee */}
            <section className="border-y border-gray-100 bg-white py-8">
                <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Loved by teams who live in the inbox</p>
                <div className="marquee-mask overflow-hidden">
                    <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
                        {[...marquee, ...marquee].map((item, i) => (
                            <span key={i} className="flex items-center gap-12 text-lg font-bold text-gray-300 transition-colors hover:text-primary-500">
                                {item}
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-10 md:grid-cols-4">
                    {stats.map((s, i) => (
                        <Reveal key={s.label} delay={i * 100} className="text-center">
                            <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                <Counter to={s.value} suffix={s.suffix} />
                            </div>
                            <div className="mt-2 text-sm font-medium text-gray-500">{s.label}</div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-gray-50/60 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to close more deals</h2>
                        <p className="mt-4 text-lg text-gray-600">Built for sales teams who demand performance.</p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <Reveal key={feature.name} delay={i * 150}>
                                <SpotlightCard className="h-full">
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary-600">
                                        <feature.icon className="h-6 w-6 text-primary-600 transition-colors duration-300 group-hover:text-white" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.name}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </SpotlightCard>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-24 bg-white scroll-mt-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From blank page to booked meeting</h2>
                        <p className="mt-4 text-lg text-gray-600">Three steps. Under a minute.</p>
                    </Reveal>

                    <div className="relative grid gap-10 md:grid-cols-3">
                        {/* connecting dashed line */}
                        <svg className="absolute left-[16%] right-[16%] top-8 hidden h-2 w-[68%] md:block" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
                            <line x1="0" y1="1" x2="100" y2="1" stroke="#c7d2fe" strokeWidth="0.6" strokeDasharray="2 2" />
                        </svg>
                        {steps.map((step, i) => (
                            <Reveal key={step.title} delay={i * 200} className="relative text-center">
                                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                                    <span className="absolute inset-0 rounded-full bg-primary-200" style={{ animation: `pulse-ring 2.4s ease-out ${i * 0.5}s infinite` }} />
                                    <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                                        <step.icon className="h-7 w-7" />
                                    </span>
                                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">{i + 1}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                                <p className="mt-2 text-gray-600">{step.text}</p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative isolate overflow-hidden bg-gray-900">
                <div className="absolute inset-0 -z-10" aria-hidden="true">
                    <div className="animate-blob absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary-600 opacity-40 blur-3xl" />
                    <div className="animate-blob absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600 opacity-30 blur-3xl" style={{ animationDelay: '-6s' }} />
                    <div className="bg-grid absolute inset-0 opacity-30" />
                </div>
                <div className="px-6 py-24 sm:py-32 lg:px-8">
                    <Reveal className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Ready to scale your outreach?</h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                            Join hundreds of sales professionals using ColdMail.AI to accelerate their pipeline today.
                        </p>
                        <div className="mt-10 flex items-center justify-center">
                            <Link
                                to="/signup"
                                className="btn-shimmer relative overflow-hidden rounded-full bg-primary-500 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 hover:bg-primary-400 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
                            >
                                Create Free Account
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <span className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                        ColdMail.AI
                    </span>
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} ColdMail.AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;