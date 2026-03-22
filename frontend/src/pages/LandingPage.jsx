import { useState, useEffect } from "react";
import {
  motion, useMotionTemplate, useMotionValue,
  useSpring, AnimatePresence
} from "framer-motion";
import {
  ArrowRight, ShieldCheck, Zap, Globe,
  Sparkles, Users, CheckCircle2, Search, PhoneCall
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { ThemeToggle } from "../components/ThemeToggle";

// ── Typing animation hook ─────────────────────────────────────
const useTypingCycle = (words, speed = 80, pause = 1800) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex, words, speed, pause]);

  return displayed;
};

// ── Animated counter ──────────────────────────────────────────
const AnimatedNumber = ({ target }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (1200 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
};

// ── Navbar ────────────────────────────────────────────────────
const PublicNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/60 dark:border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2.5"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 opacity-30 blur-md" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-gradient-brand">
            Mini CRM
          </span>
        </motion.div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600/60 bg-white dark:bg-slate-800/50 hover:border-violet-400/60 hover:shadow-md transition-all"
          >
            Admin Login
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// ── Steps ─────────────────────────────────────────────────────
const steps = [
  {
    icon: <ArrowRight className="w-5 h-5" />,
    label: "You submit",
    desc: "Fill the form with your details",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    line: "bg-violet-200 dark:bg-violet-800",
  },
  {
    icon: <Search className="w-5 h-5" />,
    label: "We review",
    desc: "Team reviews your request",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
    line: "bg-cyan-200 dark:bg-cyan-800",
  },
  {
    icon: <PhoneCall className="w-5 h-5" />,
    label: "We contact you",
    desc: "Within 24 hours guaranteed",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    line: null,
  },
];

const StepIndicator = () => (
  <div className="flex items-start gap-0 w-full">
    {steps.map((step, i) => (
      <div key={i} className="flex items-center flex-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.15 }}
          className="flex flex-col items-center text-center flex-1"
        >
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm ${step.color}`}>
            {step.icon}
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
            {step.label}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight max-w-[80px]">
            {step.desc}
          </p>
        </motion.div>
        {step.line && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
            className={`h-0.5 w-8 mx-1 rounded-full origin-left flex-shrink-0 ${step.line}`}
          />
        )}
      </div>
    ))}
  </div>
);

// ── Feature cards ─────────────────────────────────────────────
const features = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    title: "Secure Data",
    desc: "Enterprise-grade security for your pipeline.",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-100 dark:border-emerald-500/20",
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    title: "Lightning Fast",
    desc: "Optimized flows that feel instant.",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-100 dark:border-amber-500/20",
  },
  {
    icon: <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    title: "Global Reach",
    desc: "Collaborate across regions without friction.",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    border: "border-cyan-100 dark:border-cyan-500/20",
  },
];

// ── Input field component — consistent style ──────────────────
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 dark:focus:border-cyan-500/60 transition-all";

// ── Main ──────────────────────────────────────────────────────
const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", source: "website form",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadCount, setLeadCount] = useState(0);

  const typedWord = useTypingCycle(["Grow", "Convert", "Scale", "Retain", "Close"]);

  useEffect(() => {
    API.get("/leads/count")
      .then(({ data }) => setLeadCount(data.count || 0))
      .catch(() => setLeadCount(0));
  }, []);

  // Spotlight effect — only on the decorative wrapper, not the form itself
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 280, damping: 28 });
  const springY = useSpring(my, { stiffness: 280, damping: 28 });
  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${springX}px ${springY}px, rgba(124,58,237,0.08), transparent 60%)`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      await API.post("/leads", formData);
      setSubmitted(true);
      setLeadCount((c) => c + 1);
      toast.success("Thank you! We'll be in touch soon.");
      setFormData({ name: "", email: "", phone: "", source: "website form" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key) => (e) => setFormData((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen mesh-bg noise-overlay">
      <PublicNavbar />

      <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden">

        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[8%] w-[380px] h-[380px] rounded-full bg-violet-400/15 dark:bg-violet-500/20 blur-[110px] animate-aurora" />
          <div className="absolute bottom-10 right-[6%] w-[340px] h-[340px] rounded-full bg-cyan-400/10 dark:bg-cyan-500/15 blur-[100px] animate-aurora [animation-delay:-6s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,680px)] h-[min(90vw,680px)] rounded-full border border-violet-400/10 dark:border-violet-500/10 animate-spin-slow opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Lead count badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Users className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span><AnimatedNumber target={leadCount} /> leads managed so far</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.1] text-slate-900 dark:text-white">
              The Smarter Way <br />To{" "}
              <span className="text-gradient-brand">
                {typedWord}
                <span className="inline-block w-0.5 h-10 md:h-12 bg-violet-500 dark:bg-cyan-400 ml-0.5 align-middle animate-pulse" />
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed font-medium">
              Submit your request and our team will reach out within 24 hours.
              Simple, fast, and built for real business growth.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group rounded-2xl p-4 border ${f.border} ${f.bg} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                      {f.icon}
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{f.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Steps */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                How it works
              </p>
              <StepIndicator />
            </div>
          </motion.div>

          {/* ── Right — form ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md mx-auto lg:max-w-none"
          >
            {/*
              Decorative gradient border wrapper.
              NO tilt-3d here — that transform-style: preserve-3d
              blocks pointer events on child inputs.
              Spotlight is on this outer div only, not overlaid on inputs.
            */}
            <div className="rounded-[1.75rem] p-[1px] bg-gradient-to-br from-violet-400/50 via-slate-200/50 to-cyan-400/40 dark:from-violet-500/30 dark:via-slate-700/40 dark:to-cyan-400/25 shadow-2xl shadow-violet-500/10 dark:shadow-violet-500/20">

              {/* Inner card — spotlight background is decorative only, inputs sit above it */}
              <div
                className="relative rounded-[1.7rem] overflow-hidden bg-white dark:bg-[#0f1118]"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  mx.set(e.clientX - r.left);
                  my.set(e.clientY - r.top);
                }}
              >
                {/* Spotlight layer — pointer-events none so it never intercepts clicks */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: spotlight }}
                />
                {/* Tint layer — also pointer-events none */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/4 via-transparent to-cyan-500/6 pointer-events-none" />

                {/* All actual content — sits above decorative layers with relative z-10 */}
                <div className="relative z-10 p-7 md:p-8">

                  {/* Header */}
                  <div className="mb-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-500/25">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Get Started Today
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      We'll reach out within 24 hours.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      /* Success state */
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10 text-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            Submission received!
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Expect a call or email within 24 hours.
                          </p>
                        </div>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="text-sm text-violet-600 dark:text-cyan-400 hover:underline font-medium mt-2"
                        >
                          Submit another request
                        </button>
                      </motion.div>
                    ) : (
                      /* Form */
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                      >
                        <Field label="Full Name" required>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={set("name")}
                            placeholder="Jane Smith"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Email" required>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={set("email")}
                            placeholder="jane@company.com"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Phone">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={set("phone")}
                            placeholder="+91 98765 43210"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="How did you hear about us?">
                          <select
                            value={formData.source}
                            onChange={set("source")}
                            className={inputClass + " cursor-pointer appearance-none"}
                          >
                            <option value="website form">Website Form</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="referral">Referral</option>
                            <option value="google ads">Google Ads</option>
                            <option value="cold outreach">Cold Outreach</option>
                            <option value="other">Other</option>
                          </select>
                        </Field>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={submitting}
                          className="btn-brand w-full py-3 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:pointer-events-none text-sm font-semibold"
                        >
                          {submitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>Request a Demo <ArrowRight className="w-4 h-4" /></>
                          )}
                        </motion.button>

                        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                          No spam. We contact you once, personally.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 py-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Mini CRM — Built to manage real clients.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;